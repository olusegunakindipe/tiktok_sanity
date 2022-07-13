import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface IProps {
  _id: string;
  _type: string;
  username: string;
  image: string;
}
const authStore = (set: any) => ({
  userProfile: {} as IProps,
  addUser: (user: IProps) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),
});

const useAuthStore = create(
  persist(authStore, {
    name: 'auth',
  })
);

export default useAuthStore;
