<script setup>
import { useRouter } from "vue-router";
import { useCartStore } from "../../../stores/useCartStore";
import { useAuthStore } from "../../../stores/useAuthStore";
import api from "../../../services/axios";

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

async function handleAddToCart() {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }
  
  const success = await cartStore.addToCart(props.course.id);
  if (success) {
    // Optionally redirect to cart or show success
    router.push("/cart");
  }
}

async function handleAction() {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  if (props.course.is_enrolled) {
    router.push(`/course/${props.course.slug}/learn`);
    return;
  }

  if (props.course.is_free) {
    try {
      const response = await api.post("/enroll", {
        course_id: props.course.id,
      });
      if (response.data.status === "success") {
        // Refresh page or update state
        router.push(`/course/${props.course.slug}/learn`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  } else {
    // Redirect to checkout or buy logic
    handleAddToCart();
  }
}
</script>

<template>
  <div class="w-full lg:w-[400px] flex-shrink-0 lg:-mt-64 relative z-20">
    <div
      class="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden sticky top-8">
      <!-- Course Image -->
      <div class="aspect-video relative overflow-hidden bg-gray-100">
        <img
          v-if="course.image_path && course.image_path !== 'http://localhost:8000/storage/'"
          :src="course.image_path"
          :alt="course.title"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
          <svg class="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-xs font-medium">No preview image</p>
        </div>
        <div class="absolute inset-0 bg-black/10"></div>
      </div>

      <div class="p-8">
        <!-- Price Section -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl font-black text-gray-900">
            {{ course.is_free ? "Free" : `E£${course.price}` }}
          </span>
          <span
            v-if="!course.is_free"
            class="text-gray-400 line-through text-lg"
            >E£{{ (parseFloat(course.price) * 1.5).toFixed(2) }}</span
          >
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 mb-8">
          <button
            @click="handleAction"
            class="w-full bg-[#1DA1F2] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            <template v-if="course.is_enrolled">
              Go to Course
            </template>
            <template v-else>
              {{ course.is_free ? "Enroll Now" : "Buy Now" }}
            </template>
          </button>
          <button
            v-if="!course.is_enrolled"
            @click="handleAddToCart"
            class="w-full border-2 border-black text-black py-4 rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all active:scale-[0.98]">
            {{ cartStore.isInCart(course.id) ? 'Go to cart' : 'Add to cart' }}
          </button>
        </div>

        <!-- Features List -->
        <div class="space-y-4 pt-6 border-t border-gray-100">
          <h4 class="font-bold text-gray-900 text-sm uppercase tracking-wider">
            This course includes:
          </h4>
          <ul class="space-y-3 text-gray-600 text-sm">
            <li class="flex items-center gap-3">
              <span class="text-lg">▶</span>
              <span>Full lifetime access</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg">📱</span>
              <span>Access on mobile and TV</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg">🏆</span>
              <span>Certificate of completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
