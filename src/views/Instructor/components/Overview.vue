<script setup>
  import { ref, onMounted } from "vue";
  import api from "../../../services/axios";

  const stats = ref({
    courses_count: 0,
    students_count: 0,
    average_rating: 0
  });
  const recentComments = ref([]);
  const loading = ref(true);

  async function loadDashboardData() {
    loading.value = true;
    try {
      const response = await api.get("/instructor/dashboard");
      if (response.data?.data) {
        stats.value = response.data.data.stats || stats.value;
        recentComments.value = response.data.data.recent_comments || [];
      }
    } catch (error) {
      console.error("Failed to load instructor dashboard:", error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadDashboardData);
</script>

<template>
  <div class="animate-fade-in space-y-6">
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Courses Stat -->
        <div class="saas-card flex items-center gap-5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Courses</p>
            <h3 class="text-2xl font-extrabold text-gray-900 leading-none">{{ stats.courses_count }}</h3>
          </div>
        </div>

        <!-- Students Stat -->
        <div class="saas-card flex items-center gap-5">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Enrolled Students</p>
            <h3 class="text-2xl font-extrabold text-gray-900 leading-none">{{ stats.students_count }}</h3>
          </div>
        </div>

        <!-- Rating Stat -->
        <div class="saas-card flex items-center gap-5">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Average Rating</p>
            <h3 class="text-2xl font-extrabold text-gray-900 leading-none">{{ parseFloat(stats.average_rating).toFixed(1) }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Comments -->
      <div class="saas-card mt-8 p-0 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h2 class="text-base font-bold text-gray-900">Recent Comments</h2>
        </div>
        
        <div v-if="recentComments.length === 0" class="p-8 text-center">
          <p class="text-sm text-gray-500">No recent comments found.</p>
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div v-for="comment in recentComments" :key="comment.id" class="p-6 hover:bg-gray-50/50 transition-colors">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="comment.user?.image_path" :src="comment.user.image_path" class="w-full h-full object-cover"/>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-4 mb-1">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ comment.user?.name || 'Unknown' }}</h4>
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                </div>
                <p class="text-xs text-[var(--color-primary)] font-medium mb-2 truncate">Course: {{ comment.course?.title || 'Unknown Course' }}</p>
                <p class="text-sm text-gray-600 leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
