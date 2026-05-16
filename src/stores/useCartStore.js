import { defineStore } from "pinia";
import api from "../services/axios";
import { useAuthStore } from "./useAuthStore";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    cartCount: (state) => state.items.length,
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + parseFloat(item.course.price || 0);
      }, 0).toFixed(2);
    },
    isInCart: (state) => (courseId) => {
      return state.items.some((item) => item.course.id === courseId);
    },
  },

  actions: {
    async fetchCart() {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) return;

      this.loading = true;
      try {
        const response = await api.get("/cart");
        this.items = response.data.data;
      } catch (err) {
        console.error("Error fetching cart:", err);
        this.error = "Failed to load cart items.";
      } finally {
        this.loading = false;
      }
    },

    async addToCart(courseId) {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) {
        // Redirect or alert
        return false;
      }

      try {
        const response = await api.post("/cart", { course_id: courseId });
        this.items.unshift(response.data.data);
        return true;
      } catch (err) {
        console.error("Error adding to cart:", err);
        if (err.response?.status === 422) {
          // Already in cart
          return true;
        }
        return false;
      }
    },

    async removeFromCart(cartId) {
      try {
        await api.delete(`/cart/${cartId}`);
        this.items = this.items.filter((item) => item.id !== cartId);
        return true;
      } catch (err) {
        console.error("Error removing from cart:", err);
        return false;
      }
    },
    
    clearCartLocal() {
        this.items = [];
    }
  },
});
