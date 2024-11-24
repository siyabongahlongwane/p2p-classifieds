export type NewProduct = {
    title: string;
    description: string;
    price: string;
    category_id: string;
    condition: string;
    location: string;
    province: string;
    productPhotos: Array<{ photo_url: string }>;
}

class NewProductCls {
    title = '';
    description = '';
    price = '';
    category_id = '';
    condition = '';
    location = '';
    province = '';
    productPhotos = [];
}

export const newProduct = new NewProductCls();