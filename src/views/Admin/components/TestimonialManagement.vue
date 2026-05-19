<script setup>
  import { ref, onMounted } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const testimonials = ref([]);
  const loading = ref(false);
  const error = ref("");

  async function loadTestimonials() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/admin/testimonials");
      testimonials.value = response?.data?.data?.testimonials || [];
    } catch (err) {
      error.value = "Failed to load testimonials.";
    } finally {
      loading.value = false;
    }
  }

  async function toggleVisibility(testimonial) {
    try {
      await api.patch(`/admin/testimonials/${testimonial.id}/toggle`);
      await loadTestimonials();
      Swal.fire({
        title: 'Success',
        text: `Visibility toggled successfully.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      Swal.fire('Error', "Failed to toggle visibility.", 'error');
    }
  }

  async function removeTestimonial(testimonial) {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/testimonials/${testimonial.id}`);
      await loadTestimonials();
      Swal.fire('Deleted!', 'Testimonial has been removed.', 'success');
    } catch (err) {
      Swal.fire('Error', "Failed to delete testimonial.", 'error');
    }
  }

  onMounted(loadTestimonials);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Success Stories</h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">Moderate student testimonials and featured reviews.</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="saas-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Content</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Platform Status</th>
              <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr v-for="testi in testimonials" :key="testi.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-bold text-gray-900">{{ testi.user?.name || 'Anonymous' }}</span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-600 line-clamp-2 max-w-md">{{ testi.comment }}</p>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="testi.is_visible" class="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Live on Site</span>
                <span v-else class="px-2.5 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">Hidden</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleVisibility(testi)" class="p-2 rounded-lg transition-all" :class="testi.is_visible ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'">
                    <svg v-if="testi.is_visible" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <button @click="removeTestimonial(testi)" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
