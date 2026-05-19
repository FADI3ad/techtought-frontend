<script setup>
  import { inject } from "vue";
  const categories = inject('categories', []);
  const instructorRequestsCount = inject('instructorRequestsCount', 0);
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Stat Card 1 -->
      <router-link to="/admin/dashboard/categories" class="saas-card group cursor-pointer hover:border-primary-200 hover:shadow-md block">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            12%
          </span>
        </div>
        <div>
          <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ categories.length }}</h3>
          <p class="text-sm text-gray-500 font-medium mt-1">Total Categories</p>
        </div>
      </router-link>

      <!-- Stat Card 2 -->
      <router-link to="/admin/dashboard/subcategories" class="saas-card group cursor-pointer hover:border-primary-200 hover:shadow-md block">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-bold text-gray-900 tracking-tight">0</h3>
          <p class="text-sm text-gray-500 font-medium mt-1">Active Branches</p>
        </div>
      </router-link>

      <!-- Stat Card 3 -->
      <router-link to="/admin/dashboard/instructors" class="saas-card group cursor-pointer hover:border-amber-200 hover:shadow-md relative overflow-hidden block">
        <div class="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
        <div class="flex items-center justify-between mb-4 relative">
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <span v-if="instructorRequestsCount > 0" class="text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Action Req
          </span>
        </div>
        <div class="relative">
          <h3 class="text-3xl font-bold text-gray-900 tracking-tight">{{ instructorRequestsCount }}</h3>
          <p class="text-sm text-gray-500 font-medium mt-1">Pending Requests</p>
        </div>
      </router-link>

      <!-- Empty Placeholder Card -->
      <div class="saas-card flex flex-col items-center justify-center border-dashed border-2 border-gray-200 bg-gray-50/50 min-h-[140px]">
        <svg class="w-6 h-6 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span class="text-xs font-semibold text-gray-400">Add Metric Widget</span>
      </div>
    </div>

    <!-- Activity / Chart placeholder -->
    <div class="saas-card min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-gray-200 bg-transparent">
       <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
       <h4 class="text-sm font-semibold text-gray-900">Analytics Dashboard</h4>
       <p class="text-xs text-gray-500 mt-1">Platform analytics and revenue charts will appear here.</p>
    </div>
  </div>
</template>
