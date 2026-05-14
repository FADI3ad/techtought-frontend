<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="w-full lg:w-[400px] flex-shrink-0 lg:-mt-64 relative z-20">
    <div class="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden sticky top-8">
      <!-- Course Image -->
      <div class="aspect-video relative overflow-hidden bg-gray-100">
        <img 
          :src="course.image_path" 
          :alt="course.title"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div class="absolute inset-0 bg-black/10"></div>
      </div>

      <div class="p-8">
        <!-- Price Section -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl font-black text-gray-900">
            {{ course.is_free ? 'Free' : `E£${course.price}` }}
          </span>
          <span v-if="!course.is_free" class="text-gray-400 line-through text-lg">E£{{ (parseFloat(course.price) * 1.5).toFixed(2) }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3 mb-8">
          <button class="w-full bg-[#1DA1F2] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
            {{ course.is_free ? 'Enroll Now' : 'Buy Now' }}
          </button>
          <button class="w-full border-2 border-black text-black py-4 rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all active:scale-[0.98]">
            Add to cart
          </button>
        </div>

        <!-- Features List -->
        <div class="space-y-4 pt-6 border-t border-gray-100">
          <h4 class="font-bold text-gray-900 text-sm uppercase tracking-wider">This course includes:</h4>
          <ul class="space-y-3 text-gray-600 text-sm">
            <li class="flex items-center gap-3">
              <span class="text-lg">▶</span>
              <span>Full lifetime access</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg">📱</span>
              <span>Access on mobile and TV</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-lg">🏆</span>
              <span>Certificate of completion</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
