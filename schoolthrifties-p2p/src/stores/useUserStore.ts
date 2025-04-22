import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../typings';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  removeUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }, false, 'user/setUser'),
        removeUser: () => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          set({ user: null }, false, 'user/removeUser')
        },
      }),
      {
        name: 'user-storage', // localStorage key
      }
    ),
    { name: 'User Store' }
  )
);
