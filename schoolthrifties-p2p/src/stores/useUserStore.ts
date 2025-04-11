import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../typings';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }, false, 'user/setUser'),
      }),
      {
        name: 'user-storage', // localStorage key
      }
    ),
    { name: 'User Store' }
  )
);
