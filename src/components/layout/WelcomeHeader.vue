<script setup>
  import { useAuthStore } from "../../stores/useAuthStore";
  const authStore = useAuthStore();
</script>

<template>
  <header class="pt-24 pb-12 bg-gradient-to-b from-[#f8f8ff] to-white">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="flex items-center gap-6">
        <div class="relative">
          <img
            src="../../assets/images/user.png"
            alt="User"
            class="w-16 h-16 rounded-full object-cover" />
          <div
            class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h1
            class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Welcome back,
            <span class="text-indigo-600">{{ authStore.user?.name || 'Student' }}</span>
          </h1>
          <p class="text-gray-500 mt-1 font-medium">
            Ready to continue your learning journey?
          </p>
        </div>
      </div>
    </div>
  </header>
</template>
