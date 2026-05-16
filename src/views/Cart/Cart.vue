<script setup>
import { onMounted } from "vue";
import { useCartStore } from "../../stores/useCartStore";
import Navbar from "../../components/layout/Navbar.vue";
import Footer from "../../components/layout/Footer.vue";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});

const handleRemove = async (id) => {
  await cartStore.removeFromCart(id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-[1340px] mx-auto px-6 py-12 lg:py-20">
      <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-10">Shopping Cart</h1>

      <div v-if="cartStore.loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="cartStore.items.length > 0" class="flex flex-col lg:flex-row gap-10">
        <!-- Items List -->
        <div class="flex-grow space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
            <div class="w-full sm:w-40 aspect-video rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img v-if="item.course.image_path" :src="item.course.image_path" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
            
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ item.course.title }}</h3>
              <p class="text-sm text-indigo-600 font-medium mb-2">{{ item.course.category }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>By TechTought Instructor</span>
              </div>
            </div>

            <div class="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto">
              <span class="text-2xl font-black text-gray-900">E£{{ item.course.price }}</span>
              <button @click="handleRemove(item.id)" class="text-red-500 text-sm font-bold hover:underline">Remove</button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="w-full lg:w-[350px] flex-shrink-0">
          <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-gray-600">
                <span>Original Price:</span>
                <span>E£{{ cartStore.totalPrice }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Discounts:</span>
                <span class="text-green-500">-E£0.00</span>
              </div>
              <div class="border-t border-gray-100 pt-4 flex justify-between">
                <span class="text-lg font-bold text-gray-900">Total:</span>
                <span class="text-2xl font-black text-indigo-600">E£{{ cartStore.totalPrice }}</span>
              </div>
            </div>
            <button class="w-full bg-[#1DA1F2] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
              Checkout Now
            </button>
            <p class="text-center text-xs text-gray-400 mt-4">Safe and secure payments</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 mb-8">Looks like you haven't added any courses yet.</p>
        <router-link to="/" class="inline-flex px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          Browse Courses
        </router-link>
      </div>
    </main>

    <Footer />
  </div>
</template>
