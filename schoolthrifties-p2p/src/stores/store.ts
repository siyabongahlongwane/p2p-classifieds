import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CartItem, LikeItem, ProductWithLike } from '../typings';
import { ReactNode } from 'react';

type Store = {
    likes: LikeItem[],
    cart: CartItem[],
    selectedProduct: any;
    categories: Array<{ title: string, category_id: number }>;
    provinces: string[];
    productConditions: string[];
    isLoading: boolean,
    checkoutCrumbs: Array<{
        title: string,
        route: string
    }>,
    error: Error | null | string,
    toast: {
        isOpen: boolean,
        message: string,
        severity: 'success' | 'error' | 'info' | 'warning',
        duration?: number
    },
    submitForm: boolean,
    formValid: boolean
    activeNavItem: number,
    basicModal: {
        isOpen: boolean,
        title: string,
        description: string,
        component?: ReactNode
    },
    orderObject: any,
    productPhotos: any[],
    selectedShop: any,
    productStatuses: string[],
    activeMenuItem: number,
    filteredMenuItems: any[],
    ageRanges: string[],
    shoeSizes: string[],
    [key: string]: any
}

type StoreActions = {
    setLikes: (likes: LikeItem[]) => void,
    setCart: (likes: CartItem[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setField: ([key]: string, val: any) => void,
    setToast: (toast: any) => void
}

export const useStore = create<Store & StoreActions>()(devtools(((set) => ({
    likes: [],
    cart: [],
    isLoading: false,
    error: null,
    selectedProduct: null,
    categories: [],
    provinces: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"],
    productConditions: ['New', 'Used', 'Good', 'Well Worn', 'Other'],
    checkoutCrumbs: [{
        title: 'My Cart',
        route: '/cart'
    },
    {
        title: 'Shipping Details',
        route: '/shipping-details'
    },
    {
        title: 'Payment',
        route: '/payment'
    }],
    toast: {
        isOpen: false,
        message: '',
        severity: 'success',
    },
    submitForm: false,
    formValid: false,
    activeNavItem: 0,
    basicModal: {
        isOpen: false,
        title: '',
        description: '',
        component: null
    },
    orderObject: {
        user_id: '',
        deliveryCost: 0,
        province: '',
        pudoLockerLocation: '',
        phoneNumber: '',
        paymentOption: 'Ozow'
    },
    productPhotos: [],
    selectedShop: {},
    productStatuses: ['Available', 'Sold', 'Unpublished'],
    activeMenuItem: 0,
    filteredMenuItems: [],
    ageRanges: ['Any age', '0 - 3 M', '3 - 6 M', '6 - 12 M', '12 - 18 M', '18 - 24 M', '2 - 3 Y', '3 - 4 Y', '4 - 5 Y', '5 - 6 Y', '6 - 7 Y', '7 - 8 Y', '8 - 9 Y', '9 - 10 Y'
    ],
    shoeSizes: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '1', '2', '3'],
    setLikes: (likes) => set({ likes }),
    setCart: (cart) => set({ cart }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setField: (key, val) => set({ [key]: val }),
    setToast: (toast) => set({ toast })
}))));

mountStoreDevtool('store', useStore);
