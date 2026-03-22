<script setup>
  const props = defineProps({
    course: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="course-inner cursor-pointer">
    <div
      class="relative overflow-hidden rounded-xl mb-4 shadow-sm transition-shadow duration-300">
      <img
        :src="course.image"
        alt="Course Thumbnail"
        class="w-full h-34 object-cover transition-transform duration-500" />
    </div>

    <h3 class="font-bold leading-snug mb-2 transition-colors duration-300">
      {{ course.title }}
    </h3>

    <div class="flex items-center text-sm text-gray-500 gap-3 mb-2 flex-nowrap">
      <span class="flex items-center gap-1 whitespace-nowrap">
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        10 weeks
      </span>

      <span class="flex items-center gap-1 whitespace-nowrap">
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        24 lessons
      </span>
    </div>

    <div class="flex items-center justify-between border-t pt-3">
      <span class="text-sm font-medium text-gray-700">Robert Martinez</span>
      <div class="flex items-center gap-1">
        <span class="text-yellow-400 text-xs">★★★★★</span>
        <span class="text-xs font-bold text-gray-900">4.8</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .course-inner:hover .relative {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .course-inner:hover img {
    transform: scale(1.05);
  }

  .course-inner:hover h3 {
    color: #4f46e5;
  }
</style>
