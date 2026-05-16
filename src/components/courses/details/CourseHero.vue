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
            class="flex items-center gap-2 text-sm font-bold text-indigo-700 mb-6 uppercase tracking-wider">
            <span>{{ course.category }}</span>
            <span v-if="course.subcategory" class="text-gray-400">/</span>
            <span v-if="course.subcategory">{{ course.subcategory }}</span>
          </div>

          <h1
            class="text-3xl lg:text-5xl font-extrabold text-black tracking-tighter leading-tight mb-6">
            {{ course.title }}
          </h1>

          <p
            class="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 line-clamp-3">
            {{ course.description }}
          </p>

            <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
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
                class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all"
              >
                {{ course.is_enrolled ? 'Go to Course' : (course.is_free ? 'Enroll Now' : 'Buy Now') }}
              </button>
            </div>
          </div>

        <!-- Course Image -->

      </div>
    </div>
  </section>
</template>
