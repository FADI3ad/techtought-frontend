<script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../../stores/useAuthStore";
  import api from "../../services/axios";

  const router = useRouter();
  const authStore = useAuthStore();

  const props = defineProps({
    course: {
      type: Object,
      required: true,
    },
  });

  const courseImage = computed(() => {
    const img = props.course.image || props.course.image_path;
    if (!img) return '';
    if (img.startsWith('http')) return img;
    // Fallback for relative paths missing the base URL
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    return `${baseUrl}/storage/${img}`;
  });

  const hovered = ref(false);
  const popoverPosition = ref("right");
  let hoverTimeout = null;

  const onMouseEnter = (event) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    const rect = event.currentTarget.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - rect.right;
    if (spaceOnRight < 340) {
      popoverPosition.value = "left";
    } else {
      popoverPosition.value = "right";
    }

    // Udemy-style hover delay of 350ms
    hoverTimeout = setTimeout(() => {
      hovered.value = true;
    }, 350);
  };

  const onMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hovered.value = false;
  };

  const goToDetails = () => {
    router.push({ name: "course-details", params: { slug: props.course.slug } });
  };

  const handleEnroll = async () => {
    if (!authStore.isLoggedIn) {
      router.push("/login");
      return;
    }

    if (props.course.is_enrolled) {
      router.push(`/course/${props.course.slug}/learn`);
      return;
    }

    if (props.course.is_free) {
      try {
        const response = await api.post("/enroll", {
          course_id: props.course.id,
        });
        if (response.data.status === "success") {
          router.push(`/course/${props.course.slug}/learn`);
        }
      } catch (err) {
        console.error("Enrollment failed:", err);
      }
    } else {
      goToDetails();
    }
  };
</script>

<template>
  <div 
    @click="goToDetails" 
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    class="course-inner cursor-pointer flex flex-col h-full group relative"
  >
    
    <div
      class="relative aspect-video overflow-hidden rounded-xl mb-4 shadow-sm transition-shadow duration-300 bg-gray-100">
      <img
        :src="courseImage"
        alt="Course Thumbnail"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[1px]" />
      
      <!-- Floating Price Badge on Top of Image -->
      <div class="absolute top-3 left-3 z-10 flex items-center">
        <span 
          v-if="course.is_free"
          class="bg-emerald-500/90 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm border border-emerald-400/30"
        >
          Free
        </span>
        <span 
          v-else
          class="bg-[#1c1d1f]/90 text-white font-extrabold text-xs px-3 py-1 rounded-md shadow-md backdrop-blur-sm border border-white/20"
        >
          ${{ course.price }}
        </span>
      </div>
    </div>

    <h3 class="font-bold leading-snug mb-2 transition-colors duration-300 group-hover:text-[#4f46e5] line-clamp-2 min-h-[2.8rem] text-gray-900">
      {{ course.title }}
    </h3>

    <div class="flex items-center text-sm text-gray-500 gap-3 mb-4 flex-nowrap">
      <span class="flex items-center gap-1 whitespace-nowrap">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ course.duration || 'Self-paced' }}
      </span>

      <span class="flex items-center gap-1 whitespace-nowrap">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        {{ course.lessons_count || 0 }} lessons
      </span>
    </div>

    <!-- Reverted Clean Bottom Row -->
    <div class="flex items-center justify-between border-t pt-3 mt-auto">
      <span class="text-sm font-medium text-gray-700 truncate max-w-[150px]" :title="course.instructor?.name">
        {{ course.instructor?.name || 'Instructor' }}
      </span>
      <div class="flex items-center gap-1">
        <span class="text-yellow-400 text-xs">★</span>
        <span class="text-xs font-bold text-gray-900">{{ Number(course.avg_rating || course.reviews_avg_rating || 0).toFixed(1) }}</span>
      </div>
    </div>

    <!-- Floating Udemy-style Details Popover -->
    <div 
      v-if="hovered" 
      :class="[
        'absolute top-0 w-80 bg-white border border-[#d1d7dc] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08),_0_1px_4px_rgba(0,0,0,0.08)] z-[999] transition-all duration-200 pointer-events-auto text-[#2d2f31] rounded-none',
        popoverPosition === 'right' ? 'left-full ml-4 animate-slide-right' : 'right-full mr-4 animate-slide-left'
      ]"
      @click.stop
    >
      <!-- Caret Arrow Pointer -->
      <div 
        :class="[
          'absolute w-3.5 h-3.5 bg-white border-[#d1d7dc] rotate-45 z-[-1]',
          popoverPosition === 'right' ? '-left-[8px] top-12 border-l border-b' : '-right-[8px] top-12 border-r border-t'
        ]"
      ></div>

      <!-- Popover Content -->
      <h4 class="font-bold text-[#2d2f31] text-[15px] leading-snug line-clamp-3">
        {{ course.title }}
      </h4>

      <p class="text-[11px] text-[#1c1d1f] font-semibold mt-1">
        By {{ course.instructor?.name || 'Instructor' }}
      </p>

      <div class="flex items-center gap-1.5 text-[10px] text-[#6a6f73] mt-1.5 font-medium">
        <span class="text-yellow-600 font-extrabold">★ {{ Number(course.avg_rating || course.reviews_avg_rating || 0).toFixed(1) }}</span>
        <span>•</span>
        <span>{{ course.duration || 'Self-paced' }}</span>
        <span>•</span>
        <span>All Levels</span>
      </div>

      <p class="text-xs text-[#2d2f31] mt-3 line-clamp-4 font-normal leading-relaxed">
        {{ course.description || 'No description available for this course.' }}
      </p>

      <!-- Action Row -->
      <div class="pt-3 mt-4 border-t border-[#d1d7dc] flex items-center">
        <button 
          @click.stop="handleEnroll"
          class="w-full bg-[#1c1d1f] hover:bg-[#2d2f31] text-white font-bold py-3 px-4 text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>{{ course.is_enrolled ? 'Go to Course' : (course.is_free ? 'Enroll Now' : 'Add to Cart') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .course-inner:hover .relative {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .animate-slide-right {
    animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .animate-slide-left {
    animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(-10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideLeft {
    from {
      opacity: 0;
      transform: translateX(10px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
</style>