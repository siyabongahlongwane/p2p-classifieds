export type User = {
    user_id: number;
    shop_id: number;
    google_id: string | null;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    location: string | null;
    phone: string;
    completed_registration: boolean;
    roles: number[];
    createdAt: string;
    updatedAt: string;
};
