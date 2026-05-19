<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/axios";

const router = useRouter();

const searchQuery = ref("");
const searchResults = ref({ courses: [], categories: [], subcategories: [] });
const showSuggestions = ref(false);
const loadingSearch = ref(false);
let debounceTimeout = null;

const handleSearchInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (searchQuery.value.trim().length < 1) {
    searchResults.value = { courses: [], categories: [], subcategories: [] };
    showSuggestions.value = false;
    return;
  }

  loadingSearch.value = true;
  showSuggestions.value = true;

  debounceTimeout = setTimeout(async () => {
    try {
      const res = await api.get(`/global-search?q=${encodeURIComponent(searchQuery.value)}`);
      searchResults.value = res.data.data;
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      loadingSearch.value = false;
    }
  }, 300);
};

const navigateToSuggestion = (item) => {
  showSuggestions.value = false;
  searchQuery.value = "";
  if (item.type === 'course') {
    router.push({ name: "course-details", params: { slug: item.slug } });
  } else if (item.type === 'category') {
    router.push({ name: "category", params: { slug: item.slug } });
  } else if (item.type === 'subcategory') {
    router.push({
      name: "subcategory",
      params: { slug: item.category_slug, subSlug: item.slug },
    });
  }
};

const closeSearchDropdown = (e) => {
  if (!e.target.closest(".search-container-wrapper")) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", closeSearchDropdown);
});

onUnmounted(() => {
  window.removeEventListener("click", closeSearchDropdown);
});
</script>

<template>
  <div class="relative w-full search-container-wrapper">
    <input
      v-model="searchQuery"
      @input="handleSearchInput"
      @focus="showSuggestions = true"
      type="text"
      placeholder="Search for courses, categories..."
      class="w-full h-[55px] pl-6 pr-14 rounded-full border border-gray-300 focus:outline-none focus:border-primary-500 text-gray-600" />
    <button
      class="absolute right-2 top-2 bg-[#1a365d] text-white p-2 rounded-full hover:bg-[#1a365d] transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
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

    <!-- Suggestions Dropdown -->
    <div 
      v-if="showSuggestions && (searchResults.courses.length || searchResults.categories.length || searchResults.subcategories.length || loadingSearch)"
      class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden z-[100]"
    >
      <!-- Loader Shimmer -->
      <div v-if="loadingSearch" class="p-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg class="animate-spin h-5 w-5 text-[#1DA1F2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Searching...</span>
      </div>

      <div v-else class="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
        
        <!-- Category matches -->
        <div v-if="searchResults.categories.length" class="p-3">
          <span class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 block mb-2">Categories</span>
          <div class="space-y-1">
            <div 
              v-for="cat in searchResults.categories" 
              :key="cat.id"
              @click="navigateToSuggestion(cat)"
              class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                <img v-if="cat.image" :src="cat.image" class="w-full h-full object-cover" />
                <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </div>
              <span class="text-sm font-semibold text-gray-900">{{ cat.name }}</span>
            </div>
          </div>
        </div>

        <!-- Subcategory matches -->
        <div v-if="searchResults.subcategories.length" class="p-3">
          <span class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 block mb-2">Subcategories</span>
          <div class="space-y-1">
            <div 
              v-for="sub in searchResults.subcategories" 
              :key="sub.id"
              @click="navigateToSuggestion(sub)"
              class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="w-8 h-8 rounded-lg shrink-0 bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 20l4-16m2 16l4-16" /></svg>
              </div>
              <span class="text-sm font-semibold text-gray-900">{{ sub.name }}</span>
            </div>
          </div>
        </div>

        <!-- Course matches -->
        <div v-if="searchResults.courses.length" class="p-3">
          <span class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 block mb-2">Courses</span>
          <div class="space-y-1">
            <div 
              v-for="course in searchResults.courses" 
              :key="course.id"
              @click="navigateToSuggestion(course)"
              class="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-7 rounded overflow-hidden shrink-0 bg-gray-100">
                  <img v-if="course.image" :src="course.image" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                </div>
                <span class="text-sm font-semibold text-gray-900 truncate">{{ course.title }}</span>
              </div>
              
              <span class="text-xs font-extrabold shrink-0" :class="course.is_free ? 'text-emerald-600' : 'text-gray-900'">
                {{ course.is_free ? 'Free' : `$${course.price}` }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
