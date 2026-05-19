<script setup>
  const props = defineProps({
    instructorName: String,
  });
  const emit = defineEmits(['logout']);
</script>

<template>
  <aside class="w-[260px] bg-white border-r border-gray-200/60 flex flex-col justify-between hidden md:flex shrink-0 z-20">
    <div>
      <div class="h-16 flex items-center px-6 border-b border-gray-100/50 mb-4">
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span class="text-[17px] font-bold tracking-tight text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">TechTought</span>
        </router-link>
      </div>

      <nav class="px-3 space-y-1">
        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Overview</p>
        <router-link to="/instructor/dashboard" exact-active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </router-link>
        
        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">Content</p>
        <router-link to="/instructor/dashboard/courses" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          My Courses
        </router-link>
        <router-link to="/instructor/dashboard/reviews" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          Reviews & Comments
        </router-link>
      </nav>
    </div>

    <div class="p-4 border-t border-gray-100/50">
      <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img src="../../../assets/images/user.png" class="w-full h-full object-cover" />
          </div>
          <div class="truncate">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ instructorName }}</p>
            <p class="text-[11px] text-gray-500 font-medium">Instructor</p>
          </div>
        </div>
        <button @click="$emit('logout')" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
  .sidebar-item {
    @apply flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-gray-500 rounded-xl transition-all hover:bg-gray-50 hover:text-[var(--color-primary)];
  }
  .sidebar-item.active {
    background-color: color-mix(in srgb, var(--color-primary) 10%, white);
    color: var(--color-primary);
  }
</style>
