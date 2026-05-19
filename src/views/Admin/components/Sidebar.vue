<script setup>
  const props = defineProps({
    adminName: String,
    instructorRequestsCount: Number,
    unreadContactsCount: Number
  });

  const emit = defineEmits(['logout']);
</script>

<template>
  <aside class="w-[260px] bg-white border-r border-gray-200/60 flex flex-col justify-between hidden md:flex shrink-0 z-20">
    <div>
      <div class="h-16 flex items-center px-6 border-b border-gray-100/50 mb-4">
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm shadow-primary-600/20 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <span class="text-[17px] font-bold tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">TechTought</span>
        </router-link>
      </div>

      <nav class="px-3 space-y-1">
        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">Overview</p>
        <router-link to="/admin/dashboard" exact-active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </router-link>
        
        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">Content</p>
        <router-link to="/admin/dashboard/categories" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          Categories
        </router-link>
        <router-link to="/admin/dashboard/subcategories" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Subcategories
        </router-link>
        <router-link to="/admin/dashboard/courses" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Course Management
        </router-link>

        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">People</p>
        <router-link to="/admin/dashboard/users" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          Users Management
        </router-link>
        <router-link to="/admin/dashboard/instructors" active-class="active" class="sidebar-item flex justify-between">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Instructors
          </div>
          <span v-if="instructorRequestsCount" class="bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-[10px] font-bold">{{ instructorRequestsCount }}</span>
        </router-link>
        <router-link to="/admin/dashboard/testimonials" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          Testimonials
        </router-link>

        <p class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-6">System</p>
        <router-link to="/admin/dashboard/contacts" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Contact Messages
          <span v-if="unreadContactsCount > 0" class="ml-auto bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
             {{ unreadContactsCount }}
          </span>
        </router-link>
        <router-link to="/admin/dashboard/subscriptions" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          Newsletter Subscribers
        </router-link>
        <router-link to="/admin/dashboard/settings" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          General Settings
        </router-link>
        <router-link to="/admin/dashboard/theme" active-class="active" class="sidebar-item">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
          Theme Settings
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
            <p class="text-sm font-semibold text-gray-900 truncate">{{ adminName }}</p>
            <p class="text-[11px] text-gray-500 font-medium">Administrator</p>
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
    @apply flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-gray-500 rounded-xl transition-all hover:bg-gray-50 hover:text-primary-600;
  }
  .sidebar-item.active {
    @apply bg-primary-50 text-primary-600;
  }
</style>
