<script setup>
  import CourseCard from "./CourseCard.vue";

  defineProps({
    title: {
      type: String,
      required: true,
    },
    courses: {
      type: Array,
      required: true,
    },
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
  <section class="py-8">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
        {{ title }}
      </h2>
      <div class="w-20 h-1.5 bg-primary-600 mt-2 rounded-full"></div>
    </div>

    <div class="scroll-section-wrapper relative hover-trigger">
      <!-- Left Button -->
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
      <div class="scroll-track overflow-x-auto pb-6 no-scrollbar">
        <div class="flex gap-6" style="width: max-content">
          <div
            v-for="course in courses"
            :key="course.id"
            class="course-card-container">
            <CourseCard :course="course" />
          </div>
        </div>
      </div>

      <!-- Right Button -->
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
</template>

<style scoped>
  .scroll-track {
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }
  .scroll-track::-webkit-scrollbar {
    display: none;
  }

  .course-card-container {
    flex-shrink: 0;
    width: 280px;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding: 10px 0;
  }

  .course-card-container:hover {
    transform: translateY(-8px);
  }

  .scroll-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .hover-trigger:hover .scroll-btn {
    opacity: 1;
  }

  .scroll-btn:hover {
    background: #f9fafb;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    .scroll-btn {
      opacity: 1;
      width: 32px;
      height: 32px;
    }
    .course-card-container {
      width: 250px;
    }
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
