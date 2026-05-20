<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../../services/axios";

const route = useRoute();
const router = useRouter();

const category     = ref(null); 
const categoryInfo = ref(null); 
const courses      = ref([]);
const loading      = ref(true);
const error        = ref(null);

const selectedPrice  = ref("All Prices");
const selectedRating = ref(null);
const selectedLanguage = ref("All");
const minPrice = ref(null);
const maxPrice = ref(null);

async function loadCourses(slug) {
  loading.value = true;
  error.value   = null;
  try {
    const [resInfo, resCourses] = await Promise.all([
      api.get(`categories/${slug}`),
      api.get(`categories/${slug}/all-courses`),
    ]);
    categoryInfo.value = resInfo.data.data.category;
    category.value     = resCourses.data.data.category;
    courses.value      = resCourses.data.data.category.courses;
  } catch (err) {
    console.error("Error loading category:", err);
    error.value = "Failed to load courses.";
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.slug, (slug) => { if (slug) loadCourses(slug); });
onMounted(() => { if (route.params.slug) loadCourses(route.params.slug); });

function filteredCourses() {
  return courses.value.filter((c) => {
    const passPriceType =
      selectedPrice.value === "All Prices" ||
      (selectedPrice.value === "Free" && c.is_free) ||
      (selectedPrice.value === "Paid" && !c.is_free);

    const passLang =
      selectedLanguage.value === "All" ||
      c.lang === selectedLanguage.value;

    const p = parseFloat(c.price) || 0;
    const passMin = minPrice.value !== null && minPrice.value !== '' ? p >= minPrice.value : true;
    const passMax = maxPrice.value !== null && maxPrice.value !== '' ? p <= maxPrice.value : true;

    // Optional rating fallback (if API supports it locally)
    const passRating = !selectedRating.value || (c.rating && c.rating >= selectedRating.value);

    return passPriceType && passLang && passMin && passMax;
  });
}
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- ══════════════════════════════  Hero  ══════════════════════════════ -->
    <section class="overflow-hidden py-10 lg:py-0">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10
                  flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

        <!-- Text -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center
                    items-center lg:items-start text-center lg:text-left">
          <template v-if="loading">
            <div class="h-12 w-72 bg-gray-200 rounded-xl animate-pulse mb-6" />
            <div class="h-5 w-96 bg-gray-100 rounded animate-pulse mb-2" />
            <div class="h-5 w-64 bg-gray-100 rounded animate-pulse" />
          </template>
          <template v-else>
            <h2 class="text-3xl lg:text-5xl font-black text-black mb-6 tracking-tight leading-[1.2]">
              {{ categoryInfo?.name }}
            </h2>
            <p class="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl">
              {{ categoryInfo?.description }}
            </p>
          </template>
        </div>

        <!-- Image -->
        <div class="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div class="relative w-full aspect-[4/3]">
            <!-- skeleton -->
            <div v-if="loading"
              class="w-full h-full bg-gray-200 rounded-2xl animate-pulse" />
            <!-- real image -->
            <img
              v-else-if="categoryInfo?.image"
              :src="categoryInfo.image"
              :alt="categoryInfo.name"
              class="w-full h-full object-contain rounded-2xl" />
            <!-- fallback -->
            <div v-else
              class="w-full h-full flex items-center justify-center
                     bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-primary-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3
                     6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168
                     5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477
                     18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════  Courses  ══════════════════════════════ -->
    <section class="py-16 bg-white">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">

        <!-- Header -->
        <div class="mb-10 border-b border-gray-100 pb-6">
          <template v-if="loading">
            <div class="h-9 w-64 bg-gray-200 rounded-xl animate-pulse mb-3" />
            <div class="h-5 w-48 bg-gray-100 rounded animate-pulse" />
          </template>
          <template v-else>
            <h2 class="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-2">
              All {{ categoryInfo?.name }} Courses
            </h2>
            <p class="text-gray-500 text-lg">
              {{ category?.meta?.["total courses"] ?? courses.length }} courses available
            </p>
          </template>
        </div>

        <div class="flex flex-col lg:flex-row gap-10">

          <!-- Sidebar Filters -->
          <aside class="w-full lg:w-1/4 lg:max-w-[260px]">
            <div class="bg-white border border-gray-300 p-6 lg:sticky lg:top-24">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 class="text-lg font-bold text-gray-900">Filter</h3>
              </div>

              <!-- Price Filter -->
              <div class="mb-6 border-b border-gray-200 pb-6">
                <h4 class="text-base font-bold text-gray-900 mb-4">Price</h4>
                <div class="space-y-3">
                  <label v-for="price in ['All Prices', 'Free', 'Paid']" :key="price"
                    class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                      <input type="radio" name="price" :value="price" v-model="selectedPrice" class="peer appearance-none w-5 h-5 border-2 border-gray-900 rounded-full checked:bg-gray-900 cursor-pointer transition-all" />
                      <div class="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <span class="text-base text-gray-700 group-hover:text-gray-900">{{ price }}</span>
                  </label>
                </div>
              </div>

              <!-- Custom Price Range -->
              <div class="mb-6 border-b border-gray-200 pb-6">
                <h4 class="text-base font-bold text-gray-900 mb-4">Price Range (E£)</h4>
                <div class="flex items-center gap-2">
                  <input type="number" v-model="minPrice" placeholder="Min" class="w-full bg-white border border-gray-900 text-gray-900 text-sm p-2 focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500" />
                  <span class="text-gray-900 font-bold">-</span>
                  <input type="number" v-model="maxPrice" placeholder="Max" class="w-full bg-white border border-gray-900 text-gray-900 text-sm p-2 focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder-gray-500" />
                </div>
              </div>

              <!-- Language Filter -->
              <div class="mb-6 border-b border-gray-200 pb-6">
                <h4 class="text-base font-bold text-gray-900 mb-4">Language</h4>
                <div class="space-y-3">
                  <label v-for="lang in [{l: 'All', v: 'All'}, {l: 'Arabic', v: 'AR'}, {l: 'English', v: 'EN'}]" :key="lang.v"
                    class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                      <input type="radio" name="lang" :value="lang.v" v-model="selectedLanguage" class="peer appearance-none w-5 h-5 border-2 border-gray-900 rounded-full checked:bg-gray-900 cursor-pointer transition-all" />
                      <div class="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <span class="text-base text-gray-700 group-hover:text-gray-900">{{ lang.l }}</span>
                  </label>
                </div>
              </div>

              <!-- Rating Filter -->
              <div>
                <h4 class="text-base font-bold text-gray-900 mb-4">Ratings</h4>
                <div class="space-y-3">
                  <label v-for="star in [5, 4, 3]" :key="star"
                    class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                      <input type="radio" name="rating" :value="star" @click="selectedRating = selectedRating === star ? null : star" :checked="selectedRating === star" class="peer appearance-none w-5 h-5 border-2 border-gray-900 rounded-full checked:bg-gray-900 cursor-pointer transition-all" />
                      <div class="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="flex">
                        <svg v-for="s in 5" :key="s" class="w-4 h-4" :class="s <= star ? 'text-yellow-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-700">& up</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </aside>

          <!-- Cards -->
          <div class="w-full lg:w-3/4">

            <div v-if="error" class="text-center py-20 text-red-500 font-medium">{{ error }}</div>

            <!-- Skeleton -->
            <template v-else-if="loading">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                <div v-for="i in 4" :key="i" class="flex flex-col animate-pulse">
                  <div class="w-full aspect-video bg-gray-200 mb-3" />
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div class="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                  <div class="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </template>

            <!-- Empty -->
            <div v-else-if="filteredCourses().length === 0" class="text-center py-24 text-gray-400">
              <p class="text-xl font-bold text-gray-900 mb-2">No results found</p>
              <p class="text-base text-gray-600">Please try adjusting your filters</p>
            </div>

            <!-- Real cards -->
            <template v-else>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                <div v-for="course in filteredCourses()" :key="course.id"
                  @click="router.push({ name: 'course-details', params: { slug: course.slug } })"
                  class="group cursor-pointer flex flex-col">

                  <!-- Thumbnail -->
                  <div class="w-full aspect-video relative bg-gray-100 border border-gray-200 mb-2 overflow-hidden">
                    <img v-if="course.thumbnail || course.image || course.image_path" :src="course.thumbnail || course.image || course.image_path" :alt="course.title"
                      class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Info -->
                  <div class="flex flex-col flex-grow">
                    <h3 class="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-primary-600">
                      {{ course.title }}
                    </h3>
                    
                    <p class="text-xs text-gray-500 mb-1 line-clamp-1">
                      Instructor
                    </p>

                    <div class="flex items-center gap-1.5 mb-1">
                      <span class="text-sm font-bold text-yellow-700">4.8</span>
                      <div class="flex text-yellow-500">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span class="text-xs text-gray-400">(1,234)</span>
                    </div>

                    <div class="flex items-center gap-2 mt-auto">
                      <span class="text-base font-bold text-gray-900">
                        {{ course.is_free ? "Free" : `E£${course.price}` }}
                      </span>
                    </div>

                    <div v-if="course.is_free || course.lang" class="flex gap-2 mt-2">
                       <span v-if="course.is_free" class="bg-[#eceb98] text-[#3d3c0a] text-xs font-bold px-2 py-1">Free</span>
                       <span v-if="course.lang" class="bg-[#eceb98] text-[#3d3c0a] text-xs font-bold px-2 py-1">{{ course.lang }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
h1, h2, h3 { font-family: "Inter", sans-serif; }
</style>
