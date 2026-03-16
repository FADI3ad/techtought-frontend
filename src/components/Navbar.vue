<script setup>
  import { useAuthStore } from "../stores/authStore";

  const auth = useAuthStore();
</script>

<template>
  <nav class="w-full bg-white border-b border-gray-200 font-sans">
    <div
      class="flex items-center justify-center h-[80px] gap-8 border-b border-gray-200 px-12">
      <div class="text-3xl font-bold tracking-tight text-black">LOGO</div>

      <div class="flex-grow relative max-w-[850px]">
        <input
          type="text"
          placeholder="Search for files, plugins, and creators"
          class="w-full h-[48px] pl-6 pr-14 rounded-full border border-gray-400 focus:outline-none focus:border-blue-500 text-gray-600 placeholder-gray-500" />
        <button
          class="absolute right-1 top-1 bg-[#1DA1F2] text-white p-2.5 rounded-full hover:bg-blue-500 transition-colors">
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

      <div class="flex items-center gap-6 text-[15px] font-semibold text-[#444] justify-between">

        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300" v-if="!auth.isLoggedIn">Teach with TechTaught</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300" v-if="!auth.isLoggedIn">About</a>
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300" v-if="auth.isLoggedIn">Contact Us</a>

        <router-link
          v-if="!auth.isLoggedIn"
          to="/signup"
          class="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors inline-block text-center">
          Join Us
        </router-link>
        
        <a href="#" class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300" v-if="auth.isLoggedIn"
          >My learning</a
        >

        <button
          class="text-gray-400 hover:text-red-500 ml-2"
          v-if="auth.isLoggedIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
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

        <div
          class="w-12 h-12 rounded-full overflow-hidden border border-gray-200 cursor-pointer"
          v-if="auth.isLoggedIn">
          <img
            src="https://via.placeholder.com/48"
            alt="User Profile"
            class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <div class="max-w-[1340px] mx-auto px-4" v-if="auth.isLoggedIn">
      <div
        class="flex items-center justify-between border-t border-gray-100 h-[50px] relative flex-nowrap overflow-hidden">
        <button class="text-gray-800 p-1">
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
          class="flex items-center justify-center flex-grow px-4 flex-nowrap overflow-hidden">
          <a href="#" class="nav-link">Computer Fundmentals</a>
          <a href="#" class="nav-link">Web Development</a>
          <a href="#" class="nav-link">Mobile Development</a>
          <a href="#" class="nav-link">Desktop Development</a>
          <a href="#" class="nav-link">Desktop Development</a>
          <a href="#" class="nav-link">Desktop Development</a>
        </div>

        <button class="text-gray-800 p-1">
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
  nav {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .nav-link {
    white-space: nowrap;

    @apply text-[#444] font-semibold px-6 border-r border-gray-400 last:border-0 hover:text-black transition-all;

    font-size: clamp(10px, 1.1vw, 15px);

    padding-left: clamp(10px, 2vw, 26px);
    padding-right: clamp(10px, 2vw, 26px);
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
