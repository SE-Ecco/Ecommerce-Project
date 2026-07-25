// WHAT: Business logic for categories — CRUD per shop
// IMPORTS: models/Category.ts
// USED BY: controllers/category.controller.ts
// ⚠️ Always filters by shop_id — shop_admin can only manage their own categories
import Category from '../models/Category';

export const getCategories = async (shop_id: number) => {

    return await Category.findAll({ where: { shop_id }, })

}

export const getCategoryById = async (id: number, shop_id: number) => {

    const category = await Category.findOne({
        where: { id, shop_id },
    });

    if (!category) throw new Error('category not found');


    return category;
};


export const createCategory = async (
    shop_id: number,
    data: { name: string; }
) => {
    return await Category.create({ shop_id, ...data });
}

export const updateCategory = async (
    shop_id: number,
    id: number,
    data: { name: string; }
) => {
    const category = await getCategoryById(id, shop_id);
    await category.update(data);

    return category;
}

export const deleteCategory = async (
    id: number,
    shop_id: number
) => {
    const category = await getCategoryById(id, shop_id);
    await category.destroy();
    return { message: 'Category deleted successfully' };
}