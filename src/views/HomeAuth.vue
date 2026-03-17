<script setup>
  import { ref, onMounted } from "vue";
  import CourseCard from "../components/CourseCard.vue";
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
          title:
            "Beginner's Guide To Becoming A Professional Frontend Developer",
          image_path:
            "https://placehold.co/600x400/1e1e2e/white?text=Course+Image",
        }));
      trendingCourses.value = mock;
      fundamentalsCourses.value = mock;
    }
  }

  onMounted(() => {
    loadData();
  });

  function scrollSection(e, direction) {
    const track = e.currentTarget
      .closest(".scroll-section-wrapper")
      .querySelector(".scroll-track");
    track.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  }
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="pt-24 pb-12 bg-gradient-to-b from-[#f8f8ff] to-white">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div class="flex items-center gap-6">
          <div class="relative">
            <img
              src="https://placehold.co/100x100?text=S"
              alt="Sandra"
              class="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" />
            <div
              class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1
              class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Welcome back, <span class="text-indigo-600">Sandra</span>
            </h1>
            <p class="text-gray-500 mt-1 font-medium">
              Ready to continue your learning journey?
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-[1340px] mx-auto px-6 lg:px-10 space-y-20 pb-24">
      <!-- Section 1: Computer Fundamentals -->
      <section>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
            Top courses in Computer Fundamentals
          </h2>
          <div class="w-20 h-1.5 bg-indigo-600 mt-2 rounded-full"></div>
        </div>

        <div class="scroll-section-wrapper relative group ">
          <!-- زر اليسار -->
          <button
            @click="scrollSection($event, 'left')"
            class="scroll-btn absolute -left-5 top-1/2 -translate-y-1/2 z-10"
            aria-label="scroll left">
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

          <!-- Track -->
          <div class="scroll-track overflow-x-auto pb-3">
            <div class="flex gap-5" style="width: max-content">
              <div
                v-for="course in fundamentalsCourses"
                :key="course.id"
                class="course-card-wrapper">
                <CourseCard :course="course" />
              </div>
            </div>
          </div>

          <!-- زر اليمين -->
          <button
            @click="scrollSection($event, 'right')"
            class="scroll-btn absolute -right-5 top-1/2 -translate-y-1/2 z-10"
            aria-label="scroll right">
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
      </section>

      <div class="h-px bg-gray-100 w-full"></div>

      <!-- Section 2: Trending -->
      <section>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
            Trending Courses
          </h2>
          <div class="w-20 h-1.5 bg-indigo-600 mt-2 rounded-full"></div>
        </div>

        <div class="scroll-section-wrapper relative group">
          <!-- زر اليسار -->
          <button
            @click="scrollSection($event, 'left')"
            class="scroll-btn absolute -left-5 top-1/2 -translate-y-1/2 z-10"
            aria-label="scroll left">
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

          <!-- Track -->
          <div class="scroll-track overflow-x-auto pb-3">
            <div class="flex gap-5" style="width: max-content">
              <div
                v-for="course in trendingCourses"
                :key="course.id"
                class="course-card-wrapper">
                <CourseCard :course="course" />
              </div>
            </div>
          </div>

          <!-- زر اليمين -->
          <button
            @click="scrollSection($event, 'right')"
            class="scroll-btn absolute -right-5 top-1/2 -translate-y-1/2 z-10"
            aria-label="scroll right">
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
      </section>
    </main>

    <!-- Footer -->
    <footer class="py-10 border-t border-gray-50 text-center">
      <p class="text-gray-400 text-xs font-medium uppercase tracking-widest">
        © 2026 TechTought · Keep Learning
      </p>
    </footer>
  </div>
</template>

<style scoped>
  h1,
  h2 {
    font-family: "Inter", sans-serif;
  }

  /* ===== Scroll Track ===== */
  .scroll-track {
    /* إخفاء الـ scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }
  .scroll-track::-webkit-scrollbar {
    display: none;
  }


  .course-card-wrapper {
    flex-shrink: 0;
    width: 240px; 
  }

 


  /* hover effect على الكارت */
  .course-card-wrapper {
    transition: transform 0.3s ease;
  }
  .course-card-wrapper:hover {
    transform: translateY(-6px);
  }
  /* ===== Scroll Buttons ===== */
  .scroll-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    opacity: 0;
    transition:
      opacity 0.2s ease,
      box-shadow 0.2s ease;
  }

  .group:hover .scroll-btn {
    opacity: 1;
  }

  .scroll-btn:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    .scroll-btn {
      opacity: 1;
      width: 28px;
      height: 28px;
    }
  }
</style>
