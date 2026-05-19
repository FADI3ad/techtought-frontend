<script setup>
import { computed } from "vue";

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const dynamicOutcomes = computed(() => {
  const title = props.course.title.toLowerCase();
  if (title.includes("computer science") || title.includes("cs")) {
    return [
      "Master the fundamental building blocks of Computer Science and programming foundations.",
      "Understand complex data structures and standard sorting/searching algorithms.",
      "Learn key principles of system architecture, hardware interface, and software systems.",
      "Develop strong analytical thinking and problem-solving skills to tackle complex coding challenges."
    ];
  }
  if (title.includes("laravel") || title.includes("php") || title.includes("back")) {
    return [
      "Build highly scalable, secure, and robust web applications using Laravel.",
      "Master the Eloquent ORM, MVC architecture pattern, and routing systems.",
      "Integrate secure authentication, database migrations, and standard API services.",
      "Deploy Laravel applications to production servers with automated systems."
    ];
  }
  if (title.includes("vue") || title.includes("javascript") || title.includes("frontend") || title.includes("react")) {
    return [
      "Master the modern reactive core of Vue 3 and modern CSS layouts.",
      "Manage complex application states cleanly using standard stores.",
      "Build single-page apps (SPA) with responsive and vibrant design systems.",
      "Understand modern frontend bundle tools, routing, and RESTful API integrations."
    ];
  }
  // Generic beautiful outcomes
  return [
    `Establish a rock-solid professional understanding of ${props.course.title}.`,
    "Build real-world projects and practical applications step by step.",
    "Master core conceptual theories along with practical industry workflows.",
    "Get support and join discussions with standard student learning forums."
  ];
});

const formattedRequirements = computed(() => {
  if (!props.course.requirements) return [];
  if (props.course.requirements.includes('\n')) {
    return props.course.requirements.split('\n').map(r => r.trim()).filter(Boolean);
  }
  if (props.course.requirements.includes(',')) {
    return props.course.requirements.split(',').map(r => r.trim()).filter(Boolean);
  }
  return [props.course.requirements];
});
</script>

<template>
  <div class="lg:col-span-2 space-y-10">
    <!-- What You'll Learn Box (Udemy Style, simple border-radius) -->
    <section class="bg-white rounded-lg p-6 border border-[#d1d7dc] shadow-sm">
      <h2 class="text-2xl font-bold text-[#1c1d1f] tracking-tight mb-5">
        What you'll learn
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div 
          v-for="(outcome, idx) in dynamicOutcomes" 
          :key="idx"
          class="flex items-start gap-3 text-gray-700"
        >
          <!-- Checklist tick icon -->
          <svg class="w-4 h-4 text-gray-800 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-[14px] text-[#1c1d1f] leading-relaxed">{{ outcome }}</span>
        </div>
      </div>
    </section>

    <!-- Requirements (Classic bullet list) -->
    <section v-if="formattedRequirements.length > 0" class="space-y-4">
      <h2 class="text-2xl font-bold text-[#1c1d1f] tracking-tight">
        Requirements
      </h2>
      <ul class="list-disc list-inside pl-1 space-y-2.5 text-gray-800 text-[14px]">
        <li 
          v-for="(req, idx) in formattedRequirements" 
          :key="idx"
          class="leading-relaxed"
        >
          <span class="font-medium text-[#1c1d1f] ml-1">{{ req }}</span>
        </li>
      </ul>
    </section>

    <!-- Description (Classic direct layout) -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-[#1c1d1f] tracking-tight">
        Description
      </h2>
      <div class="text-[#1c1d1f] leading-relaxed text-[14px] whitespace-pre-wrap font-normal">
        {{ course.description }}
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Classic clean styles */
</style>
