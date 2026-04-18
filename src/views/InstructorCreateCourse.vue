<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import axios from "axios";

  // ─── API ───────────────────────────────────────────────────────────────
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
  });

  // ─── Form State ───────────────────────────────────────────────────────
  const form = ref({
    title: "",
    description: "",
    lang: "AR",
    is_free: false,
    price: "",
    category_id: null,
    sub_category_id: null,
    image: null,
    requirements: "",
  });

  const imagePreview = ref(null);
  const sections = ref([]);
  const categories = ref([]);
  const subCategories = ref([]);
  const activeSection = ref(null);

  const saving = ref(false);
  const saveSuccess = ref(false);
  const errors = ref({});

  // ─── Drag State ───────────────────────────────────────────────────────
  const draggingSection = ref(null);
  const draggingLesson = ref({ sectionId: null, lessonIndex: null });

  // ─── Computed ─────────────────────────────────────────────────────────
  const totalLessons = computed(() =>
    sections.value.reduce((sum, s) => sum + s.lessons.length, 0),
  );

  const filteredSubCategories = computed(() => {
    if (!form.value.category_id) return [];
    return subCategories.value.filter(
      (s) => s.category_id === form.value.category_id,
    );
  });

  // ─── Watch: reset subcategory عند تغيير category ─────────────────────
  watch(
    () => form.value.category_id,
    () => {
      form.value.sub_category_id = null;
    },
  );

  // ─── Fetch Categories ─────────────────────────────────────────────────
  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      categories.value = data.data.categories ?? data.data ?? [];
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSubCategories() {
    try {
      const { data } = await api.get("/subcategories");
      subCategories.value = data.data.subcategories ?? data.data ?? [];
    } catch (err) {
      console.error(err);
    }
  }

  onMounted(() => {
    fetchCategories();
    fetchSubCategories();
  });

  // ─── Image ────────────────────────────────────────────────────────────
  function onImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    form.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }

  function removeImage() {
    form.value.image = null;
    imagePreview.value = null;
  }

  // ─── Sections ────────────────────────────────────────────────────────
  function addSection() {
    const id = Date.now();
    sections.value.push({ id, name: "", lessons: [] });
    activeSection.value = id;
  }

  function removeSection(id) {
    sections.value = sections.value.filter((s) => s.id !== id);
    if (activeSection.value === id) activeSection.value = null;
  }

  // ─── Lessons ─────────────────────────────────────────────────────────
  function addLesson(section) {
    section.lessons.push({
      id: Date.now(),
      title: "",
      video: null,
      videoName: "",
    });
  }

  function removeLesson(section, lessonId) {
    section.lessons = section.lessons.filter((l) => l.id !== lessonId);
  }

  function onVideoChange(e, lesson) {
    const file = e.target.files[0];
    if (!file) return;
    lesson.video = file;
    lesson.videoName = file.name;
  }

  // ─── Drag Sections ────────────────────────────────────────────────────
  function onSectionDragStart(e, index) {
    draggingSection.value = index;
    e.dataTransfer.effectAllowed = "move";
  }

  function onSectionDrop(e, index) {
    e.preventDefault();
    if (draggingSection.value === null) return;
    const arr = [...sections.value];
    const [moved] = arr.splice(draggingSection.value, 1);
    arr.splice(index, 0, moved);
    sections.value = arr;
    draggingSection.value = null;
  }

  // ─── Drag Lessons ─────────────────────────────────────────────────────
  function onLessonDragStart(e, sectionId, lessonIndex) {
    draggingLesson.value = { sectionId, lessonIndex };
    e.dataTransfer.effectAllowed = "move";
  }

  function onLessonDrop(e, sectionId, lessonIndex) {
    e.preventDefault();
    const { sectionId: fromSid, lessonIndex: fromIdx } = draggingLesson.value;
    if (fromSid !== sectionId) return;
    const section = sections.value.find((s) => s.id === sectionId);
    const arr = [...section.lessons];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(lessonIndex, 0, moved);
    section.lessons = arr;
    draggingLesson.value = { sectionId: null, lessonIndex: null };
  }

  // ─── Validation ───────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.value.title.trim()) e.title = "Title is required";
    if (!form.value.description.trim())
      e.description = "Description is required";
    if (!form.value.category_id) e.category_id = "Category is required";
    if (!form.value.sub_category_id)
      e.sub_category_id = "Sub-category is required";
    if (!form.value.is_free && (!form.value.price || isNaN(form.value.price))) {
      e.price = "Valid price is required";
    }
    errors.value = e;
    return Object.keys(e).length === 0;
  }

  // ─── Submit ───────────────────────────────────────────────────────────
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
      if (form.value.requirements)
        fd.append("requirements", form.value.requirements);
      if (form.value.image) fd.append("image", form.value.image);

      const { data: courseRes } = await api.post("/courses", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const courseId = courseRes.data.course.id;

      
      for (const section of sections.value) {
        if (!section.name.trim()) continue;

        const { data: secRes } = await api.post("/sections", {
          name: section.name,
          course_id: courseId,
        });

        const sectionId = secRes.data.section.id;

        // 3️⃣ إنشاء الليسونز
        for (const lesson of section.lessons) {
          if (!lesson.title.trim()) continue;

          const lfd = new FormData();
          lfd.append("title", lesson.title);
          lfd.append("section_id", sectionId);
          if (lesson.video) lfd.append("video", lesson.video);

          await api.post("/lessons", lfd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      saveSuccess.value = true;
      setTimeout(() => (saveSuccess.value = false), 3000);
    } catch (err) {
      // عرض errors من الـ backend لو موجودة
      console.log("FULL ERROR:", err.response?.data);

      console.error(err);
    } finally {
      saving.value = false;
    }
  }
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white font-['DM_Sans',sans-serif]">
    <component :is="'style'" v-once>
      @import
      url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700&display=swap');
    </component>

    <!-- ── Top Bar ── -->
    <header
      class="border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <a href="#" class="text-white/30 text-sm hover:text-white/60 transition"
          >Dashboard</a
        >
        <span class="text-white/20">/</span>
        <a href="#" class="text-white/30 text-sm hover:text-white/60 transition"
          >Courses</a
        >
        <span class="text-white/20">/</span>
        <span class="text-white text-sm font-medium">Create New Course</span>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="text-sm text-white/40 hover:text-white/70 transition px-4 py-2 rounded-lg border border-white/10 hover:border-white/20">
          Save Draft
        </button>
        <button
          @click="submit"
          :disabled="saving"
          class="text-sm font-semibold px-5 py-2 rounded-lg bg-[#0800FF] hover:bg-[#2c25ff] transition disabled:opacity-50 flex items-center gap-2">
          <svg
            v-if="saving"
            class="w-4 h-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4" />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <svg
            v-else-if="saveSuccess"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7" />
          </svg>
          {{
            saving
              ? "Publishing…"
              : saveSuccess
                ? "Published!"
                : "Publish Course"
          }}
        </button>
      </div>
    </header>

    <div
      class="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <!-- ── Left Column ── -->
      <div class="space-y-6">
        <!-- Course Info Card -->
        <div
          class="bg-[#111118] border border-white/5 rounded-2xl p-8 space-y-6">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-[#0800FF]/20 flex items-center justify-center">
              <svg
                class="w-4 h-4 text-[#6b63ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 class="text-base font-semibold text-white">
              Course Information
            </h2>
          </div>

          <!-- Title -->
          <div>
            <label
              class="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2"
              >Course Title</label
            >
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Complete Vue.js Developer Bootcamp"
              class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm transition focus:bg-white/8"
              :class="
                errors.title
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 focus:border-[#0800FF]/60'
              " />
            <p v-if="errors.title" class="text-red-400 text-xs mt-1">
              {{ errors.title }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label
              class="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2"
              >Description</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="What will students learn in this course?"
              class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm resize-none transition focus:bg-white/8"
              :class="
                errors.description
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 focus:border-[#0800FF]/60'
              " />
            <p v-if="errors.description" class="text-red-400 text-xs mt-1">
              {{ errors.description }}
            </p>
          </div>

          <!-- Requirements -->
          <div>
            <label
              class="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
              Requirements
              <span class="normal-case text-white/20 font-normal"
                >(optional)</span
              >
            </label>
            <textarea
              v-model="form.requirements"
              rows="3"
              placeholder="Basic HTML, CSS knowledge recommended…"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none text-sm resize-none transition focus:border-[#0800FF]/60 focus:bg-white/8" />
          </div>
        </div>

        <!-- ── Sections & Lessons ── -->
        <div class="bg-[#111118] border border-white/5 rounded-2xl p-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white">Curriculum</h2>
                <p class="text-xs text-white/30">
                  {{ sections.length }} sections · {{ totalLessons }} lessons
                </p>
              </div>
            </div>
            <button
              @click="addSection"
              type="button"
              class="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 4v16m8-8H4" />
              </svg>
              Add Section
            </button>
          </div>

          <!-- Empty state -->
          <div
            v-if="sections.length === 0"
            class="text-center py-16 border border-dashed border-white/10 rounded-xl">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p class="text-white/30 text-sm">
              No sections yet. Add your first section to get started.
            </p>
          </div>

          <!-- Sections List -->
          <div class="space-y-4">
            <div
              v-for="(section, sIdx) in sections"
              :key="section.id"
              draggable="true"
              @dragstart="onSectionDragStart($event, sIdx)"
              @dragover.prevent
              @drop="onSectionDrop($event, sIdx)"
              class="border border-white/8 rounded-xl overflow-hidden transition-all"
              :class="
                activeSection === section.id
                  ? 'border-[#0800FF]/40'
                  : 'hover:border-white/15'
              ">
              <!-- Section Header -->
              <div
                class="flex items-center gap-3 px-4 py-3 bg-white/3 cursor-pointer select-none"
                @click="
                  activeSection =
                    activeSection === section.id ? null : section.id
                ">
                <svg
                  class="w-4 h-4 text-white/20 cursor-grab flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16" />
                </svg>
                <span
                  class="text-xs font-bold text-white/30 uppercase tracking-widest w-6 flex-shrink-0">
                  {{ String(sIdx + 1).padStart(2, "0") }}
                </span>
                <div class="flex-1 min-w-0">
                  <input
                    v-model="section.name"
                    @click.stop
                    type="text"
                    placeholder="Section name…"
                    class="w-full bg-transparent text-sm font-medium text-white placeholder-white/20 outline-none" />
                </div>
                <span class="text-xs text-white/30 flex-shrink-0"
                  >{{ section.lessons.length }} lessons</span
                >
                <button
                  @click.stop="removeSection(section.id)"
                  class="text-white/20 hover:text-red-400 transition flex-shrink-0 ml-1">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg
                  class="w-4 h-4 text-white/20 flex-shrink-0 transition-transform"
                  :class="activeSection === section.id ? 'rotate-180' : ''"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Lessons -->
              <div
                v-show="activeSection === section.id"
                class="px-4 py-4 space-y-3">
                <div
                  v-for="(lesson, lIdx) in section.lessons"
                  :key="lesson.id"
                  draggable="true"
                  @dragstart="onLessonDragStart($event, section.id, lIdx)"
                  @dragover.prevent
                  @drop="onLessonDrop($event, section.id, lIdx)"
                  class="flex items-start gap-3 bg-white/3 rounded-lg p-3 group">
                  <svg
                    class="w-4 h-4 text-white/15 mt-1 cursor-grab flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8h16M4 16h16" />
                  </svg>
                  <div class="flex-1 space-y-2 min-w-0">
                    <div class="flex gap-2">
                      <div class="flex-1">
                        <input
                          v-model="lesson.title"
                          type="text"
                          placeholder="Lesson title…"
                          class="w-full bg-transparent text-sm text-white placeholder-white/20 outline-none border-b border-white/8 focus:border-[#0800FF]/50 pb-1 transition" />
                      </div>
                    </div>
                    <!-- Video upload -->
                    <div>
                      <label
                        class="flex items-center gap-2 cursor-pointer group/vid">
                        <div
                          class="flex items-center gap-1.5 text-xs text-white/30 group-hover/vid:text-[#6b63ff] transition">
                          <svg
                            class="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>{{ lesson.videoName || "Attach video" }}</span>
                        </div>
                        <input
                          type="file"
                          accept="video/mp4,video/mov,video/avi"
                          class="hidden"
                          @change="onVideoChange($event, lesson)" />
                      </label>
                    </div>
                  </div>
                  <button
                    @click="removeLesson(section, lesson.id)"
                    class="text-white/15 hover:text-red-400 transition opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1">
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Add Lesson -->
                <button
                  @click="addLesson(section)"
                  type="button"
                  class="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-white/25 hover:text-white/50 border border-dashed border-white/8 hover:border-white/20 rounded-lg transition">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M12 4v16m8-8H4" />
                  </svg>
                  Add Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right Sidebar ── -->
      <div class="space-y-5">
        <!-- Thumbnail -->
        <div class="bg-[#111118] border border-white/5 rounded-2xl p-6">
          <h3
            class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Thumbnail
          </h3>
          <div
            v-if="!imagePreview"
            @click="$refs.imageInput.click()"
            class="aspect-video rounded-xl border border-dashed border-white/15 hover:border-[#0800FF]/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition group">
            <div
              class="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#0800FF]/10 flex items-center justify-center transition">
              <svg
                class="w-5 h-5 text-white/20 group-hover:text-[#6b63ff] transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs text-white/25">Upload thumbnail</span>
          </div>
          <div v-else class="relative aspect-video rounded-xl overflow-hidden">
            <img :src="imagePreview" class="w-full h-full object-cover" />
            <button
              @click="removeImage"
              class="absolute top-2 right-2 bg-black/70 rounded-lg p-1.5 text-white/70 hover:text-white transition">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onImageChange" />
        </div>

        <!-- Settings -->
        <div
          class="bg-[#111118] border border-white/5 rounded-2xl p-6 space-y-5">
          <h3
            class="text-xs font-semibold text-white/40 uppercase tracking-widest">
            Settings
          </h3>

          <!-- Language -->
          <div>
            <label class="block text-xs text-white/40 mb-2">Language</label>
            <div class="flex gap-2">
              <button
                v-for="l in ['AR', 'EN']"
                :key="l"
                @click="form.lang = l"
                type="button"
                class="flex-1 py-2 rounded-lg text-xs font-semibold transition border"
                :class="
                  form.lang === l
                    ? 'bg-[#0800FF]/20 border-[#0800FF]/50 text-[#6b63ff]'
                    : 'bg-white/3 border-white/8 text-white/30 hover:border-white/20'
                ">
                {{ l === "AR" ? "🇪🇬 Arabic" : "🇺🇸 English" }}
              </button>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs text-white/40 mb-2">Category</label>
            <select
              v-model="form.category_id"
              class="w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white/70 outline-none appearance-none transition"
              :class="
                errors.category_id
                  ? 'border-red-500/60'
                  : 'border-white/10 focus:border-[#0800FF]/60'
              ">
              <option :value="null" disabled class="bg-[#111118]">
                Select category…
              </option>
              <option
                v-for="c in categories"
                :key="c.id"
                :value="c.id"
                class="bg-[#111118]">
                {{ c.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="text-red-400 text-xs mt-1">
              {{ errors.category_id }}
            </p>
          </div>

          <!-- Sub-Category — بيتفلتر حسب الـ category المختار -->
          <div>
            <label class="block text-xs text-white/40 mb-2">Sub-Category</label>
            <select
              v-model="form.sub_category_id"
              class="w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white/70 outline-none appearance-none transition"
              :class="
                errors.sub_category_id
                  ? 'border-red-500/60'
                  : 'border-white/10 focus:border-[#0800FF]/60'
              "
              :disabled="!form.category_id">
              <option :value="null" disabled class="bg-[#111118]">
                {{
                  form.category_id
                    ? "Select sub-category…"
                    : "Select category first…"
                }}
              </option>
              <option
                v-for="s in filteredSubCategories"
                :key="s.id"
                :value="s.id"
                class="bg-[#111118]">
                {{ s.name }}
              </option>
            </select>
            <p v-if="errors.sub_category_id" class="text-red-400 text-xs mt-1">
              {{ errors.sub_category_id }}
            </p>
          </div>

          <!-- Pricing -->
          <div>
            <label class="block text-xs text-white/40 mb-2">Pricing</label>
            <div class="flex gap-2 mb-3">
              <button
                @click="form.is_free = true"
                type="button"
                class="flex-1 py-2 rounded-lg text-xs font-semibold transition border"
                :class="
                  form.is_free
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/3 border-white/8 text-white/30 hover:border-white/20'
                ">
                Free
              </button>
              <button
                @click="form.is_free = false"
                type="button"
                class="flex-1 py-2 rounded-lg text-xs font-semibold transition border"
                :class="
                  !form.is_free
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-white/3 border-white/8 text-white/30 hover:border-white/20'
                ">
                Paid
              </button>
            </div>
            <div v-if="!form.is_free" class="relative">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm"
                >$</span
              >
              <input
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full bg-white/5 border rounded-lg pl-7 pr-3 py-2.5 text-sm text-white outline-none transition"
                :class="
                  errors.price
                    ? 'border-red-500/60'
                    : 'border-white/10 focus:border-[#0800FF]/60'
                " />
            </div>
            <p v-if="errors.price" class="text-red-400 text-xs mt-1">
              {{ errors.price }}
            </p>
          </div>
        </div>

        <!-- Summary -->
        <div
          class="bg-[#0800FF]/8 border border-[#0800FF]/20 rounded-2xl p-5 space-y-3">
          <h3
            class="text-xs font-semibold text-[#6b63ff] uppercase tracking-widest">
            Summary
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-white/40">
              <span>Sections</span>
              <span class="text-white font-semibold">{{
                sections.length
              }}</span>
            </div>
            <div class="flex justify-between text-white/40">
              <span>Lessons</span>
              <span class="text-white font-semibold">{{ totalLessons }}</span>
            </div>
            <div class="flex justify-between text-white/40">
              <span>Language</span>
              <span class="text-white font-semibold">{{ form.lang }}</span>
            </div>
            <div class="flex justify-between text-white/40">
              <span>Price</span>
              <span
                class="font-semibold"
                :class="form.is_free ? 'text-emerald-400' : 'text-amber-400'">
                {{
                  form.is_free ? "Free" : form.price ? `$${form.price}` : "—"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  select option {
    background: #111118;
  }
  select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
