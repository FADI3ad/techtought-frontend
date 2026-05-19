<script setup>
  import { reactive, ref, inject } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const categories = inject('categories');
  const loading = inject('categoriesLoading');
  const refreshCategories = inject('refreshCategories');

  const categorySubmitting = ref(false);
  const categoryError = ref("");
  const categoryMessage = ref("");
  const imagePreview = ref("");

  const categoryForm = reactive({
    id: null,
    name: "",
    description: "",
    imageFile: null,
    existingImage: "",
    originalSlug: "",
  });

  function clearCategoryForm() {
    categoryForm.id = null;
    categoryForm.name = "";
    categoryForm.description = "";
    categoryForm.imageFile = null;
    categoryForm.existingImage = "";
    categoryForm.originalSlug = "";
    imagePreview.value = "";
    const fileInput = document.getElementById('categoryImage');
    if (fileInput) fileInput.value = '';
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      categoryForm.imageFile = file;
      imagePreview.value = URL.createObjectURL(file);
    }
  }

  async function saveCategory() {
    if (!categoryForm.name.trim()) {
      categoryError.value = "Category name is required.";
      return;
    }

    categorySubmitting.value = true;
    categoryError.value = "";
    categoryMessage.value = "";

    const formData = new FormData();
    formData.append("name", categoryForm.name);
    if (categoryForm.description) {
      formData.append("description", categoryForm.description);
    }
    
    if (categoryForm.imageFile) {
      formData.append("image_path", categoryForm.imageFile);
    }

    try {
      if (categoryForm.originalSlug) {
        formData.append("_method", "PUT");
        await api.post(`/admin/categories/${categoryForm.originalSlug}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        categoryMessage.value = "Category updated successfully.";
      } else {
        await api.post("/admin/categories", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        categoryMessage.value = "Category created successfully.";
      }
      clearCategoryForm();
      refreshCategories();
    } catch (error) {
      categoryError.value = error?.response?.data?.message || "Failed to save category.";
    } finally {
      categorySubmitting.value = false;
    }
  }

  function editCategory(category) {
    categoryForm.id = category.id || null;
    categoryForm.name = category.name || "";
    categoryForm.originalSlug = category.slug || "";
    categoryForm.description = category.description || "";
    categoryForm.existingImage = category.image || "";
    categoryForm.imageFile = null;
    imagePreview.value = "";
  }

  async function removeCategory(category) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete category '${category.name}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/categories/${category.slug}`);
      refreshCategories();
      Swal.fire('Deleted!', 'Category has been removed.', 'success');
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message || "Failed to delete category.", 'error');
    }
  }

  function startNewCategory() {
    clearCategoryForm();
    categoryError.value = "";
    categoryMessage.value = "";
  }
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
    <!-- List Column -->
    <div class="xl:col-span-2 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h2 class="text-base font-bold text-gray-900">Categories</h2>
          <p class="text-xs text-gray-500 font-medium">Manage top-level core pillars</p>
        </div>
        <button @click="startNewCategory" class="btn-primary text-sm py-1.5 px-3">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Category
        </button>
      </div>

      <div v-if="categoryError || categoryMessage" class="flex flex-col gap-2 mb-4">
        <div v-if="categoryError" class="px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ categoryError }}
        </div>
        <div v-if="categoryMessage" class="px-4 py-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100 flex items-start gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ categoryMessage }}
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-64 bg-white/50 rounded-3xl border border-gray-100">
        <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="text-sm font-semibold text-gray-500 mt-4">Syncing categories...</p>
      </div>

      <div v-else class="saas-card !p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/80 border-b border-gray-100">
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identifier (Slug)</th>
                <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/80">
              <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                      <img v-if="cat.image" :src="cat.image" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                    </div>
                    <span class="font-bold text-gray-900">{{ cat.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">{{ cat.slug }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editCategory(cat)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button @click="removeCategory(cat)" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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

    <!-- Form Column -->
    <div class="space-y-6">
      <div class="saas-card sticky top-24">
        <h3 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          {{ categoryForm.originalSlug ? 'Edit Category' : 'Create New Category' }}
        </h3>
        
        <form @submit.prevent="saveCategory" class="space-y-5">
          <div>
            <label class="form-label">Category Name</label>
            <input v-model="categoryForm.name" type="text" class="form-input" placeholder="e.g. Web Development" required />
          </div>
          <div>
            <label class="form-label">Description (Optional)</label>
            <textarea v-model="categoryForm.description" rows="3" class="form-input resize-none" placeholder="Brief overview of this field..."></textarea>
          </div>
          <div>
            <label class="form-label">Cover Image</label>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                <img v-if="categoryForm.existingImage || imagePreview" :src="imagePreview || categoryForm.existingImage" class="w-full h-full object-cover" />
                <svg v-else class="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <label class="btn-secondary text-xs px-3 py-2 cursor-pointer">
                Choose Image
                <input type="file" id="categoryImage" class="hidden" @change="handleImageChange" accept="image/*" />
              </label>
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <button type="submit" :disabled="categorySubmitting" class="btn-primary flex-grow">
              {{ categorySubmitting ? 'Processing...' : (categoryForm.originalSlug ? 'Update Category' : 'Create Category') }}
            </button>
            <button v-if="categoryForm.originalSlug" type="button" @click="startNewCategory" class="btn-secondary px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
