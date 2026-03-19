<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios";

const route = useRoute();

const category     = ref(null); // courses + meta  (all-courses endpoint)
const categoryInfo = ref(null); // name + description + image  (single endpoint)
const courses      = ref([]);
const loading      = ref(true);
const error        = ref(null);

const selectedPrice  = ref("All Prices");
const selectedRating = ref(null);

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
  return courses.value.filter((c) =>
    selectedPrice.value === "All Prices" ||
    (selectedPrice.value === "Free" && c.is_free) ||
    (selectedPrice.value === "Paid" && !c.is_free)
  );
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
                     bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-indigo-200"
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

          <!-- Sidebar -->
          <aside class="w-full lg:w-1/4 space-y-8">
            <!-- Price -->
            <div class="border-b border-gray-100 pb-6">
              <h4 class="font-bold text-lg mb-4 text-[#0f172a]">Price</h4>
              <div class="space-y-3">
                <label v-for="price in ['All Prices', 'Free', 'Paid']" :key="price"
                  class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="price" :value="price" v-model="selectedPrice"
                    class="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-gray-600 group-hover:text-black transition-colors">{{ price }}</span>
                </label>
              </div>
            </div>
            <!-- Rating -->
            <div>
              <h4 class="font-bold text-lg mb-4 text-[#0f172a]">Rating</h4>
              <div class="space-y-3">
                <div v-for="star in [5, 4, 3]" :key="star"
                  @click="selectedRating = selectedRating === star ? null : star"
                  class="flex items-center gap-2 cursor-pointer group">
                  <div class="flex">
                    <span v-for="s in 5" :key="s"
                      :class="s <= star ? 'text-yellow-400' : 'text-gray-200'">★</span>
                  </div>
                  <span class="text-sm transition-colors"
                    :class="selectedRating === star ? 'text-black font-semibold' : 'text-gray-500 group-hover:text-black'">
                    & Up
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Cards -->
          <div class="w-full lg:w-3/4 space-y-6">

            <div v-if="error" class="text-center py-20 text-red-500 font-medium">{{ error }}</div>

            <!-- Skeleton -->
            <template v-else-if="loading">
              <div v-for="i in 4" :key="i"
                class="flex flex-col md:flex-row border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div class="w-full md:w-80 h-52 bg-gray-200 flex-shrink-0" />
                <div class="p-6 flex flex-col gap-4 flex-grow">
                  <div class="h-6 bg-gray-200 rounded w-3/4" />
                  <div class="h-4 bg-gray-100 rounded w-full" />
                  <div class="h-4 bg-gray-100 rounded w-2/3" />
                  <div class="mt-auto flex justify-between">
                    <div class="h-8 w-24 bg-gray-200 rounded-full" />
                    <div class="h-8 w-20 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </div>
            </template>

            <!-- Empty -->
            <div v-else-if="filteredCourses().length === 0"
              class="text-center py-24 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-lg font-medium">No courses found</p>
              <p class="text-sm mt-1">Try adjusting your filters</p>
            </div>

            <!-- Real cards -->
            <template v-else>
              <div v-for="course in filteredCourses()" :key="course.id"
                class="flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl
                       overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">

                <!-- Thumbnail -->
                <div class="w-full md:w-80 h-52 flex-shrink-0 relative overflow-hidden bg-gray-100">
                  <img v-if="course.image_path" :src="course.image_path" :alt="course.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div v-else
                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-indigo-200"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3
                           6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168
                           5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477
                           18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div class="absolute top-4 left-4 text-[10px] px-3 py-1 rounded-full font-extrabold uppercase shadow-sm"
                    :class="course.is_free ? 'bg-green-500 text-white' : 'bg-white/90 backdrop-blur-sm text-blue-600'">
                    {{ course.is_free ? "Free" : "Paid" }}
                  </div>
                </div>

                <!-- Info -->
                <div class="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div class="flex justify-between items-start gap-4 mb-2">
                      <h3 class="font-bold text-xl text-[#0f172a] leading-snug group-hover:text-blue-600 transition-colors">
                        {{ course.title }}
                      </h3>
                      <span class="block font-black text-xl text-black leading-none shrink-0">
                        {{ course.is_free ? "Free" : `E£${course.price}` }}
                      </span>
                    </div>
                    <p v-if="course.description"
                      class="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {{ course.description }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span class="text-xs font-semibold px-3 py-1 rounded-full"
                      :class="course.lang === 'AR' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'">
                      {{ course.lang === 'AR' ? '🇪🇬 Arabic' : '🇺🇸 English' }}
                    </span>
                    <div class="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <span class="text-sm font-bold text-yellow-700">4.8</span>
                      <div class="flex text-yellow-400 text-xs">★★★★★</div>
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