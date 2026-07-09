// WHAT: Handles HTTP requests for shop info (public)
// IMPORTS: services/shop.service.ts, utils/response.ts
// USED BY: routes/shop.routes.ts
// HANDLES: GET all shops, GET shop by slug
import { Request, Response } from 'express'
import { getShopsList, getShopBySlugFromDB } from '../services/shop.service'
import { successResponse, errorResponse } from '../utils/response'

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await getShopsList()
    res.json(successResponse(shops))
  }
  catch (error) {
    res.status(500).json(errorResponse('Failed to fetch shops'))
  } }

  export const getShopBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const shop = await getShopBySlugFromDB(slug)
    res.json(successResponse(shop))
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get shop'))
  }
}