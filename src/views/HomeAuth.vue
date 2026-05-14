<script setup>
  import { ref, onMounted } from "vue";
  import WelcomeHeader from "../components/WelcomeHeader.vue";
  import CourseCarousel from "../components/CourseCarousel.vue";
  import Footer from "../components/Footer.vue";
  import api from "../api/axios";

  const trendingCourses = ref([]);
  const fundamentalsCourses = ref([]);

  async function loadData() {
    try {
      const resTrending = await api.get("categories/trending/courses");
      trendingCourses.value = resTrending.data.data.category.courses;

      const resFundamentals = await api.get(
        "categories/computer-fundamentals/courses",
      );
      fundamentalsCourses.value = resFundamentals.data.data.category.courses;
    } catch (error) {
      console.error("Error loading courses:", error);
      const mock = Array(8)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          title: "Beginner's Guide To Becoming A Professional Frontend Developer",
          image_path: "https://placehold.co/600x400/1e1e2e/white?text=Course+Image",
          image: "https://placehold.co/600x400/1e1e2e/white?text=Course+Image",
        }));
      trendingCourses.value = mock;
      fundamentalsCourses.value = mock;
    }
  }

  onMounted(() => {
    loadData();
  });
</script>

<template>
  <div class="min-h-screen bg-white">
    <WelcomeHeader />

    <main class="max-w-[1340px] mx-auto px-6 lg:px-10 space-y-12 pb-24">
      <CourseCarousel
        title="Top courses in Computer Fundamentals"
        :courses="fundamentalsCourses" />

      <div class="h-px bg-gray-100 w-full"></div>

      <CourseCarousel
        title="Trending Courses"
        :courses="trendingCourses" />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
  main {
    font-family: "Inter", sans-serif;
  }
</style>
