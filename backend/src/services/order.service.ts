// USED BY: controllers/order.controller.ts
// LOGIC: validate stock → snapshot prices into order_items → create order → reduce stock
// STATUSES: pending → confirmed → shipped → delivered (or cancelled at any point)

import { Order, OrderItem } from '../models/Order-OrderItem';
import Product from '../models/Product';
import sequelize from '../config/database';
import  PaymentTransaction  from '../models/Paymenttransaction';

// ── PLACE ORDER ──────────────────────────────────────────────
export const placeOrder = async (
    userId: number,
    shopId: number,
    items: { product_id: number; quantity: number }[],
    addressId: number | null,
    notes: string | null
) => {
    const transaction = await sequelize.transaction();

    try {
        if (!items || items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        let totalAmount = 0;
        const orderItemsData: {
            product_id: number;
            quantity: number;
            unit_price: number;
        }[] = [];

        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction });

            if (!product) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            if (product.get('stock') < item.quantity) {
                throw new Error(`Not enough stock for product ${item.product_id}`);
            }

            const productShopId = product.get('shop_id') as number;
            if (productShopId !== shopId) {
                throw new Error(`product ${item.product_id} does not belong to this shop`);
            }

            const unitPrice = Number(product.get('price'));
            totalAmount += unitPrice * item.quantity;

            orderItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: unitPrice,
            });
        }

        const order = await Order.create(
            {
                shop_id: shopId,
                user_id: userId,
                address_id: addressId,
                status: 'pending',
                total_amount: totalAmount,
                discount_amount: 0,
                notes,
            },
            { transaction }
        );

        for (const itemData of orderItemsData) {
            await OrderItem.create(
                {
                    order_id: order.get('id'),
                    product_id: itemData.product_id,
                    quantity: itemData.quantity,
                    unit_price: itemData.unit_price,
                },
                { transaction }
            );

            await Product.decrement(
                { stock: itemData.quantity },
                { where: { id: itemData.product_id }, transaction }
            );
        }

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// ── GET MY ORDERS ────────────────────────────────────────────
export const getMyOrders = async (userId: number) => {
    return Order.findAll({
        where: { user_id: userId },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']],
    });
};

// ── GET SHOP ORDERS ──────────────────────────────────────────
export const getShopOrders = async (shopId: number) => {
    return Order.findAll({
        where: { shop_id: shopId },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']],
    });
};

// ── UPDATE ORDER STATUS ──────────────────────────────────────
export const updateStatus = async (
    orderId: number,
    shopId: number,
    newStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) => {
    const order = await Order.findOne({
        where: { id: orderId, shop_id: shopId },
    });

    if (!order) {
        throw new Error('Order not found or does not belong to this shop');
    }

    order.set('status', newStatus);
    await order.save();

    return order;
};


/*
    ====================
    Payment transaction
    ====================
*/

export const createPaymentTransaction = async (
    orderId: number,
    shopId: number,
    amount: number,
    paymentMethod: string
) => {
    return await PaymentTransaction.create({
        order_id: orderId,
        shop_id: shopId,
        amount,
        payment_method: paymentMethod
        // status left out on purpose → defaults to 'pending' (single source of truth ✅)
    });
};

export const updatePaymentStatus = async (
    transactionId: number,
    shopId: number,
    status: 'completed' | 'failed' | 'refunded',
    transactionRef: string | null
) => {
    // 1. find the transaction — must belong to THIS shop 🔒
    const transaction = await PaymentTransaction.findOne({
        where: { id: transactionId, shop_id: shopId }
    });

    // 2. not found or wrong shop → throw
    if (!transaction) throw new Error('Payment transaction not found');

    // 3. update status + reference
    transaction.status = status;
    transaction.transaction_ref = transactionRef;
    await transaction.save();

    // 4. return updated transaction
    return transaction;
};