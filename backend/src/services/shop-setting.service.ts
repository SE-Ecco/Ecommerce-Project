import ShopSettings from '../models/Shopsettings';

export const getShopSettings = async (shopId: number) => {
  const [settings] = await ShopSettings.findOrCreate({
    where: { shop_id: shopId },
    defaults: { shop_id: shopId },
  });

  return settings;
};


export const updateShopSettings = async (
  shopId: number,
  updates: {
    currency?: string;
    language?: string;
    theme_color?: string;
    meta_title?: string;
    meta_desc?: string;
    extra?: object;
  }
) => {
  const [settings] = await ShopSettings.findOrCreate({
    where: { shop_id: shopId },
    defaults: { shop_id: shopId },
  });

  // WHY loop + set(): only update fields the caller actually sent (skip undefined),
  // leave everything else untouched (partial update, not full overwrite)
  Object.keys(updates).forEach((key) => {
    const value = (updates as any)[key];
    if (value !== undefined) {
      settings.set(key, value);
    }
  });

  await settings.save();

  return settings;
};