<script setup>
import { reactive, ref } from 'vue';
import api from '../../services/axios';
import Swal from 'sweetalert2';

const form = reactive({
  rating: 0,
  content: ''
});

const submitting = ref(false);
const hoveredRating = ref(0);

const setRating = (val) => {
  form.rating = val;
};

async function submitTestimonial() {
  if (form.rating === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Rating',
      text: 'Please select a star rating before submitting.',
      confirmButtonColor: '#4f46e5'
    });
    return;
  }

  submitting.value = true;
  try {
    await api.post('/testimonials', {
      rating: form.rating,
      content: form.content
    });

    Swal.fire({
      icon: 'success',
      title: 'Thank You!',
      text: 'Your testimonial has been submitted successfully and is pending approval.',
      confirmButtonColor: '#4f46e5'
    });
    
    // Reset form
    form.rating = 0;
    form.content = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.response?.data?.message || 'Something went wrong. Please try again.',
      confirmButtonColor: '#4f46e5'
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-20 font-sans">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Share Your <span class="text-primary-600">Experience</span>
        </h1>
        <p class="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Your feedback helps us improve and helps other students make the right choice. We'd love to hear your story!
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 animate-slide-up relative overflow-hidden">
        
        <!-- Decorative Background Elements -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <form @submit.prevent="submitTestimonial" class="relative z-10 space-y-10">
          
          <!-- Rating Section -->
          <div class="space-y-4 text-center">
            <label class="block text-lg font-bold text-gray-900">How would you rate your learning experience?</label>
            <div class="flex items-center justify-center gap-2">
              <button 
                v-for="star in 5" 
                :key="star"
                type="button"
                @mouseenter="hoveredRating = star"
                @mouseleave="hoveredRating = 0"
                @click="setRating(star)"
                class="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <svg 
                  class="w-12 h-12 transition-colors duration-200" 
                  :class="(hoveredRating >= star || (!hoveredRating && form.rating >= star)) ? 'text-amber-400 drop-shadow-md' : 'text-gray-200'"
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
            <p class="text-sm font-semibold h-5" :class="form.rating > 0 ? 'text-amber-600' : 'text-gray-400'">
              {{ form.rating === 5 ? 'Excellent!' : form.rating === 4 ? 'Very Good!' : form.rating === 3 ? 'Average' : form.rating === 2 ? 'Poor' : form.rating === 1 ? 'Terrible' : 'Select a rating' }}
            </p>
          </div>

          <!-- Content Section -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 ml-1">Your Testimonial</label>
            <div class="relative">
              <textarea 
                v-model="form.content" 
                required 
                rows="6" 
                maxlength="500"
                placeholder="Tell us what you liked the most, how the courses helped you, or what we can improve..." 
                class="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none resize-none text-gray-700 leading-relaxed"
              ></textarea>
              <div class="absolute bottom-4 right-4 text-xs font-semibold" :class="form.content.length > 450 ? 'text-red-400' : 'text-gray-400'">
                {{ form.content.length }} / 500
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="submitting" 
            class="w-full bg-primary-600 text-white py-4 sm:py-5 rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="submitting" class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            <template v-else>
              <span>Submit Testimonial</span>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </template>
          </button>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
