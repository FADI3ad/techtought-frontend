<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCartStore } from "../../stores/useCartStore";
import { useSettingsStore } from "../../stores/useSettingsStore";

import NavbarSearch from "./NavbarSearch.vue";
import NavbarActions from "./NavbarActions.vue";
import NavbarCategories from "./NavbarCategories.vue";

const auth = useAuthStore();
const cart = useCartStore();
const settingsStore = useSettingsStore();
const route = useRoute();

onMounted(() => {
  settingsStore.fetchSettings();
});

watch(
  () => auth.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      cart.fetchCart();
    }
  },
  { immediate: true }
);
</script>

<template>
  <nav class="w-full bg-white border-b border-gray-200 font-sans top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
    <!-- Top Row (Logo, Search (desktop), Actions) -->
    <div class="flex items-center justify-between h-[70px] md:h-[80px] gap-4 md:gap-8 px-4 md:px-12">
      
      <!-- Logo -->
      <div class="text-xl md:text-3xl font-bold tracking-tight text-black flex-shrink-0">
        <router-link to="/" class="flex-shrink-0 flex items-center group">
          <img
            v-if="settingsStore.settings.logo"
            :src="settingsStore.settings.logo"
            alt="TechTought"
            class="h-10 md:h-10 object-contain transition-transform" />
          <img
            v-else
            src="../../assets/images/Group 13.png"
            alt="TechTought"
            class="h-10 md:h-10 transition-transform" />
        </router-link>
      </div>

      <!-- Search (Desktop only in this row, hidden on mobile) -->
      <div class="hidden md:block flex-grow max-w-[850px]">
        <NavbarSearch />
      </div>

      <!-- Actions (Profile, Cart, Fav, Guest Auth) -->
      <div class="flex items-center">
        <NavbarActions />
      </div>

    </div>

    <!-- Mobile Search Row -->
    <div class="block md:hidden px-4 py-3 border-t border-gray-200">
      <NavbarSearch />
    </div>


    
    <!-- Categories Row -->
    <div class="w-full border-t border-gray-300" v-if="auth.isLoggedIn && !['todo-list', 'profile', 'pomodoro'].includes(route.name)">
      <NavbarCategories />
    </div>

    
  </nav>
</template>
