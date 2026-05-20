<script setup>
  defineProps({
    course: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <section
    class="relative bg-[#1c1d1f] text-white overflow-hidden py-12 lg:py-16">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-grow max-w-3xl">
          <!-- Breadcrumbs / Category -->
          <div
            class="flex items-center gap-2 text-sm font-bold text-[#c0c4fc] mb-4 uppercase tracking-wider">
            <span>{{ course.category }}</span>
            <span v-if="course.subcategory" class="text-gray-500">/</span>
            <span v-if="course.subcategory">{{ course.subcategory }}</span>
          </div>

          <h1
            class="text-3xl lg:text-[40px] font-black text-white tracking-tight leading-tight mb-4">
            {{ course.title }}
          </h1>

          <p
            class="text-gray-300 text-lg lg:text-xl leading-relaxed mb-6 line-clamp-3">
            {{ course.description }}
          </p>

          <!-- Ratings Summary -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 text-sm">
            <span class="text-amber-400 font-black text-base">{{ parseFloat(course.avg_rating || 0).toFixed(1) }}</span>
            <div class="flex items-center text-[11px] -mt-0.5 ml-1">
              <span
                v-for="star in 5"
                :key="star"
                :class="
                  star <= Math.round(course.avg_rating || 0)
                    ? 'text-amber-400'
                    : 'text-gray-600'
                "
                >★</span
              >
            </div>
            <span
              class="text-[#c0c4fc] font-bold hover:underline cursor-pointer"
              >({{ course.reviews_count || 0 }} ratings)</span
            >
            <span class="text-gray-500">•</span>
            <span class="text-gray-300 font-medium">195,199 students</span>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm border border-gray-700">
              {{ (course.instructor?.name || "T")[0].toUpperCase() }}
            </div>
            <span class="text-gray-300 text-sm font-medium">
              Created by
              <span
                class="text-[#c0c4fc] font-bold hover:underline cursor-pointer"
                >{{ course.instructor?.name || "TechTought Instructor" }}</span
              >
            </span>
          </div>

          <div
            class="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span class="font-bold">Language:</span>
              <span>{{ course.language }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-bold">Last updated:</span>
              <span>{{
                new Date(course.updated_at).toLocaleDateString()
              }}</span>
            </div>
          </div>

          <!-- Hero Action (Mobile optimized) -->
          <div class="lg:hidden">
            <button
              @click="$emit('enroll')"
              class="w-full bg-[#a435f0] hover:bg-[#8710d8] text-white py-4 rounded-xl font-bold text-lg shadow-xl active:scale-95 transition-all">
              {{
                course.is_enrolled
                  ? "Go to Course"
                  : course.is_free
                    ? "Enroll Now"
                    : "Buy Now"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
