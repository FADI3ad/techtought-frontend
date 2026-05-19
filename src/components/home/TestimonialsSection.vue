<script setup>
  import { ref, onMounted, computed } from "vue";
  import api from "../../services/axios";

  const testimonials = ref([]);
  const loading = ref(true);
  const error = ref("");
  const currentSlide = ref(0);

  // Divide testimonials into horizontal pages/slides of max 3 items
  const chunks = computed(() => {
    const result = [];
    const list = testimonials.value;
    for (let i = 0; i < list.length; i += 3) {
      result.push(list.slice(i, i + 3));
    }
    return result;
  });

  function prevSlide() {
    if (currentSlide.value > 0) {
      currentSlide.value--;
    } else {
      currentSlide.value = chunks.value.length - 1; // loop back to end
    }
  }

  function nextSlide() {
    if (currentSlide.value < chunks.value.length - 1) {
      currentSlide.value++;
    } else {
      currentSlide.value = 0; // loop back to start
    }
  }

  function goToSlide(index) {
    currentSlide.value = index;
  }

  async function loadTestimonials() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/testimonials");
      testimonials.value = response?.data?.data?.testimonials || [];
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      error.value = "Failed to load testimonials.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadTestimonials);
</script>

<template>
  <section class="py-20 bg-[#f8fafc] border-t border-gray-100">
    <div class="max-w-[1200px] mx-auto px-6">
      <!-- Section Title (matches FeaturesSection exactly in style) -->
      <div class="text-center mb-16">
        <h2
          class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          What Our Students
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            Say
          </span>
        </h2>
        <p class="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
          Real feedback from students who transformed their learning journey and
          achieved their tech goals with TechTought.
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12">
        <div
          class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm mt-3 font-medium">Loading stories...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-500 font-medium">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div
        v-else-if="testimonials.length === 0"
        class="text-center py-12 text-gray-400 font-medium">
        No visible success stories yet.
      </div>

      <!-- Testimonials Horizontal Carousel (matches FeaturesSection card layout, but paginated horizontally!) -->
      <div v-else class="relative">
        <Transition name="fade" mode="out-in">
          <div
            :key="currentSlide"
            class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
            <div
              v-for="testi in chunks[currentSlide]"
              :key="testi.id"
              class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col items-center text-center">
              <!-- Avatar (matches Feature's icon container size w-20 h-20 exactly!) -->
              <div
                class="w-20 h-20 mb-6 rounded-full border-2 border-gray-100 group-hover:border-primary-300 group-hover:bg-primary-50 transition-all duration-300 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  v-if="testi.user?.image_path || testi.user?.image"
                  :src="testi.user.image_path || testi.user.image"
                  :alt="testi.user?.name"
                  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                <!-- Default beautiful placeholder with initial letter if no avatar is uploaded -->
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center font-black text-primary-600 bg-primary-50 text-2xl uppercase select-none">
                  {{ testi.user?.name ? testi.user.name.charAt(0) : "S" }}
                </div>
              </div>

              <!-- Student Name -->
              <h3 class="text-xl font-bold text-gray-800 mb-1">
                {{ testi.user?.name || "TechTought Student" }}
              </h3>

              <!-- Role / Subtitle -->
              <span
                class="text-xs font-semibold text-primary-500 tracking-wider uppercase mb-3">
                Student
              </span>

              <!-- Rating Stars (Beautiful and dynamic!) -->
              <div class="flex items-center gap-1 mb-4">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-lg transition-transform duration-300 group-hover:scale-110"
                  :class="
                    star <= testi.rating ? 'text-yellow-400' : 'text-gray-200'
                  ">
                  ★
                </span>
              </div>

              <!-- Review Text (database field is comment) -->
              <p class="text-gray-500 leading-relaxed text-sm italic">
                "{{ testi.comment }}"
              </p>
            </div>
          </div>
        </Transition>

        <!-- Slider Controls / Pagination dots and buttons -->
        <div
          v-if="chunks.length > 1"
          class="flex justify-center items-center gap-4 mt-12">
          <!-- Back Arrow Button -->
          <button
            @click="prevSlide"
            class="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-200 hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Dot Indicators -->
          <div class="flex items-center gap-2">
            <button
              v-for="(_, index) in chunks"
              :key="index"
              @click="goToSlide(index)"
              class="h-2.5 rounded-full transition-all duration-500 cursor-pointer"
              :class="
                currentSlide === index
                  ? 'w-8 bg-primary-600 shadow-sm shadow-primary-100'
                  : 'w-2.5 bg-gray-200 hover:bg-gray-300'
              "></button>
          </div>

          <!-- Forward Arrow Button -->
          <button
            @click="nextSlide"
            class="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-200 hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  /* High fidelity premium slide fade transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateY(12px) scale(0.99);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateY(-12px) scale(0.99);
  }
</style>
