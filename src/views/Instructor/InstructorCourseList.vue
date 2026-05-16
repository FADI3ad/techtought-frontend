<script setup>
  import { onMounted, ref } from "vue";
  import api from "../../services/axios";

  const courses = ref([]);
  const loading = ref(true);

  async function loadCourses() {
    loading.value = true;
    try {
      const response = await api.get("/instructor/my-courses");
      courses.value = response.data.data.courses;
    } catch (error) {
      console.error("Failed to load instructor courses:", error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteCourse(slug) {
    if (!window.confirm("Are you sure you want to delete this course? This action is permanent.")) return;
    try {
      await api.delete(`/instructor/courses/${slug}`);
      await loadCourses();
    } catch (error) {
      alert("Failed to delete course.");
    }
  }

  onMounted(loadCourses);
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] py-10">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-3xl font-black text-gray-900">My Courses</h1>
          <p class="text-gray-500 font-medium">Manage and monitor all your published content.</p>
        </div>
        <router-link :to="{ name: 'create-course' }" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
          + Add New Course
        </router-link>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-80 bg-white animate-pulse rounded-3xl border border-gray-100"></div>
      </div>

      <div v-else-if="courses.length === 0" class="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
        <h2 class="text-xl font-bold text-gray-400 mb-2">No courses found</h2>
        <p class="text-gray-500 mb-6">You haven't started any courses yet. Share your expertise today!</p>
        <router-link :to="{ name: 'create-course' }" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">
          Create Your First Course
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="course in courses" :key="course.id" class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
          <!-- Image -->
          <div class="relative aspect-video overflow-hidden bg-gray-100">
            <img :src="course.image_path || 'https://placehold.co/600x400?text=Course+Image'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {{ course.lang }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-grow">
            <h3 class="text-lg font-black text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
              {{ course.title }}
            </h3>
            
            <div class="grid grid-cols-3 gap-2 mb-6">
              <div class="text-center p-2 bg-gray-50 rounded-xl">
                <p class="text-[10px] font-bold text-gray-400 uppercase">Sections</p>
                <p class="text-sm font-black text-gray-700">{{ course.sections_count }}</p>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded-xl">
                <p class="text-[10px] font-bold text-gray-400 uppercase">Rating</p>
                <p class="text-sm font-black text-gray-700">{{ Number(course.reviews_avg_rating || 0).toFixed(1) }}⭐</p>
              </div>
              <div class="text-center p-2 bg-gray-50 rounded-xl">
                <p class="text-[10px] font-bold text-gray-400 uppercase">Comments</p>
                <p class="text-sm font-black text-gray-700">{{ course.comments_count }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 pt-4 border-t border-gray-50">
              <router-link :to="{ name: 'instructor-course-content', params: { slug: course.slug } }" class="flex-grow py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm text-center hover:bg-gray-200 transition-colors">
                Content
              </router-link>
              <button @click="deleteCourse(course.slug)" class="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
