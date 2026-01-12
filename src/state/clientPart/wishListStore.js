import { create } from "zustand";

const wishListStore = create((set) => ({
    wishListItems: [],
    addToWishList: (item) => set((state) => ({
        wishListItems: [...state.wishListItems, item],
    })),
    removeFromWishList: (itemId) => set((state) => ({
        wishListItems: state.wishListItems.filter((item) => item.id !== itemId),
    })),
}))

export default wishListStore;