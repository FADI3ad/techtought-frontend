<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="relative bg-gradient-to-r from-white via-[#efefff] to-[#0800FF] overflow-hidden py-12 lg:py-20">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="max-w-3xl">
        <!-- Breadcrumbs / Category -->
        <div class="flex items-center gap-2 text-sm font-bold text-indigo-700 mb-6 uppercase tracking-wider">
          <span>{{ course.category }}</span>
          <span v-if="course.subcategory" class="text-gray-400">/</span>
          <span v-if="course.subcategory">{{ course.subcategory }}</span>
        </div>

        <h1 class="text-3xl lg:text-5xl font-extrabold text-black tracking-tighter leading-tight mb-6">
          {{ course.title }}
        </h1>

        <p class="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 line-clamp-3">
          {{ course.description }}
        </p>

        <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">Language:</span>
            <span>{{ course.language }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">Last updated:</span>
            <span>{{ new Date(course.updated_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
