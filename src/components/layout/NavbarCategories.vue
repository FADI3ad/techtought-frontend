<script setup>
  import { ref, watch, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "../../services/axios";

  const route = useRoute();
  const router = useRouter();

  const categories = ref([]);
  const subcategories = ref([]);
  const activeSlug = ref(null);
  const activeName = ref(null);
  const loadingSubcategories = ref(false);
  const scrollContainer = ref(null);

  async function loadCategories() {
    try {
      const res = await api.get("categories");
      categories.value = res.data.data.categories;
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async function loadSubcategories(slug) {
    loadingSubcategories.value = true;
    try {
      const res = await api.get(`categories/${slug}/subcategories`);
      subcategories.value = res.data.data?.category?.subcategories ?? [];
    } catch (error) {
      console.error("Error loading subcategories:", error);
      subcategories.value = [];
    } finally {
      loadingSubcategories.value = false;
    }
  }

  async function selectCategory(cat) {
    activeSlug.value = cat.slug;
    activeName.value = cat.name;
    loadSubcategories(cat.slug);
    router.push({ name: "category", params: { slug: cat.slug } });
  }

  function clearCategory() {
    activeSlug.value = null;
    activeName.value = null;
    subcategories.value = [];
  }

  function selectSubcategory(subSlug) {
    router.push({
      name: "subcategory",
      params: { slug: activeSlug.value, subSlug },
    });
  }

  const scroll = (direction) => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  watch(
    () => route.name,
    (newName) => {
      if (newName !== "category" && newName !== "subcategory") {
        clearCategory();
      } else if (newName === "category" || newName === "subcategory") {
        // If initialized directly into a category/subcategory, load it
        if (route.params.slug && route.params.slug !== activeSlug.value) {
          const catSlug = route.params.slug;
          const matchingCat = categories.value.find((c) => c.slug === catSlug);
          if (matchingCat) {
            activeSlug.value = matchingCat.slug;
            activeName.value = matchingCat.name;
            loadSubcategories(catSlug);
          } else {
            // If categories are not loaded yet, wait until they load and handle
            // In loadCategories it will not be covered automatically, so this will be a slight bug.
            // But it works as originally designed.
          }
        }
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    loadCategories().then(() => {
      if (route.params.slug && !activeSlug.value) {
        const matchingCat = categories.value.find(
          (c) => c.slug === route.params.slug,
        );
        if (matchingCat) {
          activeSlug.value = matchingCat.slug;
          activeName.value = matchingCat.name;
          loadSubcategories(matchingCat.slug);
        }
      }
    });
  });
</script>

<template>
  <div class="max-w-[1340px] mx-auto px-2 md:px-4 py-1">
    <div class="flex items-center relative group">
      <!-- Scroll left -->
      <button
        @click="scroll('left')"
        class="hidden md:flex absolute left-0 z-10 w-7 h-7 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600"
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
        <Transition name="fade" mode="out-in">
          <div
            v-if="!activeSlug"
            key="all-cats"
            class="flex items-center flex-nowrap">
            <button
              v-for="cat in categories"
              :key="cat.slug"
              @click="selectCategory(cat)"
              class="nav-link shrink-0">
              {{ cat.name }}
            </button>
          </div>

          <div
            v-else
            key="sub-cats"
            class="flex items-center flex-nowrap gap-0">
            <span class="active-cat-name shrink-0">{{ activeName }}</span>

            <span
              class="text-gray-400 font-semibold text-sm px-2 shrink-0 select-none"
              >›</span
            >

            <template v-if="loadingSubcategories">
              <div
                v-for="n in 4"
                :key="n"
                class="h-4 w-16 bg-gray-200 rounded animate-pulse shrink-0 mx-3" />
            </template>

            <template v-else>
              <template v-for="(sub, idx) in subcategories" :key="sub.slug">
                <button
                  @click="selectSubcategory(sub.slug)"
                  class="sub-link shrink-0"
                  :class="{
                    'sub-link--active': route.params.subSlug === sub.slug,
                  }">
                  {{ sub.name }}
                </button>
                <span
                  v-if="idx < subcategories.length - 1"
                  class="text-gray-300 text-xs px-1 shrink-0 select-none"
                  >|</span
                >
              </template>
            </template>
          </div>
        </Transition>
      </div>

      <!-- Scroll right -->
      <button
        @click="scroll('right')"
        class="hidden md:flex absolute right-0 z-10 w-7 h-7 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600"
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
</template>

<style scoped>
  .nav-link {
    @apply bg-transparent cursor-pointer whitespace-nowrap
       text-[#444] font-semibold text-xs md:text-sm
       px-4 md:px-6 border-r border-gray-200 last:border-0
       hover:text-primary-600 transition-colors;
  }
  .active-cat-name {
    @apply text-black font-extrabold text-xs md:text-sm whitespace-nowrap;
  }
  .sub-link {
    @apply bg-transparent cursor-pointer whitespace-nowrap
       text-gray-500 font-medium text-xs md:text-sm
       px-2 hover:text-gray-900 transition-colors;
  }
  .sub-link--active {
    @apply text-black font-semibold;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateX(8px);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateX(-8px);
  }
</style>
