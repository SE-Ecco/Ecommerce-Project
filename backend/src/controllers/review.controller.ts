import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { successResponse, errorResponse } from '../utils/response';

export const getReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const productId = Number(req.params.id);
        if (!productId || isNaN(productId)) {
            res.status(400).json(errorResponse('Valid product ID is required'));
            return;
        }

        const reviews = await reviewService.getReviewsByProduct(productId);
        res.status(200).json(successResponse(reviews));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching reviews'));
    }
};

export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { productId, shopId, orderId, rating, comment } = req.body;

        if (!userId) {
            res.status(401).json(errorResponse('User not authenticated'));
            return;
        }

        if (!productId || !shopId || !orderId || !rating) {
            res.status(400).json(errorResponse('productId, shopId, orderId, and rating are required'));
            return;
        }

        const review = await reviewService.createReview(
            userId,
            productId,
            shopId,
            orderId,
            rating,
            comment ?? null
        );

        res.status(201).json(successResponse(review));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating review'));
    }
};