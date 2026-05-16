<script setup>
  import { onMounted, ref } from "vue";
  import api from "../../services/axios";
  import { useAuthStore } from "../../stores/useAuthStore";

  const auth = useAuthStore();
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
      stats.value = response.data.data.stats;
      recentComments.value = response.data.data.recent_comments;
    } catch (error) {
      console.error("Failed to load instructor dashboard:", error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadDashboardData);
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10 py-10">
      
      <!-- Header -->
      <header class="mb-10">
        <h1 class="text-3xl font-black text-gray-900 mb-2">Instructor Dashboard</h1>
        <p class="text-gray-500 font-medium">Welcome back, {{ auth.user?.name }}! Here's what's happening with your courses.</p>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📚</div>
          <div>
            <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Courses</p>
            <h3 class="text-3xl font-black text-gray-900">{{ stats.courses_count }}</h3>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">👥</div>
          <div>
            <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Students</p>
            <h3 class="text-3xl font-black text-gray-900">{{ stats.students_count }}</h3>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">⭐</div>
          <div>
            <p class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Avg Rating</p>
            <h3 class="text-3xl font-black text-gray-900">{{ stats.average_rating }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Quick Actions & Courses -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-indigo-600 rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-indigo-200">
            <div>
              <h2 class="text-2xl font-black mb-2">Ready to share your knowledge?</h2>
              <p class="text-indigo-100 font-medium">Create a new course and reach thousands of students.</p>
            </div>
            <router-link :to="{ name: 'create-course' }" class="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              + New Course
            </router-link>
          </div>

          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-black text-gray-900">Your Active Courses</h2>
              <router-link :to="{ name: 'instructor-courses' }" class="text-sm font-bold text-indigo-600 hover:underline">View All</router-link>
            </div>
            
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="i in 2" :key="i" class="h-40 bg-gray-100 animate-pulse rounded-3xl"></div>
            </div>
            <div v-else-if="stats.courses_count === 0" class="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p class="text-gray-400 font-bold mb-4">You haven't created any courses yet.</p>
              <router-link :to="{ name: 'create-course' }" class="text-indigo-600 font-black">Start your first course →</router-link>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Course cards will be rendered here -->
              <p class="text-gray-400 italic">Course cards list coming soon...</p>
            </div>
          </section>
        </div>

        <!-- Sidebar: Recent Comments -->
        <aside>
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-xl font-black text-gray-900 mb-6">Recent Interaction</h2>
            
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 animate-pulse rounded-2xl"></div>
            </div>
            <div v-else-if="recentComments.length === 0" class="text-center py-10">
              <p class="text-gray-400 font-medium text-sm">No recent comments found.</p>
            </div>
            <div v-else class="space-y-6">
              <div v-for="comment in recentComments" :key="comment.id" class="group cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                    {{ comment.user?.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">{{ comment.user?.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">on {{ comment.course?.title }}</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed bg-gray-50 p-3 rounded-xl group-hover:bg-gray-100 transition-colors">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  </div>
</template>
