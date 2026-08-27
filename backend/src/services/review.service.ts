import Review from '../models/Productreview';
import Product from '../models/Product';

export const createReview = async (
    userId: number,
    productId: number,
    rating: number,
    comment: string | null
) => {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');

    // ✅ CHECK: already reviewed?
    const existing = await Review.findOne({
        where: { user_id: userId, product_id: productId }
    });
    if (existing) throw new Error('You have already reviewed this product');

    return await Review.create({
        user_id: userId,
        product_id: productId,
        shop_id: product.shop_id,
        rating,
        comment
    });
};

export const getReviewsByProduct = async (productId: number) => {
    return await Review.findAll({
        where: { product_id: productId },
        order: [['created_at', 'DESC']]
    });
};