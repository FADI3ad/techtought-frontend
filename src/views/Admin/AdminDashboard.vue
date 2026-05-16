<script setup>
  import { computed, onMounted, reactive, ref } from "vue";
  import api from "../../services/axios";
  import { useAuthStore } from "../../stores/useAuthStore";

  const auth = useAuthStore();
  const adminName = computed(() => auth.user?.name || "Admin");

  const categories = ref([]);
  const subcategories = ref([]);
  const activeCategorySlug = ref("");

  const categoriesLoading = ref(false);
  const subcategoriesLoading = ref(false);
  const categorySubmitting = ref(false);
  const subcategorySubmitting = ref(false);

  const categoryError = ref("");
  const subcategoryError = ref("");
  const categoryMessage = ref("");
  const subcategoryMessage = ref("");

  const instructorRequests = ref([]);
  const requestsLoading = ref(false);
  const requestsError = ref("");

  const categoryForm = reactive({
    id: null,
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const subcategoryForm = reactive({
    id: null,
    name: "",
    slug: "",
    description: "",
    categorySlug: "",
  });

  const selectedCategory = computed(() => {
    return categories.value.find((cat) => cat.slug === activeCategorySlug.value) || null;
  });

  function clearCategoryForm() {
    categoryForm.id = null;
    categoryForm.name = "";
    categoryForm.slug = "";
    categoryForm.description = "";
    categoryForm.image = "";
  }

  function clearSubcategoryForm() {
    subcategoryForm.id = null;
    subcategoryForm.name = "";
    subcategoryForm.slug = "";
    subcategoryForm.description = "";
    subcategoryForm.categorySlug = activeCategorySlug.value || "";
  }

  function normalizeCategories(response) {
    return response?.data?.data?.categories || response?.data?.categories || [];
  }

  function normalizeSubcategories(response) {
    return (
      response?.data?.data?.category?.subcategories ||
      response?.data?.data?.subcategories ||
      response?.data?.subcategories ||
      []
    );
  }

  async function tryRequests(requests) {
    let lastError = null;
    for (const request of requests) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  async function loadCategories() {
    categoriesLoading.value = true;
    categoryError.value = "";
    try {
      const response = await api.get("/categories");
      categories.value = normalizeCategories(response);

      if (!activeCategorySlug.value && categories.value.length) {
        activeCategorySlug.value = categories.value[0].slug;
      }

      if (activeCategorySlug.value) {
        await loadSubcategories(activeCategorySlug.value);
      }
    } catch (error) {
      categoryError.value = "Failed to load categories.";
      categories.value = [];
    } finally {
      categoriesLoading.value = false;
    }
  }

  async function loadSubcategories(slug) {
    if (!slug) {
      subcategories.value = [];
      return;
    }

    subcategoriesLoading.value = true;
    subcategoryError.value = "";
    try {
      const response = await api.get(`categories/${slug}/subcategories`);
      subcategories.value = normalizeSubcategories(response);
    } catch (error) {
      subcategoryError.value = "Failed to load subcategories.";
      subcategories.value = [];
    } finally {
      subcategoriesLoading.value = false;
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

    const payload = {
      name: categoryForm.name,
      description: categoryForm.description,
      image: categoryForm.image,
    };

    if (categoryForm.slug.trim()) payload.slug = categoryForm.slug;

    try {
      if (categoryForm.id || categoryForm.slug) {
        const identifier = categoryForm.id || categoryForm.slug;
        await tryRequests([
          () => api.put(`/categories/${identifier}`, payload),
          () => api.patch(`/categories/${identifier}`, payload),
          () => api.post(`/categories/${identifier}`, { ...payload, _method: "PUT" }),
        ]);
        categoryMessage.value = "Category updated successfully.";
      } else {
        await tryRequests([
          () => api.post("/categories", payload),
          () => api.post("/admin/categories", payload),
        ]);
        categoryMessage.value = "Category created successfully.";
      }

      clearCategoryForm();
      await loadCategories();
      clearSubcategoryForm();
    } catch (error) {
      categoryError.value = error?.response?.data?.message || "Failed to save category.";
    } finally {
      categorySubmitting.value = false;
    }
  }

  function editCategory(category) {
    categoryForm.id = category.id || null;
    categoryForm.name = category.name || "";
    categoryForm.slug = category.slug || "";
    categoryForm.description = category.description || "";
    categoryForm.image = category.image || "";
  }

  async function removeCategory(category) {
    const allowed = window.confirm(`Delete category '${category.name}'?`);
    if (!allowed) return;

    categoryError.value = "";
    categoryMessage.value = "";

    try {
      const identifier = category.id || category.slug;
      await tryRequests([
        () => api.delete(`/categories/${identifier}`),
        () => api.post(`/categories/${identifier}`, { _method: "DELETE" }),
      ]);

      categoryMessage.value = "Category deleted successfully.";

      if (activeCategorySlug.value === category.slug) {
        activeCategorySlug.value = "";
      }

      await loadCategories();
      clearSubcategoryForm();
    } catch (error) {
      categoryError.value = error?.response?.data?.message || "Failed to delete category.";
    }
  }

  function startNewCategory() {
    clearCategoryForm();
    categoryError.value = "";
    categoryMessage.value = "";
  }

  async function saveSubcategory() {
    if (!subcategoryForm.name.trim()) {
      subcategoryError.value = "Subcategory name is required.";
      return;
    }

    if (!subcategoryForm.categorySlug) {
      subcategoryError.value = "Select a parent category first.";
      return;
    }

    subcategorySubmitting.value = true;
    subcategoryError.value = "";
    subcategoryMessage.value = "";

    const parent = categories.value.find((item) => item.slug === subcategoryForm.categorySlug);
    const payload = {
      name: subcategoryForm.name,
      description: subcategoryForm.description,
      category_id: parent?.id || null,
    };

    if (subcategoryForm.slug.trim()) payload.slug = subcategoryForm.slug;

    try {
      if (subcategoryForm.id || subcategoryForm.slug) {
        const identifier = subcategoryForm.id || subcategoryForm.slug;
        await tryRequests([
          () =>
            api.put(
              `/categories/${subcategoryForm.categorySlug}/subcategories/${identifier}`,
              payload
            ),
          () => api.put(`/subcategories/${identifier}`, payload),
          () => api.patch(`/subcategories/${identifier}`, payload),
          () => api.post(`/subcategories/${identifier}`, { ...payload, _method: "PUT" }),
        ]);
        subcategoryMessage.value = "Subcategory updated successfully.";
      } else {
        await tryRequests([
          () => api.post(`/categories/${subcategoryForm.categorySlug}/subcategories`, payload),
          () => api.post("/subcategories", payload),
        ]);
        subcategoryMessage.value = "Subcategory created successfully.";
      }

      clearSubcategoryForm();
      await loadSubcategories(subcategoryForm.categorySlug || activeCategorySlug.value);
    } catch (error) {
      subcategoryError.value =
        error?.response?.data?.message || "Failed to save subcategory.";
    } finally {
      subcategorySubmitting.value = false;
    }
  }

  function editSubcategory(subcategory) {
    subcategoryForm.id = subcategory.id || null;
    subcategoryForm.name = subcategory.name || "";
    subcategoryForm.slug = subcategory.slug || "";
    subcategoryForm.description = subcategory.description || "";
    subcategoryForm.categorySlug = activeCategorySlug.value || "";
    subcategoryError.value = "";
    subcategoryMessage.value = "";
  }

  async function removeSubcategory(subcategory) {
    const allowed = window.confirm(`Delete subcategory '${subcategory.name}'?`);
    if (!allowed) return;

    subcategoryError.value = "";
    subcategoryMessage.value = "";

    try {
      const identifier = subcategory.id || subcategory.slug;
      await tryRequests([
        () => api.delete(`/categories/${activeCategorySlug.value}/subcategories/${identifier}`),
        () => api.delete(`/subcategories/${identifier}`),
        () => api.post(`/subcategories/${identifier}`, { _method: "DELETE" }),
      ]);

      subcategoryMessage.value = "Subcategory deleted successfully.";
      await loadSubcategories(activeCategorySlug.value);
      clearSubcategoryForm();
    } catch (error) {
      subcategoryError.value =
        error?.response?.data?.message || "Failed to delete subcategory.";
    }
  }

  function startNewSubcategory() {
    clearSubcategoryForm();
    subcategoryError.value = "";
    subcategoryMessage.value = "";
  }

  async function switchCategory(slug) {
    activeCategorySlug.value = slug;
    clearSubcategoryForm();
    await loadSubcategories(slug);
  }

  async function loadInstructorRequests() {
    requestsLoading.value = true;
    requestsError.value = "";
    try {
      const response = await api.get("/admin/instructor-requests");
      instructorRequests.value = response?.data?.data?.requests?.data || [];
    } catch (error) {
      requestsError.value = "Failed to load instructor requests.";
    } finally {
      requestsLoading.value = false;
    }
  }

  async function approveRequest(id) {
    if (!window.confirm("Approve this instructor request?")) return;
    try {
      const response = await api.post(`/admin/instructor-requests/${id}/approve`);
      const password = response?.data?.data?.generated_password;
      window.alert(`Success! Auto-generated password for the instructor: ${password}`);
      await loadInstructorRequests();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to approve request.");
    }
  }

  async function rejectRequest(id) {
    const reason = window.prompt("Reason for rejection?", "Your application does not meet our current requirements.");
    if (reason === null) return; // User cancelled

    try {
      await api.delete(`/admin/instructor-requests/${id}`, { data: { reason } });
      await loadInstructorRequests();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to reject request.");
    }
  }

  onMounted(async () => {
    await loadCategories();
    clearSubcategoryForm();
    await loadInstructorRequests();
  });
</script>

<template>
  <div class="min-h-screen bg-[#f7f9fc]">
    <section class="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      <header
        class="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] text-white shadow-xl mb-8">
        <p class="text-sm uppercase tracking-[0.22em] text-slate-300 mb-3">
          TechTought Admin Dashboard
        </p>
        <h1 class="text-3xl lg:text-4xl font-black tracking-tight mb-2">
          Categories Manager - {{ adminName }}
        </h1>
        <p class="text-slate-300 max-w-2xl text-sm sm:text-base">
          Full CRUD for categories and subcategories with instant updates.
        </p>
      </header>

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-extrabold text-[#111827]">Categories</h2>
              <p class="text-xs text-gray-500">Select a category to manage its subcategories</p>
            </div>
            <button
              type="button"
              @click="startNewCategory"
              class="px-4 py-2 rounded-lg bg-[#111827] text-white font-semibold text-sm hover:bg-[#1f2937] transition-colors">
              New Category
            </button>
          </div>

          <div v-if="categoryError" class="px-6 pt-4 text-sm font-semibold text-rose-600">
            {{ categoryError }}
          </div>
          <div v-if="categoryMessage" class="px-6 pt-4 text-sm font-semibold text-emerald-600">
            {{ categoryMessage }}
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-500">
                <tr>
                  <th class="text-left px-6 py-3 font-semibold">Name</th>
                  <th class="text-left px-6 py-3 font-semibold">Slug</th>
                  <th class="text-left px-6 py-3 font-semibold">Description</th>
                  <th class="text-left px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="categoriesLoading">
                  <td class="px-6 py-8 text-gray-400" colspan="4">Loading categories...</td>
                </tr>
                <tr v-else-if="categories.length === 0">
                  <td class="px-6 py-8 text-gray-400" colspan="4">No categories found.</td>
                </tr>
                <tr
                  v-for="category in categories"
                  :key="category.id || category.slug"
                  class="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  :class="activeCategorySlug === category.slug ? 'bg-blue-50/60' : ''">
                  <td class="px-6 py-4 font-semibold text-gray-800">{{ category.name }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ category.slug }}</td>
                  <td class="px-6 py-4 text-gray-500 max-w-[330px] truncate">
                    {{ category.description || "-" }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="switchCategory(category.slug)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200">
                        Open
                      </button>
                      <button
                        type="button"
                        @click="editCategory(category)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200">
                        Edit
                      </button>
                      <button
                        type="button"
                        @click="removeCategory(category)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-lg font-extrabold text-[#111827] mb-4">
            {{ categoryForm.id || categoryForm.slug ? "Edit Category" : "Create Category" }}
          </h2>

          <form class="space-y-4" @submit.prevent="saveCategory">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Name</label>
              <input
                v-model="categoryForm.name"
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Category name" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Slug (optional)</label>
              <input
                v-model="categoryForm.slug"
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="web-development" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Image URL (optional)</label>
              <input
                v-model="categoryForm.image"
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="https://..." />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Description</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Write short description"></textarea>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="submit"
                :disabled="categorySubmitting"
                class="px-4 py-2 rounded-lg bg-[#111827] text-white font-semibold text-sm hover:bg-[#1f2937] disabled:opacity-60">
                {{ categorySubmitting ? "Saving..." : "Save Category" }}
              </button>
              <button
                type="button"
                @click="startNewCategory"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200">
                Reset
              </button>
            </div>
          </form>
        </article>
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <article class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-extrabold text-[#111827]">Subcategories</h2>
              <p class="text-xs text-gray-500">
                Parent: {{ selectedCategory?.name || "Select category" }}
              </p>
            </div>
            <button
              type="button"
              @click="startNewSubcategory"
              class="px-4 py-2 rounded-lg bg-[#111827] text-white font-semibold text-sm hover:bg-[#1f2937] transition-colors">
              New Subcategory
            </button>
          </div>

          <div v-if="subcategoryError" class="px-6 pt-4 text-sm font-semibold text-rose-600">
            {{ subcategoryError }}
          </div>
          <div v-if="subcategoryMessage" class="px-6 pt-4 text-sm font-semibold text-emerald-600">
            {{ subcategoryMessage }}
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-500">
                <tr>
                  <th class="text-left px-6 py-3 font-semibold">Name</th>
                  <th class="text-left px-6 py-3 font-semibold">Slug</th>
                  <th class="text-left px-6 py-3 font-semibold">Description</th>
                  <th class="text-left px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="subcategoriesLoading">
                  <td class="px-6 py-8 text-gray-400" colspan="4">Loading subcategories...</td>
                </tr>
                <tr v-else-if="subcategories.length === 0">
                  <td class="px-6 py-8 text-gray-400" colspan="4">No subcategories found.</td>
                </tr>
                <tr
                  v-for="subcategory in subcategories"
                  :key="subcategory.id || subcategory.slug"
                  class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-gray-800">{{ subcategory.name }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ subcategory.slug }}</td>
                  <td class="px-6 py-4 text-gray-500 max-w-[320px] truncate">
                    {{ subcategory.description || "-" }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        @click="editSubcategory(subcategory)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200">
                        Edit
                      </button>
                      <button
                        type="button"
                        @click="removeSubcategory(subcategory)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-lg font-extrabold text-[#111827] mb-4">
            {{ subcategoryForm.id || subcategoryForm.slug ? "Edit Subcategory" : "Create Subcategory" }}
          </h2>

          <form class="space-y-4" @submit.prevent="saveSubcategory">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Parent Category</label>
              <select
                v-model="subcategoryForm.categorySlug"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40">
                <option value="" disabled>Select category</option>
                <option
                  v-for="category in categories"
                  :key="category.id || category.slug"
                  :value="category.slug">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Name</label>
              <input
                v-model="subcategoryForm.name"
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Subcategory name" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Slug (optional)</label>
              <input
                v-model="subcategoryForm.slug"
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="frontend-frameworks" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Description</label>
              <textarea
                v-model="subcategoryForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Write short description"></textarea>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="submit"
                :disabled="subcategorySubmitting"
                class="px-4 py-2 rounded-lg bg-[#111827] text-white font-semibold text-sm hover:bg-[#1f2937] disabled:opacity-60">
                {{ subcategorySubmitting ? "Saving..." : "Save Subcategory" }}
              </button>
              <button
                type="button"
                @click="startNewSubcategory"
                class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200">
                Reset
              </button>
            </div>
          </form>
        </article>
      </section>

      <!-- Instructor Requests Section -->
      <section class="mt-6">
        <article class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-extrabold text-[#111827]">Instructor Requests</h2>
              <p class="text-xs text-gray-500">Manage pending applications for instructor accounts</p>
            </div>
            <button
              type="button"
              @click="loadInstructorRequests"
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors">
              Refresh
            </button>
          </div>

          <div v-if="requestsError" class="px-6 pt-4 text-sm font-semibold text-rose-600">
            {{ requestsError }}
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 text-gray-500">
                <tr>
                  <th class="text-left px-6 py-3 font-semibold">Name</th>
                  <th class="text-left px-6 py-3 font-semibold">Email</th>
                  <th class="text-left px-6 py-3 font-semibold">Country</th>
                  <th class="text-left px-6 py-3 font-semibold">Status</th>
                  <th class="text-left px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="requestsLoading">
                  <td class="px-6 py-8 text-gray-400" colspan="5">Loading requests...</td>
                </tr>
                <tr v-else-if="instructorRequests.length === 0">
                  <td class="px-6 py-8 text-gray-400" colspan="5">No pending requests found.</td>
                </tr>
                <tr
                  v-for="req in instructorRequests"
                  :key="req.id"
                  class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-gray-800">{{ req.name }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ req.email }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ req.country }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 rounded text-xs font-bold capitalize"
                      :class="req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                      {{ req.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <router-link
                        :to="{ name: 'instructor-request-details', params: { slug: req.slug } }"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        View
                      </router-link>
                      <button
                        v-if="req.status === 'pending'"
                        type="button"
                        @click="approveRequest(req.id)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        Approve
                      </button>
                      <button
                        type="button"
                        @click="rejectRequest(req.id)"
                        class="px-3 py-1.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  </div>
</template>
