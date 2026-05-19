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
    class="relative bg-gradient-to-r from-white via-[#efefff] to-[#e0e7ff] overflow-hidden py-12 lg:py-20">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-grow max-w-3xl">
          <!-- Breadcrumbs / Category -->
          <div
            class="flex items-center gap-2 text-sm font-bold text-primary-700 mb-6 uppercase tracking-wider">
            <span>{{ course.category }}</span>
            <span v-if="course.subcategory" class="text-gray-400">/</span>
            <span v-if="course.subcategory">{{ course.subcategory }}</span>
          </div>

          <h1
            class="text-3xl lg:text-5xl font-extrabold text-black tracking-tighter leading-tight mb-4">
            {{ course.title }}
          </h1>

          <!-- Ratings Summary -->
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6 text-sm">
            <div
              class="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg text-amber-800 font-black">
              <span>{{ parseFloat(course.avg_rating || 0).toFixed(1) }}</span>
              <div class="flex items-center text-[10px] -mt-0.5 ml-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="
                    star <= Math.round(course.avg_rating || 0)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  "
                  >★</span
                >
              </div>
            </div>
            <span
              class="text-primary-700 font-bold hover:underline cursor-pointer"
              >({{ course.reviews_count || 0 }} ratings)</span
            >
          </div>

          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-200">
              {{ (course.instructor?.name || "T")[0].toUpperCase() }}
            </div>
            <span class="text-gray-600 text-sm font-medium">
              Created by
              <span
                class="text-primary-700 font-bold hover:underline cursor-pointer"
                >{{ course.instructor?.name || "TechTought Instructor" }}</span
              >
            </span>
          </div>

          <p
            class="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 line-clamp-3">
            {{ course.description }}
          </p>

          <div
            class="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900">Language:</span>
              <span>{{ course.language }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900">Last updated:</span>
              <span>{{
                new Date(course.updated_at).toLocaleDateString()
              }}</span>
            </div>
          </div>

          <!-- Hero Action (Mobile optimized) -->
          <div class="lg:hidden">
            <button
              @click="$emit('enroll')"
              class="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-100 active:scale-95 transition-all">
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

        <!-- Course Image -->
      </div>
    </div>
  </section>
</template>
