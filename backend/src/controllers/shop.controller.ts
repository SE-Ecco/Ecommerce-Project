import { Request, Response, NextFunction } from 'express'
import { getShopsList, getShopBySlugFromDB, getShopByIdFromDB } from '../services/shop.service'
import { successResponse, errorResponse } from '../utils/response'

export const getAllShops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shops = await getShopsList()
    res.json(successResponse(shops))
  }
  catch (error) {
    next(error)
  }
}

export const getShopBySlug = async (
    req: Request<{slug: string}>,
    res: Response,
    next: NextFunction
) => {
  try {
    const { slug } = req.params
    const shop = await getShopBySlugFromDB(slug)
    res.json(successResponse(shop))
  } catch (error) {
    next(error)
  }
}

export const getShopById = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
  try {
    const shopId = Number(req.params.id)
    const shop = await getShopByIdFromDB(shopId)
    res.json(successResponse(shop))
  } catch (error) {
    next(error)
  }
}