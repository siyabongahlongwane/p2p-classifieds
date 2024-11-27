export type NewProduct = {
    title: string;
    description: string;
    price: string;
    category_id: string;
    condition: string;
    location: string;
    province: string;
    status?: string;
    productPhotos: Array<{ photo_url: string, photo_id?: number }>;
}

class NewProductCls {
    title = '';
    description = '';
    price = '';
    category_id = '';
    condition = '';
    location = '';
    province = '';
    status = 'Available';
    productPhotos = [];
}

export const newProduct = new NewProductCls();