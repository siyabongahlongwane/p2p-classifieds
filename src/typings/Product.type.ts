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

export interface LikeItem {
    like_id: number;
    user_id: number;
    product_id: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Photo {
    photo_id: number;
    product_id: number;
    photo_url: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductWithLike {
    product_id: number;
    user_id: number;
    shop_id: number;
    title: string;
    description: string;
    price: string;
    condition: string;
    category_id: number;
    location: string;
    province: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    like_item: LikeItem;
    photos: Photo[];
  }