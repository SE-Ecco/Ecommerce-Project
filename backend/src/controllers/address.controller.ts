import { Request, Response } from 'express';
import * as addressService from '../services/address.service';
import { successResponse, errorResponse } from '../utils/response';

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const address = await addressService.getAddresses(user_id, shop_id);
        res.status(200).json(successResponse(address));
    }
    catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }

}

export const createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop_id = req.user!.shop_id as number;
        const user_id = req.user!.id as number;
        const address = await addressService.createAddress(user_id, shop_id, req.body);
        res.status(201).json(successResponse(address));
    } catch (error) {
        res.status(500).json(errorResponse((error as Error).message));
    }
}

export const updateAddress = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const address = await addressService.updateAddress(id, user_id, req.body);
        res.status(200).json(successResponse(address));
    }
    catch (error) {
        res.status(404).json(errorResponse((error as Error).message));
    }
}

export const deleteAddress = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const user_id = req.user!.id as number;
        const address = await addressService.deleteAddress(id, user_id);
        res.status(200).json(successResponse(address));

    }
    catch (error) {
        res.status(404).json(errorResponse((error as Error).message));

    }

}