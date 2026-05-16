<script setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import api from "../../services/axios";

  const route = useRoute();
  const course = ref(null);
  const loading = ref(true);
  const saving = ref(false);

  async function loadCourseContent() {
    loading.value = true;
    try {
      const response = await api.get(`/instructor/my-courses/${route.params.slug}`);
      course.value = response.data.data.course;
    } catch (error) {
      console.error("Failed to load course content:", error);
    } finally {
      loading.value = false;
    }
  }

  // Section Management
  async function addSection() {
    const name = window.prompt("Section Name:");
    if (!name) return;
    try {
      await api.post("/instructor/sections", {
        name,
        course_id: course.value.id
      });
      await loadCourseContent();
    } catch (error) {
      alert("Failed to add section.");
    }
  }

  async function deleteSection(id) {
    if (!window.confirm("Delete this section and all its lessons?")) return;
    try {
      await api.delete(`/instructor/sections/${id}`);
      await loadCourseContent();
    } catch (error) {
      alert("Failed to delete section.");
    }
  }

  // Lesson Management
  async function addLesson(sectionId) {
    const title = window.prompt("Lesson Title:");
    if (!title) return;
    try {
      await api.post("/instructor/lessons", {
        title,
        section_id: sectionId
      });
      await loadCourseContent();
    } catch (error) {
      alert("Failed to add lesson.");
    }
  }

  async function deleteLesson(id) {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/instructor/lessons/${id}`);
      await loadCourseContent();
    } catch (error) {
      alert("Failed to delete lesson.");
    }
  }

  onMounted(loadCourseContent);
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] py-10">
    <div class="max-w-[1000px] mx-auto px-6">
      
      <div v-if="loading" class="space-y-4">
        <div class="h-20 bg-white animate-pulse rounded-2xl"></div>
        <div class="h-64 bg-white animate-pulse rounded-2xl"></div>
      </div>

      <div v-else-if="course">
        <!-- Header -->
        <header class="mb-10 flex items-center justify-between">
          <div>
            <router-link :to="{ name: 'instructor-courses' }" class="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">← Back to Courses</router-link>
            <h1 class="text-3xl font-black text-gray-900">{{ course.title }}</h1>
            <p class="text-gray-500 font-medium mt-1">Manage sections, lessons, and curriculum.</p>
          </div>
          <button @click="addSection" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
            + Add Section
          </button>
        </header>

        <!-- Curriculum List -->
        <div class="space-y-6">
          <div v-for="(section, sIdx) in course.sections" :key="section.id" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <!-- Section Header -->
            <div class="px-8 py-5 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
              <div class="flex items-center gap-4">
                <span class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-black text-gray-500">{{ sIdx + 1 }}</span>
                <h3 class="font-black text-gray-900 text-lg">{{ section.name }}</h3>
              </div>
              <div class="flex items-center gap-2">
                <button @click="addLesson(section.id)" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                  + Add Lesson
                </button>
                <button @click="deleteSection(section.id)" class="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                  🗑️
                </button>
              </div>
            </div>

            <!-- Lessons -->
            <div class="p-4 space-y-2">
              <div v-if="section.lessons.length === 0" class="py-10 text-center text-gray-400 font-medium italic text-sm">
                No lessons in this section yet.
              </div>
              <div v-for="(lesson, lIdx) in section.lessons" :key="lesson.id" class="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p class="font-bold text-gray-800">{{ lesson.title }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Video Lesson</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="deleteLesson(lesson.id)" class="text-gray-400 hover:text-rose-500">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Meta (Comments & Reviews Overview) -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section class="bg-white rounded-3xl p-8 border border-gray-100">
            <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span>💬</span> Recent Comments
            </h2>
            <div class="space-y-4">
              <div v-for="comment in course.comments.slice(0, 3)" :key="comment.id" class="p-4 bg-gray-50 rounded-2xl">
                <div class="flex items-center gap-2 mb-2">
                  <p class="text-sm font-bold text-gray-900">{{ comment.user?.name }}</p>
                  <span class="text-[10px] text-gray-400">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ comment.content }}</p>
              </div>
              <p v-if="course.comments.length === 0" class="text-gray-400 text-sm italic">No comments yet.</p>
            </div>
          </section>

          <section class="bg-white rounded-3xl p-8 border border-gray-100">
            <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span>⭐</span> Course Reviews
            </h2>
            <div class="space-y-4">
              <div v-for="review in course.reviews.slice(0, 3)" :key="review.id" class="p-4 bg-gray-50 rounded-2xl">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-sm font-bold text-gray-900">{{ review.user?.name }}</p>
                  <span class="text-amber-500 font-black text-sm">{{ review.rating }} ⭐</span>
                </div>
                <p class="text-sm text-gray-600">{{ review.comment }}</p>
              </div>
              <p v-if="course.reviews.length === 0" class="text-gray-400 text-sm italic">No reviews yet.</p>
            </div>
          </section>
        </div>
      </div>

    </div>
  </div>
</template>
