import { create } from 'zustand';

interface IToastStore {
    isOpen: boolean;
    message: string;
    severity: 'info' | 'success' | 'error' | 'warning';
    showToast: (message: string, severity?: 'info' | 'success' | 'error' | 'warning') => void;
    hideToast: () => void;
}

const useToastStore = create<IToastStore>((set) => ({
    isOpen: false,
    message: '',
    severity: 'info', // 'info', 'success', 'error', 'warning'
    showToast: (message, severity = 'info') =>
        set({ isOpen: true, message, severity }),
    hideToast: () => set({ isOpen: false, message: '', severity: 'info' }),
}));

export default useToastStore;
