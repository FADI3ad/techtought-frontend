<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="lg:col-span-2 space-y-12">
    <!-- Description -->
    <section>
      <h2 class="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight mb-6">
        Course Description
      </h2>
      <div class="prose prose-indigo max-w-none text-gray-700 leading-relaxed space-y-4">
        {{ course.description }}
      </div>
    </section>

    <!-- Requirements -->
    <section v-if="course.requirements">
      <h2 class="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight mb-6">
        Requirements
      </h2>
      <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <ul class="space-y-4">
          <li class="flex items-start gap-4 text-gray-700">
            <span class="w-2 h-2 rounded-full bg-indigo-500 mt-2.5 flex-shrink-0"></span>
            <span>{{ course.requirements }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
