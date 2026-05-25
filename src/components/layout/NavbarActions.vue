<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useAuthStore } from "../../stores/useAuthStore";
  import { useCartStore } from "../../stores/useCartStore";
  import api from "../../services/axios";

  const auth = useAuthStore();
  const cart = useCartStore();
  const router = useRouter();
  const route = useRoute();

  const isProfileMenuOpen = ref(false);
  const isGuestMenuOpen = ref(false);

  const isAdmin = computed(() => {
    const role = auth.user?.role;
    return role === "admin" || role === "super_admin";
  });

  const toggleProfileMenu = () => {
    isProfileMenuOpen.value = !isProfileMenuOpen.value;
    isGuestMenuOpen.value = false;
  };

  const toggleGuestMenu = () => {
    isGuestMenuOpen.value = !isGuestMenuOpen.value;
    isProfileMenuOpen.value = false;
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown-container"))
      isProfileMenuOpen.value = false;
    if (!e.target.closest(".guest-dropdown-container"))
      isGuestMenuOpen.value = false;
  };

  onMounted(() => {
    window.addEventListener("click", closeDropdown);
  });

  onUnmounted(() => {
    window.removeEventListener("click", closeDropdown);
  });

  const logout = async () => {
    try {
      if (auth.user?.token) await api.post("/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      auth.logout();
      isProfileMenuOpen.value = false;
      router.push("/");
    }
  };
</script>

<template>
  <div
    class="flex items-center gap-3 md:gap-6 text-[15px] font-semibold text-[#444]">
    <template v-if="!auth.isLoggedIn">
      <!-- Desktop Links -->
      <router-link
        to="/contact"
        class="hidden lg:flex items-center gap-2 hover:text-primary-600 transition-all hover:translate-x-0.5">
        <span>Contact Us</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </router-link>
      <router-link
        to="/instructor-application"
        class="hidden lg:block hover:text-primary-600 transition-colors">
        Teach with TechTought
      </router-link>

      <div class="flex items-center gap-2">
        <router-link
          to="/signup"
          class="btn-global px-4 py-2 md:px-5 md:py-2 text-sm md:text-base">
          Join Us
        </router-link>

        <!-- Mobile Guest Menu -->
        <div class="relative guest-dropdown-container lg:hidden">
          <button
            @click="toggleGuestMenu"
            class="p-2 text-gray-600 hover:text-[#1DA1F2] transition-colors focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div
            v-if="isGuestMenuOpen"
            class="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-[60]">
            <router-link to="/contact" class="dropdown-item">
              Contact Us
            </router-link>
            <router-link to="/instructor-application" class="dropdown-item">
              Teach with TechTought
            </router-link>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <router-link
        to="/my-learning"
        class="hidden lg:block hover:text-primary-600"
        >My learning</router-link
      >

      <!-- Favorites Heart Icon -->
      <router-link
        to="/favorites"
        class="relative text-gray-400 hover:text-red-500 transition-colors"
        :class="{ 'text-red-500': route.name === 'favorites' }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 md:h-7 md:w-7"
          :fill="route.name === 'favorites' ? 'currentColor' : 'none'"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </router-link>

      <!-- Cart Icon -->
      <router-link
        to="/cart"
        class="relative text-gray-400 hover:text-[#1DA1F2] transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 md:h-7 md:w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span
          v-if="cart.cartCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
          {{ cart.cartCount }}
        </span>
      </router-link>

      <div class="relative profile-dropdown-container">
        <button
          @click="toggleProfileMenu"
          class="flex items-center focus:outline-none">
          <div
            class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all">
            <img
              src="../../assets/images/user.png"
              alt="Profile"
              class="w-full h-full object-cover" />
          </div>
        </button>

        <div
          v-if="isProfileMenuOpen"
          class="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-[60]">
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-800">
              {{ auth.user?.name || "User Name" }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ auth.user?.email || "user@example.com" }}
            </p>
          </div>
          <div class="py-1">
            <router-link
              v-if="isAdmin"
              to="/admin/dashboard"
              class="dropdown-item"
              >Admin Dashboard</router-link
            >
            <router-link to="/profile" class="dropdown-item"
              >My Profile</router-link
            >
            <router-link to="/todo-list" class="dropdown-item"
              >Todo List</router-link
            >
            <router-link to="/settings" class="dropdown-item"
              >Settings</router-link
            >
            <router-link to="/billing" class="dropdown-item"
              >Billing & Payments</router-link
            >
            <router-link to="/submit-testimonial" class="dropdown-item"
              >Submit Testimonial</router-link
            >
            <!-- Mobile Only Links injected into dropdown -->
            <router-link
              to="/my-learning"
              class="dropdown-item block lg:hidden">
              My learning
            </router-link>
            <router-link
              to="/instructor-application"
              class="dropdown-item block lg:hidden">
              Teach with TechTought
            </router-link>
            <router-link to="/contact" class="dropdown-item block lg:hidden">
              Contact Us
            </router-link>
          </div>
          <div class="border-t border-gray-100 py-1">
            <button
              @click="logout"
              class="dropdown-item text-red-600 hover:bg-red-50 w-full text-left">
              Logout
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
  .dropdown-item {
    @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
       hover:text-primary-600 transition-colors cursor-pointer;
  }
</style>
