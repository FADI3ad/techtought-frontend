<script setup>
import { ref } from "vue";
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

const emit = defineEmits(["favorite-toggled"]);

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const loadingFavorite = ref(false);

async function toggleFavorite() {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  try {
    loadingFavorite.value = true;
    if (props.course.is_favorite) {
      const response = await api.delete(`/favorites/${props.course.id}`);
      if (response.data.status === "success") {
        emit("favorite-toggled", false);
      }
    } else {
      const response = await api.post("/favorites", {
        course_id: props.course.id,
      });
      if (response.data.status === "success" || response.status === 201) {
        emit("favorite-toggled", true);
      }
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  } finally {
    loadingFavorite.value = false;
  }
}

async function handleAddToCart() {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }
  
  const success = await cartStore.addToCart(props.course.id);
  if (success) {
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
        router.push(`/course/${props.course.slug}/learn`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  } else {
    handleAddToCart();
  }
}
</script>

<template>
  <div class="w-full lg:w-[350px] xl:w-[360px] flex-shrink-0 lg:-mt-72 relative z-30">
    <div
      class="bg-white rounded-md border border-[#d1d7dc] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden sticky top-8 transition-all duration-300">
      
      <!-- Course Image / Preview Container -->
      <div class="aspect-video relative overflow-hidden bg-gray-900 group">
        <img
          v-if="course.image_path && course.image_path !== 'http://localhost:8000/storage/'"
          :src="course.image_path"
          :alt="course.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center">
          <svg class="w-10 h-10 mb-2 opacity-35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-xs font-semibold">No Preview Image</p>
        </div>

        <!-- Overlay play effect (Always visible, matching Udemy style in image) -->
        <div class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-black/50">
          <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-900 mb-3 shadow-xl transition-all duration-300 hover:scale-110">
            <svg class="w-6 h-6 ml-1 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span class="text-white text-[13px] font-bold tracking-wide">Preview this course</span>
        </div>
      </div>

      <!-- Action Panel Body -->
      <div class="p-6">
        <!-- Price Display -->
        <div class="flex items-baseline gap-3 mb-5">
          <span class="text-3xl font-bold text-[#1c1d1f] tracking-tight">
            {{ course.is_free ? "Free" : `E£${course.price}` }}
          </span>
          <span
            v-if="!course.is_free"
            class="text-gray-500 line-through text-sm font-semibold"
          >
            E£{{ (parseFloat(course.price) * 1.5).toFixed(0) }}
          </span>
          <span 
            v-if="!course.is_free" 
            class="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 ml-auto"
          >
            33% OFF
          </span>
        </div>

        <!-- Action Buttons (Udemy classic rectangular design) -->
        <div class="space-y-3 mb-6">
          <button
            @click="handleAction"
            class="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-3.5 rounded-md font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <template v-if="course.is_enrolled">
              <span>Go to Course</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </template>
            <template v-else>
              <span>{{ course.is_free ? "Enroll Now" : "Buy Now" }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </template>
          </button>
          
          <button
            v-if="!course.is_enrolled && !course.is_free"
            @click="handleAddToCart"
            class="w-full border border-[#1c1d1f] hover:bg-gray-50 text-[#1c1d1f] py-3.5 rounded-md font-bold text-sm tracking-wide transition-all active:scale-[0.98]">
            {{ cartStore.isInCart(course.id) ? 'Go to Cart' : 'Add to Cart' }}
          </button>

          <!-- Wishlist Heart Button -->
          <button
            @click="toggleFavorite"
            :disabled="loadingFavorite"
            class="w-full border border-[#d1d7dc] hover:bg-gray-50 hover:border-gray-400 text-[#1c1d1f] py-3 rounded-md font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-colors duration-250"
              :class="course.is_favorite ? 'fill-red-500 stroke-red-500 text-red-500' : 'text-gray-500'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ course.is_favorite ? 'Added to Wishlist' : 'Add to Wishlist' }}</span>
          </button>
        </div>

        <!-- Guarantee Text -->
        <p class="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

        <!-- Features Checklist -->
        <div class="space-y-3.5 pt-6 border-t border-gray-150">
          <h4 class="font-bold text-[#1c1d1f] text-sm tracking-tight">
            This course includes:
          </h4>
          <ul class="space-y-2.5 text-gray-600 text-sm">
            <li class="flex items-center gap-3">
              <!-- Play symbol icon -->
              <svg class="w-4 h-4 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Full lifetime access</span>
            </li>
            <li class="flex items-center gap-3">
              <!-- Device icon -->
              <svg class="w-4 h-4 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Access on mobile and TV</span>
            </li>
            <li class="flex items-center gap-3">
              <!-- Trophy icon -->
              <svg class="w-4 h-4 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Certificate of completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles */
</style>
