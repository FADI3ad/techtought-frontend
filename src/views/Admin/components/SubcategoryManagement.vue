<script setup>
  import { reactive, ref, onMounted, watch, inject } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const categories = inject('categories');
  const activeCategorySlug = inject('activeCategorySlug');

  const subcategories = ref([]);
  const loading = ref(false);
  const submitting = ref(false);
  const error = ref("");
  const message = ref("");

  const subcategoryForm = reactive({
    id: null,
    name: "",
    description: "",
    categorySlug: "",
    originalSlug: "",
  });

  function clearForm() {
    subcategoryForm.id = null;
    subcategoryForm.name = "";
    subcategoryForm.description = "";
    subcategoryForm.categorySlug = activeCategorySlug.value || "";
    subcategoryForm.originalSlug = "";
  }

  function normalizeSubcategories(response) {
    return (
      response?.data?.data?.category?.subcategories ||
      response?.data?.data?.subcategories ||
      response?.data?.subcategories ||
      []
    );
  }

  async function loadSubcategories(slug) {
    if (!slug) {
      subcategories.value = [];
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get(`categories/${slug}/subcategories`);
      subcategories.value = normalizeSubcategories(response);
    } catch (err) {
      error.value = "Failed to load subcategories.";
      subcategories.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function saveSubcategory() {
    if (!subcategoryForm.name.trim()) {
      error.value = "Subcategory name is required.";
      return;
    }
    if (!subcategoryForm.categorySlug) {
      error.value = "Select a parent category first.";
      return;
    }

    submitting.value = true;
    error.value = "";
    message.value = "";

    const parent = categories.value.find((item) => item.slug === subcategoryForm.categorySlug);
    const payload = {
      name: subcategoryForm.name,
      category_id: parent?.id || null,
    };

    try {
      if (subcategoryForm.originalSlug) {
        await api.put(`/admin/subcategories/${subcategoryForm.originalSlug}`, payload);
        message.value = "Subcategory updated successfully.";
      } else {
        await api.post("/admin/subcategories", payload);
        message.value = "Subcategory created successfully.";
      }
      clearForm();
      await loadSubcategories(activeCategorySlug.value);
    } catch (err) {
      error.value = err?.response?.data?.message || "Failed to save subcategory.";
    } finally {
      submitting.value = false;
    }
  }

  function editSubcategory(sub) {
    subcategoryForm.id = sub.id || null;
    subcategoryForm.name = sub.name || "";
    subcategoryForm.originalSlug = sub.slug || "";
    subcategoryForm.description = sub.description || "";
    subcategoryForm.categorySlug = activeCategorySlug.value || "";
    error.value = "";
    message.value = "";
  }

  async function removeSubcategory(sub) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete subcategory '${sub.name}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/subcategories/${sub.slug}`);
      await loadSubcategories(activeCategorySlug.value);
      Swal.fire('Deleted!', 'Subcategory has been removed.', 'success');
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || "Failed to delete subcategory.", 'error');
    }
  }

  watch(activeCategorySlug, (newSlug) => {
    loadSubcategories(newSlug);
    subcategoryForm.categorySlug = newSlug;
  }, { immediate: true });

  onMounted(() => {
    if (activeCategorySlug.value) {
      loadSubcategories(activeCategorySlug.value);
    }
  });
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
    <div class="xl:col-span-2 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 class="text-base font-bold text-gray-900">Subcategories Management</h2>
          <p class="text-xs text-gray-500 font-medium">Define branches for each core category</p>
        </div>
        <div class="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200">
          <button v-for="cat in categories" :key="cat.slug" @click="activeCategorySlug = cat.slug" 
            :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', activeCategorySlug === cat.slug ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
            {{ cat.name }}
          </button>
        </div>
      </div>

      <div v-if="error || message" class="flex flex-col gap-2 mb-4">
        <div v-if="error" class="px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error }}
        </div>
        <div v-if="message" class="px-4 py-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100 flex items-start gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ message }}
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-64 bg-white/50 rounded-3xl border border-gray-100">
        <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-gray-500 mt-4">Filtering branches...</p>
      </div>

      <div v-else-if="subcategories.length === 0" class="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
        <p class="text-gray-500 font-bold text-sm">No subcategories found in this category.</p>
        <button @click="subcategoryForm.categorySlug = activeCategorySlug" class="mt-4 text-primary-600 font-bold text-xs hover:underline">Add First Subcategory</button>
      </div>

      <div v-else class="saas-card !p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100">
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subcategory</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identifier (Slug)</th>
                <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/80">
              <tr v-for="sub in subcategories" :key="sub.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <span class="font-bold text-gray-900">{{ sub.name }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{{ sub.slug }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editSubcategory(sub)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="removeSubcategory(sub)" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="saas-card sticky top-24">
        <h3 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          {{ subcategoryForm.originalSlug ? 'Edit Subcategory' : 'New Subcategory' }}
        </h3>
        
        <form @submit.prevent="saveSubcategory" class="space-y-5">
          <div>
            <label class="form-label">Parent Category</label>
            <select v-model="subcategoryForm.categorySlug" class="form-input">
              <option value="" disabled>Select parent...</option>
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="form-label">Subcategory Name</label>
            <input v-model="subcategoryForm.name" type="text" class="form-input" placeholder="e.g. Backend Development" required />
          </div>

          <div class="pt-2 flex gap-3">
            <button type="submit" :disabled="submitting" class="btn-primary flex-grow">
              {{ submitting ? 'Saving...' : (subcategoryForm.originalSlug ? 'Update' : 'Create') }}
            </button>
            <button v-if="subcategoryForm.originalSlug" type="button" @click="clearForm" class="btn-secondary px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
