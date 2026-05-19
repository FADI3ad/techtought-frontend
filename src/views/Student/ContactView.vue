<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Get in <span class="text-primary-600">Touch</span>
        </h1>
        <p class="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Have questions about our courses or need technical support? We're here to help you every step of the way.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Contact Info -->
        <div class="space-y-8 animate-slide-in-left">
          <div class="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                  <p class="text-lg font-semibold text-gray-900">{{ settings.contact_email || 'support@techtought.com' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Call Us</p>
                  <p class="text-lg font-semibold text-gray-900">{{ settings.contact_phone || '+1 (234) 567-890' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Office</p>
                  <p class="text-lg font-semibold text-gray-900">{{ settings.address || 'Cairo, Egypt' }}</p>
                </div>
              </div>
            </div>

            <div class="mt-12 pt-12 border-t border-gray-100">
               <h3 class="text-sm font-bold text-gray-900 mb-6">Follow Our Journey</h3>
               <div class="flex gap-4">
                  <a v-for="(url, platform) in settings.social_links" :key="platform" :href="url" target="_blank" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                     <span class="sr-only">{{ platform }}</span>
                     <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path v-if="platform === 'facebook'" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                        <path v-if="platform === 'twitter'" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                     </svg>
                  </a>
               </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="animate-slide-in-right">
          <form @submit.prevent="submitForm" class="bg-white rounded-3xl p-8 shadow-xl shadow-primary-200/20 border border-primary-50 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                <input v-model="form.name" required type="text" placeholder="John Doe" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input v-model="form.email" required type="email" placeholder="john@example.com" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all outline-none" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 ml-1">Subject</label>
              <input v-model="form.subject" type="text" placeholder="How can we help?" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all outline-none" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 ml-1">Message</label>
              <textarea v-model="form.message" required rows="5" placeholder="Write your message here..." class="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all outline-none resize-none"></textarea>
            </div>

            <button type="submit" :disabled="submitting" class="w-full btn-global py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-200 active:scale-95 transition-all flex items-center justify-center gap-3">
              <span v-if="submitting" class="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Send Message</span>
              <svg v-if="!submitting" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import api from '../../services/axios';
import Swal from 'sweetalert2';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const settings = ref({
  contact_email: '',
  contact_phone: '',
  address: '',
  social_links: {}
});

const submitting = ref(false);

async function loadSettings() {
  try {
    const response = await api.get('/settings');
    if (response.data.data) {
      settings.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

async function submitForm() {
  submitting.value = true;
  try {
    await api.post('/contacts', form);
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out. We will respond shortly.',
      confirmButtonColor: '#4f46e5'
    });
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Failed to send message. Please try again later.'
    });
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out;
}
.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
