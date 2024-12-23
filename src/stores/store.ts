import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
    likes: any[],
    cart: any[],
    selectedProduct: any;
    categories: Array<{title: string, category_id: number}>;
    provinces: string[];
    productConditions: string[];
    isLoading: boolean,
    checkoutCrumbs: Array<{
        title: string,
        route: string
    }>,
    error: Error | null | any,
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
        component?: any
    },
    orderObject: any,
    productPhotos: any[],
    selectedShop: any,
    productStatuses: string[]
}

type StoreActions = {
    setLikes: (likes: any[]) => void,
    setCart: (likes: any[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setField: ([key]: any, val: any) => void,
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
    setLikes: (likes) => set({ likes }),
    setCart: (cart) => set({ cart }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setField: (key, val) => set({ [key]: val }),
    setToast: (toast) => set({ toast })
}))));

mountStoreDevtool('store', useStore);
