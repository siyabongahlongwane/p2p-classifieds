import { create } from 'zustand';

interface IToastStore {
    isOpen: boolean;
    message: string;
    severity: 'info' | 'success' | 'error' | 'warning';
    duration?: number;
    showToast: (message: string, severity?: 'info' | 'success' | 'error' | 'warning', duration?: number) => void;
    hideToast: () => void;
}

const useToastStore = create<IToastStore>((set) => ({
    isOpen: false,
    message: '',
    severity: 'info', // 'info', 'success', 'error', 'warning'
    showToast: (message, severity = 'info', duration) =>
        set({ isOpen: true, message, severity, duration }),
    hideToast: () => set({ isOpen: false, message: '', severity: 'info' }),
}));

export default useToastStore;
