<script setup>
  import { computed, onMounted, ref, provide } from "vue";
  import api from "../../services/axios";
  import { useAuthStore } from "../../stores/useAuthStore";
  import { useRouter, useRoute } from "vue-router";

  // Components
  import Sidebar from "./components/Sidebar.vue";

  const auth = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  const adminName = computed(() => auth.user?.name || "Admin");
  const currentTabName = computed(() => {
    const name = route.name || "";
    return name.toString().replace("admin-", "").replace("-", " ") || "Dashboard";
  });

  // Shared state for counts and quick access
  const categories = ref([]);
  const categoriesLoading = ref(false);
  const instructorRequestsCount = ref(0);
  const unreadContactsCount = ref(0);
  const activeCategorySlug = ref("");

  // Provide state to child routes
  provide('categories', categories);
  provide('categoriesLoading', categoriesLoading);
  provide('instructorRequestsCount', instructorRequestsCount);
  provide('unreadContactsCount', unreadContactsCount);
  provide('activeCategorySlug', activeCategorySlug);
  provide('refreshCategories', loadCategories);
  provide('updateInstructorCount', updateInstructorCount);
  provide('updateContactCount', updateContactCount);

  const logout = async () => {
    try {
      if (auth.user?.token) await api.post("/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      auth.logout();
      router.push("/");
    }
  };

  async function loadCategories() {
    categoriesLoading.value = true;
    try {
      const response = await api.get("/categories");
      categories.value = response?.data?.data?.categories || response?.data?.categories || [];
      if (!activeCategorySlug.value && categories.value.length) {
        activeCategorySlug.value = categories.value[0].slug;
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      categoriesLoading.value = false;
    }
  }

  async function updateInstructorCount() {
    try {
      const response = await api.get("/admin/instructor-requests");
      instructorRequestsCount.value = response?.data?.data?.requests?.data?.length || 0;
    } catch (err) {}
  }

  async function updateContactCount() {
    try {
      const response = await api.get("/admin/contacts");
      const msgs = response?.data?.data?.data || [];
      unreadContactsCount.value = msgs.filter(m => !m.is_read).length;
    } catch (err) {}
  }

  onMounted(async () => {
    await loadCategories();
    updateInstructorCount();
    updateContactCount();
  });
</script>

<template>
  <div class="flex h-screen bg-[#FAFAFA] font-sans text-gray-900 overflow-hidden antialiased selection:bg-primary-100 selection:text-primary-900">
    <!-- SIDEBAR -->
    <Sidebar 
      :adminName="adminName" 
      :instructorRequestsCount="instructorRequestsCount"
      :unreadContactsCount="unreadContactsCount"
      @logout="logout"
    />

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- HEADER -->
      <header class="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <button class="md:hidden text-gray-500 hover:text-gray-900">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="flex flex-col">
            <h1 class="text-lg font-bold text-gray-900 capitalize tracking-tight leading-none">{{ currentTabName }}</h1>
            <p class="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-widest">Workspace Area</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block">
            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search..." class="pl-9 pr-4 py-2 bg-gray-100/80 border border-transparent hover:border-gray-200 focus:border-primary-500 focus:bg-white rounded-xl text-sm outline-none transition-all w-64 text-gray-700 placeholder-gray-400 font-medium" />
          </div>
          <button class="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <!-- SCROLLABLE CONTENT -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar pb-24">
        <div class="max-w-6xl mx-auto space-y-8">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
  }

  .saas-card {
    @apply bg-white border border-gray-200/60 p-6 rounded-[2rem] shadow-sm;
  }

  .btn-primary {
    @apply bg-primary-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center;
  }

  .btn-secondary {
    @apply bg-white text-gray-700 border border-gray-200 font-bold py-2.5 px-5 rounded-xl transition-all hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center;
  }

  .form-label {
    @apply block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1;
  }

  .form-input {
    @apply w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-primary-500 placeholder:text-gray-300;
  }

  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-slide-right {
    animation: slideRight 0.3s ease-out;
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-left {
    animation: slideLeft 0.3s ease-out;
  }
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }
</style>
