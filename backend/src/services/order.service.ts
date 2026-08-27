// USED BY: controllers/order.controller.ts
// LOGIC: validate stock → snapshot prices into order_items → create order → reduce stock
// STATUSES: pending → confirmed → shipped → delivered (or cancelled at any point)

import { Order, OrderItem } from '../models/Order-OrderItem';
import Product from '../models/Product';
import ProductVariant from '../models/Productvariant';
import sequelize from '../config/database';
import PaymentTransaction from '../models/Paymenttransaction';

export const placeOrder = async (
    userId: number,
    shopId: number,
    items: { product_id: number; quantity: number; variant_id?: number }[],
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
            variant_id?: number;
        }[] = [];

        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction });

            if (!product) {
                throw new Error(`Product ${item.product_id} not found`);
            }

            let unitPrice = Number(product.get('price'));

            if (item.variant_id) {
                const variant = await ProductVariant.findOne({
                    where: { id: item.variant_id, product_id: item.product_id },
                    transaction
                });
                if (!variant) {
                    throw new Error(`Variant ${item.variant_id} not found for product ${item.product_id}`);
                }
                if (variant.get('stock') < item.quantity) {
                    throw new Error(`Not enough stock for variant ${item.variant_id}`);
                }
                unitPrice = Number(variant.get('price'));
                await ProductVariant.decrement(
                    { stock: item.quantity },
                    { where: { id: item.variant_id }, transaction }
                );
            } else {
                if (product.get('stock') < item.quantity) {
                    throw new Error(`Not enough stock for product ${item.product_id}`);
                }
            }

            const productShopId = product.get('shop_id') as number;
            if (productShopId !== shopId) {
                throw new Error(`product ${item.product_id} does not belong to this shop`);
            }

            totalAmount += unitPrice * item.quantity;

            orderItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: unitPrice,
                variant_id: item.variant_id,
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
                    variant_id: itemData.variant_id,
                    quantity: itemData.quantity,
                    unit_price: itemData.unit_price,
                },
                { transaction }
            );

            if (!itemData.variant_id) {
                await Product.decrement(
                    { stock: itemData.quantity },
                    { where: { id: itemData.product_id }, transaction }
                );
            }
        }

        await transaction.commit();
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const getMyOrders = async (userId: number) => {
    return Order.findAll({
        where: { user_id: userId },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']],
    });
};

export const getShopOrders = async (shopId: number) => {
    return Order.findAll({
        where: { shop_id: shopId },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']],
    });
};

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

export const createPaymentTransaction = async (
    orderId: number,
    shopId: number,
    amount: number,
    paymentMethod: string
) => {
    const order = await Order.findOne({
        where: { id: orderId, shop_id: shopId }
    });
    if (!order) throw new Error('Order not found or not yours');

    return await PaymentTransaction.create({
        order_id: orderId,
        shop_id: shopId,
        amount,
        payment_method: paymentMethod
    });
};

export const updatePaymentStatus = async (
    transactionId: number,
    shopId: number,
    status: 'completed' | 'failed' | 'refunded',
    transactionRef: string | null
) => {
    const transaction = await PaymentTransaction.findOne({
        where: { id: transactionId, shop_id: shopId }
    });

    if (!transaction) throw new Error('Payment transaction not found');

    transaction.status = status;
    transaction.transaction_ref = transactionRef;
    await transaction.save();
    return transaction;
};