<script setup>
  import { ref, onMounted } from "vue";
  import api from "../../services/axios";
  import CourseCard from "../courses/CourseCard.vue";

  const tabs = ref([]);
  const category = ref(null);
  const courses = ref([]);
  const activeTab = ref(null);

  async function getCategories() {
    try {
      const response = await api.get("/categories");
      tabs.value = response.data.data.categories;
      if (tabs.value.length) {
        selectCategory(tabs.value[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategoryCoursesAndImages(slug) {
    try {
      const response = await api.get(`categories/${slug}/courses`);
      category.value = response.data.data.category;
      courses.value = response.data.data.category.courses;
    } catch (error) {
      console.error(error);
    }
  }

  function selectCategory(tab) {
    activeTab.value = tab.slug;
    getCategoryCoursesAndImages(tab.slug);
  }

  onMounted(() => {
    getCategories();
  });
</script>

<template>
  <section class="py-16 bg-white">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="mb-10">
        <h2
          class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
          Skills to transform your career and
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            life
          </span>
        </h2>
        <p class="text-gray-500 text-lg leading-relaxed max-w-2xl">
          From critical skills to technical topics, TechTought supports your
          professional development.
        </p>
      </div>

      <div class="flex flex-wrap border-b border-gray-200 mb-12 gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectCategory(tab)"
          class="pb-4 text-lg font-medium transition-all duration-300 relative"
          :class="
            activeTab === tab.slug
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 hover:text-gray-600'
          ">
          {{ tab.name }}
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-10 items-start">
        <div class="w-full lg:w-1/3 flex justify-center">
          <div class="grid grid-cols-2 gap-2">
            <template v-if="category?.image">
              <div class="col-span-2 h-[400px] rounded-lg overflow-hidden">
                <img
                  :src="category.image"
                  :alt="category.name"
                  class="w-full h-full object-cover object-center" />
              </div>
            </template>
          </div>
        </div>

        <div
          class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            :course="course" />
        </div>
      </div>

      <div class="mt-12 text-center lg:text-left">
        <a
          href="#"
          class="inline-flex items-center text-[#3b82f6] font-bold hover:underline">
          show all courses
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
