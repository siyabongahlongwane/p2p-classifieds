import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
    likes: any[],
    cart: any[],
    selectedProduct: any;
    categories: any;
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
    }
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
    checkoutCrumbs: [{
        title: 'My Cart',
        route: '/cart'
    },
    {
        title: 'Shipping Address',
        route: '/shipping-address'
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
    setLikes: (likes) => set({ likes }),
    setCart: (cart) => set({ cart }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setField: (key, val) => set({ [key]: val }),
    setToast: (toast) => set({ toast })
}))));

mountStoreDevtool('store', useStore);
