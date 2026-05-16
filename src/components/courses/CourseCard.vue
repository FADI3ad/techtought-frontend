<script setup>
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
  <div @click="goToDetails" class="course-inner cursor-pointer flex flex-col h-full group">
    
    <div
      class="relative aspect-video overflow-hidden rounded-xl mb-4 shadow-sm transition-shadow duration-300 bg-gray-100">
      <img
        :src="course.image_path || course.image"
        alt="Course Thumbnail"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]" />
      
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
        <button 
          @click.stop="handleEnroll"
          class="bg-white text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
        >
          {{ course.is_enrolled ? 'Go to Course' : (course.is_free ? 'Enroll Now' : 'View Details') }}
        </button>
      </div>
    </div>

    <h3 class="font-bold leading-snug mb-2 transition-colors duration-300 group-hover:text-[#4f46e5] line-clamp-2 min-h-[2.8rem]">
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

    <div class="flex items-center justify-between border-t pt-3 mt-auto">
      <span class="text-sm font-medium text-gray-700">{{ course.instructor?.name || 'Instructor' }}</span>
      <div class="flex items-center gap-1">
        <span class="text-yellow-400 text-xs">★</span>
        <span class="text-xs font-bold text-gray-900">{{ Number(course.avg_rating || course.reviews_avg_rating || 0).toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* استخدمنا class "group" في التيلويند بدلاً من CSS التقليدي 
     لأنه أنظف، لكن تركت لك الـ scoped إذا كنت تفضله 
  */
  .course-inner:hover .relative {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>