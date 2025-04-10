export type NewProduct = {
  product_id: number;
  title: string;
  description: string;
  price: string;
  seller_gain?: string;
  category_id: string;
  condition: string;
  location: string;
  province: string;
  status?: string;
  shoe_size: string;
  child_age: string;
  gender: string;
  productPhotos: Array<{ photo_url: string, photo_id?: number }>;
}

class NewProductCls {
  title = '';
  description = '';
  price = '';
  seller_gain = '';
  category_id = '';
  condition = '';
  location = '';
  province = '';
  status = 'Available';
  shoe_size = '';
  child_age = '';
  gender = '';
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

export interface PlainProduct {
  product_id: number;
  user_id: number;
  shop_id: number;
  title: string;
  description: string;
  price: string;
  seller_gain: string;
  condition: string;
  category_id: number;
  location: string;
  province: string;
  status: string;
  photos: Photo[];
}

export interface ProductWithLike extends PlainProduct {
  like_item: LikeItem;
}

export interface CartItem extends PlainProduct {
  cart_item: {
    cart_item_id: number;
    user_id: number;
    product_id: number;
  };
}