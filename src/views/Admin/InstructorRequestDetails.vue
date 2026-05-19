<script setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "../../services/axios";

  const route = useRoute();
  const router = useRouter();
  const request = ref(null);
  const loading = ref(true);
  const error = ref("");

  const storageUrl = "http://localhost:8000/storage/";

  async function loadRequest() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get(`/admin/instructor-requests/${route.params.slug}`);
      request.value = response.data.data.request;
    } catch (err) {
      error.value = "Failed to load request details.";
    } finally {
      loading.value = false;
    }
  }

  async function approveRequest() {
    if (!window.confirm("Approve this instructor?")) return;
    try {
      const response = await api.post(`/admin/instructor-requests/${request.value.id}/approve`);
      const password = response.data.data.generated_password;
      window.alert(`Success! Generated password: ${password}`);
      router.push({ name: "admin-dashboard" });
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed.");
    }
  }

  async function rejectRequest() {
    const reason = window.prompt("Reason for rejection?", "Your application does not meet our current requirements.");
    if (reason === null) return; // User cancelled

    try {
      await api.delete(`/admin/instructor-requests/${request.value.id}`, { data: { reason } });
      router.push({ name: "admin-dashboard" });
    } catch (err) {
      alert("Rejection failed.");
    }
  }

  onMounted(loadRequest);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-6 flex items-center justify-between">
        <button 
          @click="router.back()" 
          class="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <div v-if="request" class="flex gap-3">
          <button 
            v-if="request.status === 'pending'"
            @click="approveRequest" 
            class="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Approve Instructor
          </button>
          <button 
            @click="rejectRequest" 
            class="px-5 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors"
          >
            Reject Request
          </button>
        </div>
      </div>

      <div v-if="loading" class="bg-white rounded-3xl p-20 text-center shadow-sm">
        <p class="text-gray-400 font-medium">Loading application details...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-3xl p-20 text-center shadow-sm">
        <p class="text-rose-500 font-bold">{{ error }}</p>
      </div>

      <div v-else-if="request" class="space-y-6">
        <!-- Profile Header -->
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-400">
              {{ request.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-3xl font-black text-gray-900">{{ request.name }}</h1>
              <p class="text-gray-500 font-medium">{{ request.email }}</p>
            </div>
            <div class="ml-auto">
              <span 
                class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                :class="request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ request.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-lg font-black text-gray-900 mb-6">Personal Information</h2>
            <div class="space-y-4">
              <div class="flex justify-between border-b border-gray-50 pb-3">
                <span class="text-gray-500 font-bold">Country</span>
                <span class="text-gray-900 font-black">{{ request.country }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-50 pb-3">
                <span class="text-gray-500 font-bold">Phone</span>
                <span class="text-gray-900 font-black">{{ request.phone }}</span>
              </div>
              <div class="flex justify-between border-b border-gray-50 pb-3">
                <span class="text-gray-500 font-bold">Age</span>
                <span class="text-gray-900 font-black">{{ request.age }} Years</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 font-bold">Experience</span>
                <span class="text-gray-900 font-black">{{ request.experience_years }} Years</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-lg font-black text-gray-900 mb-6">Documents</h2>
            <div class="space-y-4">
              <a 
                :href="storageUrl + request.cv_link" 
                target="_blank"
                class="flex items-center justify-between p-4 bg-primary-50 rounded-2xl group hover:bg-primary-100 transition-colors"
              >
                <span class="text-primary-700 font-black">Curriculum Vitae (CV)</span>
                <span class="text-primary-500 group-hover:translate-x-1 transition-transform">Download →</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Identity Images -->
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 class="text-lg font-black text-gray-900 mb-6">National ID Verification</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-3">
              <p class="text-xs font-bold text-gray-500 uppercase">Front Image</p>
              <div class="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                <img :src="storageUrl + request.national_id_front_image" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="space-y-3">
              <p class="text-xs font-bold text-gray-500 uppercase">Back Image</p>
              <div class="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                <img :src="storageUrl + request.national_id_back_image" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
