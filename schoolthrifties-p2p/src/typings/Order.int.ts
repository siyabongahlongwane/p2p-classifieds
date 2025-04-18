import { PlainProduct } from "./Product.type";

export interface OrderItem {
    order_item_id: number;
    order_id: number;
    product_id: number;
    price: string;
    seller_gain: string;
    product: PlainProduct;
}

export interface OrderWithItems {
    order_id: number;
    user_id: number;
    shop_id: number;
    status: string;
    total_price: string;
    seller_gain: string;
    delivery_cost: string;
    province: string;
    pudo_locker_location: string;
    phone_number: string;
    payment_option: string;
    shipping_method: string;
    isPaid: boolean;
    datePaid: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    user: { first_name: string, last_name: string, email: string, phone: string };
}

export interface OrderPreview {
    order_id: string;
    buyerName: string;
    date: string;
    totalAmount: string;
    status: string;
    isPaid: boolean;
    user_id: number;
}