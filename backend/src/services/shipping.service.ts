import ShippingMethod from '../models/Shippingmethod';

export const getShippingMethods = async (shop_id: number) => {
  return await ShippingMethod.findAll({
    where: { shop_id,is_active: true }, // only active ones
  });
};

export const createShippingMethod = async (
  shop_id: number,
  data: {
    name: string;
    price?: number;
    min_days?: number;
    max_days?: number;
  }
) => {
  return await ShippingMethod.create({ shop_id, ...data });
};

export const updateShippingMethod = async (
  id: number,
  shop_id: number,
  data: object
) => {
  const method = await ShippingMethod.findOne({
    where: { id, shop_id },
  });
  if (!method) throw new Error('Shipping method not found');
  await method.update(data);
  return method;
};

export const deleteShippingMethod = async (id: number, shop_id: number) => {
  const method = await ShippingMethod.findOne({
    where: { id, shop_id },
  });
  if (!method) throw new Error('Shipping method not found');
  await method.destroy(); // hard delete — shipping methods can be fully removed
  return { message: 'Shipping method deleted successfully' };
};