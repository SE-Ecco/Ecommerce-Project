// WHAT: Business logic for orders — create, list, update status
// IMPORTS: models/Order.ts, models/OrderItem.ts, models/Product.ts
// USED BY: controllers/order.controller.ts
// LOGIC: validate stock → snapshot prices into order_items → create order → reduce stock
// STATUSES: pending → confirmed → shipped → delivered (or cancelled at any point)

import { Order, OrderItem } from '../models/Order-OrderItem';
import Product from '../models/Product';
import sequelize from '../config/database';

// ── PLACE ORDER ──────────────────────────────────────────────
// customer checks out → creates one Order + its OrderItems
// wrapped in a TRANSACTION: either everything saves, or nothing does
export const placeOrder = async (
    userId: number,                                     // WHY: comes from JWT (auth.middleware), never trust req.body for identity
    tenantId: number,                                   // WHY: comes from JWT/cart context — decides WHICH shop owns this order
    items: { product_id: number; quantity: number }[],  // WHY: customer sends WHAT they want, not WHO they are
    addressId: number | null,                           // WHY: nullable — order might be store pickup, not delivery
    notes: string | null                                // WHY: optional — most orders don't need special instructions
) => {
    // WHY a transaction: an order touches 3 things (Order, OrderItem, Product stock).
    // if we crash halfway, we'd get a broken half-saved order — transaction prevents that.
    const transaction = await sequelize.transaction();

    try {
        // WHY: an order with 0 items makes no business sense — fail fast before touching DB
        if (!items || items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        let totalAmount = 0;                    // WHY: total isn't sent by the customer — NEVER trust a client-sent price/total

                                                // WHY a separate array: we validate everything FIRST, only commit to DB writes
                                                // once we know the WHOLE cart is valid (no partial validation)
        const orderItemsData: {
            product_id: number;
            quantity: number;
            unit_price: number;                 // WHY snapshot: price today ≠ price when order is viewed later
        }[] = [];

                                                // 1️⃣ validate every product in the cart BEFORE creating anything
                                                // WHY loop first, create later: cheaper to fail early than to rollback expensive writes
        for (const item of items) {
                                                    // WHY pass {transaction}: this read must be part of the SAME all-or-nothing unit
            const product = await Product.findByPk(
                item.product_id,
                { transaction: transaction }
            );

            // WHY: customer could send a fake/deleted product_id — always verify it exists
            if (!product) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            // WHY: prevents overselling — two customers can't both buy the last item
            if (product.get('stock') < item.quantity) {
                throw new Error(`Not enough stock for product ${item.product_id}`);
            }

            // WHY this check exists: DB design = ONE order belongs to ONE shop (tenant_id on Order).
            // if we let customers mix shops, the single tenant_id on Order would be wrong/meaningless.
            const productTenantId = product.get('tenant_id') as number;
            if (productTenantId !== tenantId) {
                throw new Error(`product ${item.product_id} does not belong to this shop`);
            };

            // WHY read price NOW, not later: prices change over time, but a receipt must never change
            const unitPrice = Number(product.get('price'));
            totalAmount += unitPrice * item.quantity; // WHY: total = sum of (price × qty) for every line

            // WHY collect here instead of writing immediately: keeps the "validate all, then write all"
            // pattern — avoids writing item 1 and then failing on item 2's stock check
            orderItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: unitPrice,
            });
        }

        // 2️⃣ create the Order header (the "receipt top")
        // WHY after the loop: by now every item is validated, so we know this order is legitimate
        const order = await Order.create(
            {
                tenant_id: tenantId,       // WHY: which shop gets credit/responsibility for this order
                user_id: userId,           // WHY: which customer placed it (for getMyOrders later)
                address_id: addressId,
                status: 'pending',         // WHY default 'pending': every order needs shop confirmation first
                total_amount: totalAmount, // WHY: calculated server-side, never accepted from client
                discount_amount: 0,        // WHY 0 here: no coupon system built yet (future feature)
                notes,
            },
            { transaction: transaction }   // WHY: this write must join the same transaction as everything else
        );

        // 3️⃣ create each OrderItem (receipt lines) + reduce product stock
        for (const itemData of orderItemsData) {
            // WHY separate table (not JSON inside Order): lets us query/report per-product later,
            // and keeps unit_price permanently frozen per line
            await OrderItem.create(
                {
                    order_id: order.get('id'),          // WHY: links this line back to its parent order
                    product_id: itemData.product_id,
                    quantity: itemData.quantity,
                    unit_price: itemData.unit_price,    // WHY: reuses the SAME snapshot taken in step 1,
                                                        // never re-reads product.price here
                },
                { transaction: transaction }
            );

            // WHY decrement now (not step 1): only reduce real stock once we're SURE
            // the whole order is going through — avoids reducing stock for a cancelled attempt
            await Product.decrement(
                { stock: itemData.quantity },
                { where: { id: itemData.product_id }, transaction: transaction }
            );
        }

        // WHY commit last: only after EVERY step above succeeded do we make it permanent
        await transaction.commit();

        return order;
    } catch (error) {
        // WHY rollback: undoes every write in this transaction — Order, OrderItems, stock changes —
        // so a failed order leaves ZERO trace in the database
        await transaction.rollback();
        throw error; // WHY re-throw: controller's next(error) sends the proper HTTP error response
    }
};

