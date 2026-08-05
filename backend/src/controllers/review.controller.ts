import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { successResponse, errorResponse } from '../utils/response';

export const getReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
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
        next(error); // 🔧 Fix: use error middleware
    }
};

export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const { productId, orderId, rating, comment } = req.body; // 🔧 shopId removed

        if (!userId) {
            res.status(401).json(errorResponse('User not authenticated'));
            return;
        }

        const review = await reviewService.createReview(
            userId,
            productId,
            orderId,
            rating,
            comment ?? null
        );
        res.status(201).json(successResponse(review));
    } catch (error) {
        next(error); // 🔧 Fix: use error middleware
    }
};
