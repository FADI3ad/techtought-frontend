<script setup>
  import { ref } from "vue";
  import api from "../../services/axios";
  import { useSettingsStore } from "../../stores/useSettingsStore";

  const email = ref("");
  const settingsStore = useSettingsStore();
  const submitting = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");

  async function handleSubscribe() {
    if (!email.value) {
      errorMessage.value = "Email is required.";
      successMessage.value = "";
      return;
    }

    submitting.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try {
      const response = await api.post("/subscribe", {
        email: email.value,
      });

      if (response.data?.status === "success") {
        successMessage.value =
          response.data?.message || "Subscribed successfully!";
        email.value = ""; // Clear input on success
      }
    } catch (err) {
      console.error("Subscription failed:", err);
      // Retrieve backend validation message if present, otherwise fall back to generic
      errorMessage.value =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "An error occurred. Please try again.";
    } finally {
      submitting.value = false;
    }
  }
</script>

<template>
  <!-- تم تغيير bg-white إلى bg-gray-900 وإزالة حدود gray-100 وتفتيح النصوص العامة -->
  <footer class="bg-gray-900 text-gray-300 pt-16 pb-8">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div class="space-y-6">
          <!-- تم تغيير text-black إلى text-white لتناسب الخلفية الغامقة -->
          <div class="text-4xl font-bold tracking-tight text-white">
            <router-link to="/">
              <img v-if="settingsStore.settings.logo" :src="settingsStore.settings.logo" alt="Logo" class="h-12 object-contain" />
              <img v-else src="../../assets/images/Group 13.png" alt="Logo" class="h-10 object-contain" />
            </router-link>
          </div>
          <!-- تعديل text-gray-500 إلى text-gray-400 لقراءة أفضل -->
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            TechTought is a leading platform for mastering modern technology. We
            help developers build a strong foundation and scale their careers.
          </p>
          <div class="flex gap-4">
            <!-- تم تغيير bg-gray-50 إلى bg-gray-800 للـ Social Links -->
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a
              href="#"
              class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.109 0-.616.493-1.109 1.1-1.109.617 0 1.1.493 1.1 1.109 0 .616-.483 1.109-1.1 1.109zm8 6.891h-1.999v-2.846c0-.723-.014-1.653-1.007-1.653-1.009 0-1.163.788-1.163 1.602v2.897h-1.999v-6h1.919v.819h.029c.268-.507.92-1.042 1.896-1.042 2.029 0 2.404 1.335 2.404 3.071v3.152z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <!-- تعديل text-gray-900 إلى text-white والعناوين الفرعية -->
          <h4
            class="font-bold text-white mb-6 uppercase tracking-wider text-xs">
            Platform
          </h4>
          <!-- تعديل text-gray-500 إلى text-gray-400 ومراعاة الـ Hover -->
          <ul class="space-y-4 text-sm font-medium text-gray-400">
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Courses</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Learning Paths</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Mentorship</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Pricing</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="font-bold text-white mb-6 uppercase tracking-wider text-xs">
            Resources
          </h4>
          <ul class="space-y-4 text-sm font-medium text-gray-400">
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Community</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Blog</a
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Documentation</a
              >
            </li>
            <li>
              <router-link
                to="/contact"
                class="hover:text-primary-400 transition-colors"
                >Contact Us</router-link
              >
            </li>
            <li>
              <a href="#" class="hover:text-primary-400 transition-colors"
                >Help Center</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="font-bold text-white mb-6 uppercase tracking-wider text-xs">
            Join our newsletter
          </h4>
          <p class="text-gray-400 text-sm mb-4">
            Get the latest updates and resources directly in your inbox.
          </p>
          <form @submit.prevent="handleSubscribe" class="flex flex-col gap-3">
            <!-- تم تعديل خلفية حقل الإدخال لتتناسب مع الوضع الغامق bg-gray-800 وحدود border-gray-700 و text-white -->
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              :disabled="submitting"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-primary-500 disabled:opacity-60 transition-all" />
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-[#1a365d] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3182ce] disabled:opacity-75 transition-all shadow-md shadow-black/20 cursor-pointer flex items-center justify-center gap-2">
              <!-- Loading spinner -->
              <svg
                v-if="submitting"
                class="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submitting ? "Subscribing..." : "Subscribe" }}</span>
            </button>
          </form>

          <!-- Alerts elements remain with same functionality -->
          <Transition name="fade-message" mode="out-in">
            <p
              v-if="successMessage"
              class="text-emerald-400 text-xs mt-3 font-semibold bg-emerald-950/50 border border-emerald-900 px-3 py-2 rounded-lg flex items-center gap-1.5">
              <svg
                class="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage }}</span>
            </p>
            <p
              v-else-if="errorMessage"
              class="text-rose-400 text-xs mt-3 font-semibold bg-rose-950/50 border border-rose-900 px-3 py-2 rounded-lg flex items-center gap-1.5">
              <svg
                class="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </p>
          </Transition>
        </div>
      </div>

      <!-- تعديل حدود الخط الفاصل السفلي border-gray-800 -->
      <div
        class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-xs">
          © 2026 TechTought Inc. All rights reserved.
        </p>
        <div class="flex gap-8">
          <router-link to="/privacy-policy" class="text-gray-500 text-xs hover:text-white">Privacy Policy</router-link>
          <router-link to="/terms-of-service" class="text-gray-500 text-xs hover:text-white">Terms of Service</router-link>
          <router-link to="/cookies-settings" class="text-gray-500 text-xs hover:text-white">Cookies Settings</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  .fade-message-enter-active,
  .fade-message-leave-active {
    transition: all 0.3s ease;
  }

  .fade-message-enter-from,
  .fade-message-leave-to {
    opacity: 0;
    transform: translateY(5px);
  }
</style>