<script setup>
  import { computed } from "vue";
  import { useAuthStore } from "../../stores/useAuthStore";
  import { useRouter, useRoute } from "vue-router";
  import api from "../../services/axios";

  import Sidebar from "./components/Sidebar.vue";

  const auth = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  const instructorName = computed(() => auth.user?.name || "Instructor");
  const currentTabName = computed(() => {
    const name = route.name || "";
    return name.toString().replace("instructor-", "").replace("-", " ") || "Dashboard";
  });

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
</script>

<template>
  <div class="flex h-screen bg-[#FAFAFA] font-sans text-gray-900 overflow-hidden antialiased">
    <Sidebar :instructorName="instructorName" @logout="logout" />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <header class="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <button class="md:hidden text-gray-500 hover:text-gray-900">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="flex flex-col">
            <h1 class="text-lg font-bold text-gray-900 capitalize tracking-tight leading-none">{{ currentTabName }}</h1>
            <p class="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-widest">Instructor Area</p>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar pb-24">
        <div class="max-w-6xl mx-auto space-y-8">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
  .saas-card {
    @apply bg-white border border-gray-200/60 p-6 rounded-[2rem] shadow-sm;
  }
  .btn-primary {
    @apply bg-[var(--color-primary)] text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center;
  }
  .btn-secondary {
    @apply bg-white text-gray-700 border border-gray-200 font-bold py-2.5 px-5 rounded-xl transition-all hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center;
  }
  .form-label {
    @apply block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1;
  }
  .form-input {
    @apply w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none transition-all focus:bg-white focus:border-[var(--color-primary)] placeholder:text-gray-300;
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
