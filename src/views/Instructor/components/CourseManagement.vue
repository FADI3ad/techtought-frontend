<script setup>
  import { ref, onMounted } from "vue";
  import api from "../../../services/axios";

  const courses = ref([]);
  const loading = ref(true);

  async function loadCourses() {
    loading.value = true;
    try {
      const response = await api.get("/instructor/my-courses");
      courses.value = response.data?.data?.courses || response.data?.data || [];
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      loading.value = false;
    }
  }

  async function deleteCourse(slug) {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/instructor/courses/${slug}`);
      courses.value = courses.value.filter(c => c.slug !== slug);
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete the course.");
    }
  }

  onMounted(loadCourses);
</script>

<template>
  <div class="animate-fade-in space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Course Management</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your courses, pricing, and curriculum.</p>
      </div>
      <router-link to="/instructor/dashboard/courses/create" class="btn-primary gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        Create New Course
      </router-link>
    </div>

    <div class="saas-card p-0 overflow-hidden">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="courses.length === 0" class="text-center py-20 px-6">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">No courses found</h3>
        <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">You haven't created any courses yet. Start building your curriculum today!</p>
        <router-link to="/instructor/dashboard/courses/create" class="text-[var(--color-primary)] font-bold hover:underline">Create your first course &rarr;</router-link>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Course</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Students</th>
              <th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                    <img v-if="course.image_path" :src="course.image_path" class="w-full h-full object-cover"/>
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{{ course.title }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ course.category?.name || 'Uncategorized' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="course.is_free" class="inline-flex px-2 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg uppercase tracking-widest">Free</span>
                <span v-else class="text-sm font-bold text-gray-900">${{ course.price }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-600">{{ course.students_count || 0 }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="`/instructor/dashboard/courses/${course.slug}/edit`" class="p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-colors" title="Edit Course Details">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </router-link>
                  <router-link :to="`/instructor/dashboard/courses/${course.slug}/curriculum`" class="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors" title="Manage Curriculum (Sections & Lessons)">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  </router-link>
                  <button @click="deleteCourse(course.slug)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Course">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
