<script setup>
  import { useAuthStore } from "../stores/authStore";
  import { ref } from "vue";

  const auth = useAuthStore();
  const isMenuOpen = ref(false); // حالة القائمة في الموبايل
  const scrollContainer = ref(null);

  const categories = ref([
    "Computer Fundamentals", "Web Development", "Mobile Development",
    "Desktop Development", "AI & ML", "Data Science",
    "Networking", "Cloud Computing", "Cyber Security", "UI/UX Design",
  ]);

  const scroll = (direction) => {
    if (scrollContainer.value) {
      const scrollAmount = 200;
      scrollContainer.value.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
</script>
<template>
  <nav class="w-full bg-white border-b border-gray-200 font-sans sticky top-0 z-50">
    <div class="flex items-center justify-between h-[70px] md:h-[80px] gap-4 md:gap-8 border-b border-gray-200 px-4 md:px-12">
      
      <button @click="toggleMenu" class="md:hidden text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="text-2xl md:text-3xl font-bold tracking-tight text-black flex-shrink-0">
        <router-link to="/"> LOGO </router-link>
      </div>

      <div class="hidden md:block flex-grow relative max-w-[850px]">
        <input
          type="text"
          placeholder="Search for courses..."
          class="w-full h-[45px] pl-6 pr-14 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 text-gray-600" />
        <button class="absolute right-1 top-1 bg-[#1DA1F2] text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3 md:gap-6 text-[15px] font-semibold text-[#444]">
        <template v-if="!auth.isLoggedIn">
          <router-link to="/instructor-application" class="hidden lg:block hover:text-blue-600 transition-colors">Teach with TechTought</router-link>
          <router-link to="/signup" class="bg-[#1DA1F2] text-white px-4 py-2 md:px-5 md:py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm md:text-base">Join Us</router-link>
        </template>

        <template v-else>
          <a href="#" class="hidden sm:block hover:text-blue-600">My learning</a>
          <button class="text-gray-400 hover:text-red-500">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-200">
            <img src="https://via.placeholder.com/40" alt="Profile" class="w-full h-full object-cover" />
          </div>
        </template>
      </div>
    </div>

    <div v-if="isMenuOpen" class="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
      <input
        type="text"
        placeholder="Search..."
        class="w-full h-[40px] px-4 rounded-lg border border-gray-300 focus:outline-none" />
      <div class="flex flex-col gap-3 font-semibold text-gray-700">
        <router-link to="/instructor-application" @click="isMenuOpen = false">Teach with TechTought</router-link>
        <a href="#" v-if="auth.isLoggedIn">My learning</a>
      </div>
    </div>

    <div class="max-w-[1340px] mx-auto px-2 md:px-4" v-if="auth.isLoggedIn">
      <div class="flex items-center relative group">
        <button @click="scroll('left')" class="hidden md:block absolute left-0 z-10 bg-white shadow-md rounded-full p-1 border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
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
              class="nav-link shrink-0">
              {{ cat }}
            </a>
          </div>
        </div>

        <button @click="scroll('right')" class="hidden md:block absolute right-0 z-10 bg-white shadow-md rounded-full p-1 border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
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

  /* إخفاء السكرول بار مع السماح بالتمرير */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    /* تحسين التمرير على الموبايل */
    -webkit-overflow-scrolling: touch;
  }
</style>
