import { Request, Response, NextFunction } from 'express';
import * as shopSettingsService from '../services/shop-setting.service';
import { successResponse, errorResponse } from '../utils/response';

export const getShopSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const shopId = req.user?.shop_id;
        if (!shopId) {
            res.status(400).json(errorResponse('Shop ID is required'));
            return;
        }
        const settings = await shopSettingsService.getShopSettings(shopId);
        res.status(200).json(successResponse(settings));
    } catch (error) {
        next(error); // 🔧 fix: use error middleware
    }
};

export const updateShopSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const shopId = req.user?.shop_id;
        if (!shopId) {
            res.status(400).json(errorResponse('Shop ID is required'));
            return;
        }
        const { currency, language, theme_color, meta_title, meta_desc, extra } = req.body;
        const settings = await shopSettingsService.updateShopSettings(shopId, {
            currency,
            language,
            theme_color,
            meta_title,
            meta_desc,
            extra,
        });
        res.status(200).json(successResponse(settings));
    } catch (error) {
        next(error); // 🔧 fix: use error middleware
    }
};
