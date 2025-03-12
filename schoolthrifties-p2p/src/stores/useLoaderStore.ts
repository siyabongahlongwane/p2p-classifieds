import { create } from 'zustand';


export interface LoaderStore {
  loading: boolean;
  message: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const useLoaderStore = create<LoaderStore>((set) => ({
  loading: false,
  message: "Loading...",
  showLoader: (message = "Loading...") => set({ loading: true, message }),
  hideLoader: () => set({ loading: false, message: "" }),
}));

export default useLoaderStore;