// ── GET MY ORDERS ────────────────────────────────────────────
// customer views their OWN order history (any logged-in user)
export const getMyOrders = async (userId: number) => {
    return Order.findAll({
        where: { user_id: userId },                   // WHY: security — user only ever sees THEIR OWN orders
        include: [{ model: OrderItem, as: 'items' }], // WHY: a receipt without line items is useless to show
        order: [['created_at', 'DESC']],              // WHY DESC: customers care about recent orders first
    });
};

// ── GET SHOP ORDERS ──────────────────────────────────────────
// shop owner views ALL orders received by their shop
export const getShopOrders = async (tenantId: number) => {
    return Order.findAll({
        where: { tenant_id: tenantId },            // WHY: security — shop owner only sees THEIR shop's orders
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']],
    });
};

// ── UPDATE ORDER STATUS ──────────────────────────────────────
// shop owner changes an order's status (pending → confirmed → shipped → ...)
// tenantId check prevents Shop A from updating Shop B's orders
export const updateStatus = async (
    orderId: number,
    tenantId: number,      // WHY required here: without this, ANY shop could update ANY order — huge security hole
    newStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) => {
    // WHY combine id + tenant_id in ONE where clause: this is the actual security check —
    // if the order exists but belongs to a different shop, findOne returns null (not the real order)
    const order = await Order.findOne(
        {
            where: {
                id: orderId,
                tenant_id: tenantId
            }
        }
    );

    // WHY this covers 2 cases with one message: order truly doesn't exist,
    // OR it exists but belongs to someone else — caller doesn't need to know which (avoids leaking info)
    if (!order) {
        throw new Error('Order not found or does no belong to this shop');
    }

    order.set('status', newStatus);                         // WHY .set() then .save(): standard Sequelize update pattern
    await order.save();

    return order;
};

// ── 🍽️ THE STORY (for teaching the team) ──────────────────
//
// order.service.ts = the CHEF in the restaurant 👨‍🍳
//
// the cashier (controller) walks in and says:
//   "table 5 wants 2x Olive Oil + 1x Bread!"
//
// the chef doesn't talk to the customer, doesn't touch req/res —
// the chef just COOKS:
//   1. checks the fridge (stock) — enough ingredients? ✅/❌
//   2. checks the ingredients all came from THIS restaurant's fridge
//      (can't mix Zaytoon's olive oil with Duhok Bakery's bread in one order!)
//   3. writes down today's price on the receipt BEFORE cooking
//      (unit_price snapshot — even if prices change tomorrow,
//      this receipt keeps showing what was ACTUALLY charged)
//   4. cooks everything together as ONE ticket (transaction) —
//      either the whole meal comes out, or the chef throws the
//      entire ticket away and starts over (rollback).
//      no half-cooked meals ever leave the kitchen! 🔥
//   5. updates the fridge inventory (stock decrement)
//   6. hands the finished plate back to the cashier (return order)
//
// getMyOrders   = customer asking "what have I ordered before?"
// getShopOrders = shop owner asking "what has MY restaurant sold?"
// updateStatus  = chef/waiter updating the ticket: pending → cooking → served
//                 (but only for tickets from THEIR OWN restaurant!)