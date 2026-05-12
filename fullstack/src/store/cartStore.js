import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as cartService from "../services/cartService";

const STORAGE_KEY = "template-cart-store";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      syncedToAPI: false,
      apiCartId: null,

      addItem: (product, quantity = 1) => {
        const parsedQuantity = Math.max(1, Number(quantity) || 1);
        const existing = get().items.find(
          (item) => Number(item.product.id) === Number(product.id),
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              Number(item.product.id) === Number(product.id)
                ? { ...item, quantity: item.quantity + parsedQuantity }
                : item,
            ),
          });
          return;
        }

        set({ items: [...get().items, { product, quantity: parsedQuantity }] });
      },

      updateItemQuantity: (id, quantity) => {
        const parsedQuantity = Number(quantity) || 0;
        if (parsedQuantity <= 0) {
          set({
            items: get().items.filter(
              (item) => Number(item.product.id) !== Number(id),
            ),
          });
          return;
        }

        set({
          items: get().items.map((item) =>
            Number(item.product.id) === Number(id)
              ? { ...item, quantity: parsedQuantity }
              : item,
          ),
        });
      },

      incrementItem: (id) => {
        const item = get().items.find(
          (cartItem) => Number(cartItem.product.id) === Number(id),
        );
        if (!item) return;
        get().updateItemQuantity(id, item.quantity + 1);
      },

      decrementItem: (id) => {
        const item = get().items.find(
          (cartItem) => Number(cartItem.product.id) === Number(id),
        );
        if (!item) return;
        get().updateItemQuantity(id, item.quantity - 1);
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(
            (item) => Number(item.product.id) !== Number(id),
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + Number(item.quantity), 0),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
          0,
        ),

      // API Integration methods
      syncCartToAPI: async (userId) => {
        try {
          const items = get().items;
          const cartData = cartService.convertCartToAPI(items, userId);
          
          const result = await cartService.createCart(cartData);
          
          if (result.success) {
            set({
              syncedToAPI: true,
              apiCartId: result.data.id,
            });
            return { success: true, cartId: result.data.id };
          }
          
          return { success: false, error: result.error };
        } catch (error) {
          console.error('Error syncing cart to API:', error);
          return { success: false, error: error.message };
        }
      },

      updateCartOnAPI: async (cartId, userId) => {
        try {
          const items = get().items;
          const cartData = cartService.convertCartToAPI(items, userId);
          
          const result = await cartService.updateCart(cartId, cartData);
          
          if (result.success) {
            set({ syncedToAPI: true });
            return { success: true };
          }
          
          return { success: false, error: result.error };
        } catch (error) {
          console.error('Error updating cart on API:', error);
          return { success: false, error: error.message };
        }
      },

      loadCartFromAPI: async (cartId) => {
        try {
          const result = await cartService.getCartById(cartId);
          
          if (result.success) {
            set({ 
              syncedToAPI: true,
              apiCartId: result.data.id,
            });
            return { success: true, cart: result.data };
          }
          
          return { success: false, error: result.error };
        } catch (error) {
          console.error('Error loading cart from API:', error);
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCartStore;

