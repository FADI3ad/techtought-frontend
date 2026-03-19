<script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/authStore";
  import axios from "axios";

  const auth = useAuthStore();
  const router = useRouter();

  const isMenuOpen = ref(false);
  const isProfileMenuOpen = ref(false);
  const scrollContainer = ref(null);

  const categories = ref([
    "Computer Fundamentals",
    "Web Development",
    "Mobile Development",
    "Desktop Development",
    "AI & ML",
    "Data Science",
    "Networking",
    "Cloud Computing",
    "Cyber Security",
    "UI/UX Design",
  ]);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const toggleProfileMenu = () => {
    isProfileMenuOpen.value = !isProfileMenuOpen.value;
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".profile-dropdown-container")) {
      isProfileMenuOpen.value = false;
    }
  };

  onMounted(() => window.addEventListener("click", closeDropdown));
  onUnmounted(() => window.removeEventListener("click", closeDropdown));

  const scroll = (direction) => {
    if (scrollContainer.value) {
      const scrollAmount = 200;
      scrollContainer.value.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const logout = async () => {
    try {
     
      if (auth.user?.token) {
        await axios.post(
          "/api/logout",
          {},
          { headers: { Authorization: `Bearer ${auth.user.token}` } },
        );
      }
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
  <nav
    class="w-full bg-white border-b border-gray-200 font-sans sticky top-0 z-50">
    <!-- Nav Top -->
    <div
      class="flex items-center justify-between h-[70px] md:h-[80px] gap-4 md:gap-8 border-b border-gray-200 px-4 md:px-12">
      <!-- Mobile menu button -->
      <button @click="toggleMenu" class="md:hidden text-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7" />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Logo -->
      <div
        class="text-2xl md:text-3xl font-bold tracking-tight text-black flex-shrink-0">
        <router-link to="/">
          <img src="../assets/images/logo.png" alt="Logo" />
        </router-link>
      </div>

      <!-- Search -->
      <div class="hidden md:block flex-grow relative max-w-[850px]">
        <input
          type="text"
          placeholder="Search for courses..."
          class="w-full h-[45px] pl-6 pr-14 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-gray-600" />
        <button
          class="absolute right-1 top-1 bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <!-- Right actions -->
      <div
        class="flex items-center gap-3 md:gap-6 text-[15px] font-semibold text-[#444]">
        <!-- If not logged in -->
        <template v-if="!auth.isLoggedIn">
          <router-link
            to="/instructor-application"
            class="hidden lg:block hover:text-blue-600 transition-colors"
            >Teach with TechTought</router-link
          >
          <router-link
            to="/signup"
            class="bg-[#1DA1F2] text-white px-4 py-2 md:px-5 md:py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm md:text-base"
            >Join Us</router-link
          >
        </template>

        <!-- If logged in -->
        <template v-else>
          <a href="#" class="hidden sm:block hover:text-blue-600"
            >My learning</a
          >

          <!-- Favorite / Heart icon -->
          <button class="text-gray-400 hover:text-red-500">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <!-- Profile dropdown -->
          <div class="relative profile-dropdown-container">
            <button
              @click="toggleProfileMenu"
              class="flex items-center focus:outline-none">
              <div
                class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all">
                <img
                  src="../assets/images/user.png"
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
                <router-link to="/profile" class="dropdown-item"
                  ><span>My Profile</span></router-link
                >
                <router-link to="/settings" class="dropdown-item"
                  ><span>Settings</span></router-link
                >
                <router-link to="/billing" class="dropdown-item"
                  ><span>Billing & Payments</span></router-link
                >
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
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
      <input
        type="text"
        placeholder="Search..."
        class="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:outline-none" />
      <div class="flex flex-col gap-3 font-semibold text-gray-700">
        <router-link to="/instructor-application" @click="isMenuOpen = false"
          >Teach with TechTought</router-link
        >
        <a href="#" v-if="auth.isLoggedIn">My learning</a>
      </div>
    </div>

    <!-- Categories scroll -->
    <div class="max-w-[1340px] mx-auto px-2 md:px-4" v-if="auth.isLoggedIn">
      <div class="flex items-center relative group">
        <button
          @click="scroll('left')"
          class="hidden md:block absolute left-0 z-10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref="scrollContainer"
          class="flex items-center overflow-x-auto scroll-smooth no-scrollbar h-[45px] md:h-[50px] w-full px-2 md:px-8">
          <div class="flex items-center flex-nowrap shrink-0">
            <a
              v-for="(cat, index) in categories"
              :key="index"
              href="#"
              class="nav-link shrink-0"
              >{{ cat }}</a
            >
          </div>
        </div>

        <button
          @click="scroll('right')"
          class="hidden md:block absolute right-0 z-10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
  .nav-link {
    @apply text-[#444] font-semibold px-4 md:px-6 border-r border-gray-200 last:border-0 hover:text-blue-600 transition-all text-xs md:text-sm whitespace-nowrap;
  }

  /* تنسيق عناصر القائمة المنسدلة */
  .dropdown-item {
    @apply block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors cursor-pointer;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
</style>
