import { create } from "zustand";

interface IUserStore {
  isLoggedIn: boolean;
  walletAddress: string;
  toggleLoggedIn: (state: IUserStore) => void;
  setWalletAddress: (walletAddress: string) => void;
  clearWalletAddress: () => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  isLoggedIn: false,
  walletAddress: "",
  toggleLoggedIn: (state: IUserStore) => set({ isLoggedIn: !state.isLoggedIn }),
  setWalletAddress: (walletAddress: string) =>
    set({ walletAddress: walletAddress }),
  clearWalletAddress: () =>
    set({
      walletAddress: "",
    }),
}));
