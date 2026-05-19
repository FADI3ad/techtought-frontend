<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "../../../services/axios";

  const route = useRoute();
  const router = useRouter();

  const isEditing = computed(() => !!route.params.slug);
  const loading = ref(false);
  const saving = ref(false);

  const form = ref({
    title: "",
    description: "",
    lang: "AR",
    is_free: false,
    price: "",
    category_id: "",
    sub_category_id: "",
    requirements: "",
    image: null,
  });

  const imagePreview = ref(null);
  const categories = ref([]);
  const subCategories = ref([]);
  const errors = ref({});

  const filteredSubCategories = computed(() => {
    if (!form.value.category_id) return [];
    return subCategories.value.filter(s => s.category_id === form.value.category_id);
  });

  watch(() => form.value.category_id, () => {
    // Only reset if we are not initially loading an edit form
    if (!loading.value) {
      form.value.sub_category_id = "";
    }
  });

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      categories.value = data?.data?.categories || data?.data || [];
    } catch (err) { console.error("Categories fetch failed:", err); }
  }

  async function fetchSubCategories() {
    try {
      const { data } = await api.get("/subcategories");
      subCategories.value = data?.data?.subcategories || data?.data || [];
    } catch (err) { console.error("Subcategories fetch failed:", err); }
  }

  async function loadCourse() {
    if (!isEditing.value) return;
    loading.value = true;
    try {
      // NOTE: We might need a specific endpoint to fetch the course details for the instructor.
      // But the public endpoint /courses/{slug} might work if it includes what we need.
      // Alternatively /instructor/my-courses/{slug}
      const response = await api.get(`/instructor/my-courses/${route.params.slug}`);
      const course = response.data?.data?.course || response.data?.data;
      if (course) {
        form.value.title = course.title;
        form.value.description = course.description;
        form.value.lang = course.lang;
        form.value.is_free = course.is_free;
        form.value.price = course.price;
        form.value.category_id = course.category_id;
        form.value.sub_category_id = course.sub_category_id;
        form.value.requirements = course.requirements || "";
        if (course.image_path) imagePreview.value = course.image_path;
      }
    } catch (err) {
      console.error("Failed to load course details:", err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    await Promise.all([fetchCategories(), fetchSubCategories()]);
    await loadCourse();
  });

  function onImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    form.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }

  function validate() {
    const e = {};
    if (!form.value.title.trim()) e.title = "Title is required";
    if (!form.value.description.trim()) e.description = "Description is required";
    if (!form.value.category_id) e.category_id = "Category is required";
    if (!form.value.sub_category_id) e.sub_category_id = "Sub-category is required";
    if (!form.value.is_free && (!form.value.price || isNaN(form.value.price))) e.price = "Valid price is required";
    errors.value = e;
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    saving.value = true;

    try {
      const fd = new FormData();
      fd.append("title", form.value.title);
      fd.append("description", form.value.description);
      fd.append("lang", form.value.lang);
      fd.append("is_free", form.value.is_free ? "1" : "0");
      fd.append("price", form.value.is_free ? "0" : form.value.price);
      fd.append("category_id", form.value.category_id);
      fd.append("sub_category_id", form.value.sub_category_id);
      if (form.value.requirements) fd.append("requirements", form.value.requirements);
      if (form.value.image) fd.append("image_path", form.value.image);

      if (isEditing.value) {
        fd.append("_method", "PUT");
        await api.post(`/instructor/courses/${route.params.slug}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        router.push("/instructor/dashboard/courses");
      } else {
        const { data } = await api.post("/instructor/courses", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newSlug = data?.data?.course?.slug;
        if (newSlug) {
          router.push(`/instructor/dashboard/courses/${newSlug}/curriculum`);
        } else {
          router.push("/instructor/dashboard/courses");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save course.");
    } finally {
      saving.value = false;
    }
  }
</script>

<template>
  <div class="animate-fade-in space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <button @click="router.back()" class="text-[var(--color-primary)] text-sm font-bold hover:underline mb-2 flex items-center gap-1">
          &larr; Back to Courses
        </button>
        <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">{{ isEditing ? 'Edit Course Details' : 'Create New Course' }}</h2>
        <p class="text-sm text-gray-500 mt-1">Provide the foundational details for your course.</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="btn-secondary">Cancel</button>
        <button @click="submit" :disabled="saving" class="btn-primary gap-2 min-w-[140px]">
          <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>{{ isEditing ? 'Save Changes' : 'Create & Continue' }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="saas-card py-20 flex justify-center">
      <div class="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <!-- Main Details -->
      <div class="saas-card space-y-6">
        <div>
          <label class="form-label">Course Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" placeholder="e.g. Complete Vue.js Developer Bootcamp" class="form-input" :class="{'border-red-300 focus:border-red-500 bg-red-50': errors.title}" />
          <p v-if="errors.title" class="text-red-500 text-xs font-medium mt-1.5 ml-1">{{ errors.title }}</p>
        </div>

        <div>
          <label class="form-label">Description <span class="text-red-500">*</span></label>
          <textarea v-model="form.description" rows="4" placeholder="What will students learn in this course?" class="form-input resize-none" :class="{'border-red-300 focus:border-red-500 bg-red-50': errors.description}"></textarea>
          <p v-if="errors.description" class="text-red-500 text-xs font-medium mt-1.5 ml-1">{{ errors.description }}</p>
        </div>

        <div>
          <label class="form-label">Requirements (Optional)</label>
          <textarea v-model="form.requirements" rows="3" placeholder="Basic HTML, CSS knowledge recommended…" class="form-input resize-none"></textarea>
        </div>
      </div>

      <!-- Settings & Media -->
      <div class="space-y-6">
        <div class="saas-card space-y-5">
          <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Course Thumbnail</h3>
          <div>
            <div v-if="!imagePreview" @click="$refs.imageInput.click()" class="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors group">
              <svg class="w-8 h-8 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span class="text-xs font-bold text-gray-400">Click to upload</span>
            </div>
            <div v-else class="relative aspect-video rounded-xl overflow-hidden group">
              <img :src="imagePreview" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button @click="$refs.imageInput.click()" class="bg-white text-gray-900 text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm hover:scale-105 transition-transform">Change Image</button>
              </div>
            </div>
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageChange" />
          </div>
        </div>

        <div class="saas-card space-y-5">
          <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Settings</h3>
          
          <div>
            <label class="form-label">Language</label>
            <div class="flex gap-2">
              <button type="button" @click="form.lang = 'AR'" class="flex-1 py-2 text-sm font-bold rounded-xl border transition-colors" :class="form.lang === 'AR' ? 'bg-blue-50 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'">🇪🇬 Arabic</button>
              <button type="button" @click="form.lang = 'EN'" class="flex-1 py-2 text-sm font-bold rounded-xl border transition-colors" :class="form.lang === 'EN' ? 'bg-blue-50 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'">🇺🇸 English</button>
            </div>
          </div>

          <div>
            <label class="form-label">Category</label>
            <select v-model="form.category_id" class="form-input" :class="{'border-red-300': errors.category_id}">
              <option value="" disabled>Select category…</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <p v-if="errors.category_id" class="text-red-500 text-xs font-medium mt-1.5 ml-1">{{ errors.category_id }}</p>
          </div>

          <div>
            <label class="form-label">Sub-Category</label>
            <select v-model="form.sub_category_id" class="form-input" :class="{'border-red-300': errors.sub_category_id}" :disabled="!form.category_id">
              <option value="" disabled>{{ form.category_id ? "Select sub-category…" : "Select category first…" }}</option>
              <option v-for="s in filteredSubCategories" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <p v-if="errors.sub_category_id" class="text-red-500 text-xs font-medium mt-1.5 ml-1">{{ errors.sub_category_id }}</p>
          </div>

          <div>
            <label class="form-label">Pricing</label>
            <div class="flex gap-2 mb-2">
              <button type="button" @click="form.is_free = true" class="flex-1 py-2 text-sm font-bold rounded-xl border transition-colors" :class="form.is_free ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'">Free</button>
              <button type="button" @click="form.is_free = false" class="flex-1 py-2 text-sm font-bold rounded-xl border transition-colors" :class="!form.is_free ? 'bg-amber-50 border-amber-500 text-amber-600' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'">Paid</button>
            </div>
            <div v-if="!form.is_free">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input v-model="form.price" type="number" step="0.01" placeholder="0.00" class="form-input pl-8" :class="{'border-red-300': errors.price}"/>
              </div>
              <p v-if="errors.price" class="text-red-500 text-xs font-medium mt-1.5 ml-1">{{ errors.price }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
