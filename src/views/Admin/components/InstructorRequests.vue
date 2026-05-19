<script setup>
  import { ref, onMounted, inject } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const requests = ref([]);
  const loading = ref(false);
  const error = ref("");

  const updateInstructorCount = inject('updateInstructorCount');

  async function loadRequests() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/admin/instructor-requests");
      requests.value = response?.data?.data?.requests?.data || [];
      updateInstructorCount();
    } catch (err) {
      error.value = "Failed to load instructor requests.";
    } finally {
      loading.value = false;
    }
  }

  async function approveRequest(id) {
    const result = await Swal.fire({
      title: 'Approve Request?',
      text: "Are you sure you want to approve this instructor request?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, approve'
    });
    if (!result.isConfirmed) return;

    try {
      const response = await api.post(`/admin/instructor-requests/${id}/approve`);
      const password = response?.data?.data?.generated_password;
      await Swal.fire({
        title: 'Success!',
        html: `Auto-generated password for the instructor: <br><b class="text-primary-600 tracking-wider text-lg mt-2 inline-block">${password}</b>`,
        icon: 'success'
      });
      await loadRequests();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || "Failed to approve request.", 'error');
    }
  }

  async function rejectRequest(id) {
    const { value: reason, isDismissed } = await Swal.fire({
      title: 'Reject Request',
      input: 'text',
      inputLabel: 'Reason for rejection',
      inputValue: 'Your application does not meet our current requirements.',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      inputValidator: (value) => {
        if (!value) return 'You need to write something!'
      }
    });
    if (isDismissed) return;

    try {
      await api.delete(`/admin/instructor-requests/${id}`, { data: { reason } });
      Swal.fire('Rejected!', 'The request has been rejected.', 'success');
      await loadRequests();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || "Failed to reject request.", 'error');
    }
  }

  onMounted(loadRequests);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Instructor Applications</h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">Review and approve applications from industry experts.</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="requests.length === 0" class="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
      <p class="text-gray-500 font-bold text-sm">No pending applications at the moment.</p>
    </div>

    <div v-else class="saas-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expertise</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">CV / Portfolio</th>
              <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decisions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr v-for="req in requests" :key="req.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900">{{ req.name }}</span>
                  <span class="text-xs text-gray-400 font-medium">{{ req.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase">{{ req.specialization }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <router-link :to="`/admin/instructor-requests/${req.slug}`" class="text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block">
                  View Full Profile
                </router-link>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="approveRequest(req.id)" class="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all">Approve</button>
                  <button @click="rejectRequest(req.id)" class="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Reject</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
