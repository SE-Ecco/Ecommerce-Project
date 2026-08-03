import Address from '../models/Address';

export const createAddress = async (
    user_id: number,
    shop_id: number,
    data: {
        label: string,
        full_name: string,
        phone: string,
        city: string,
        district?: string,
        street: string,
        notes?: string,
        is_default?: boolean
    },
) => {
    return await Address.create({ user_id, shop_id, ...data });
}

export const getAddresses = async (user_id: number, shop_id: number) => {
    return await Address.findAll({ where: { user_id, shop_id } })
}

export const updateAddress = async (
    id: number,
    user_id: number,
    data: {
        label?: string,
        full_name?: string,
        phone?: string,
        city?: string,
        district?: string,
        street?: string,
        notes?: string,
        is_default?: boolean
    },
) => {
    const address = await Address.findOne({ where: { id, user_id } });

    if (!address) {
        throw new Error('Address not found');
    }

    await address.update(data);
    return address;
}

export const deleteAddress = async (
    id: number,
    user_id: number
) => {
    const address = await Address.findOne({ where: { id, user_id } });
    if (!address) throw new Error('address item not found');
    await address.destroy();
    return { message: 'Address deleted successfully' };
}