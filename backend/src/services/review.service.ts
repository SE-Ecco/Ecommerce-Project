

import  Review  from '../models/Review';

export const createReview = async (
    userId: number,
    productId: number,
    shopId: number,
    orderId: number,
    rating: number,
    comment: string | null
) => {
    return await Review.create({
        user_id: userId,
        product_id: productId,
        shop_id: shopId,
        order_id: orderId,
        rating,
        comment
    });
};

export const getReviewsByProduct = async (productId: number) => {
    return await Review.findAll({
        where: {product_id: productId},
        order: [['created_at', 'DESC']]
    });
};