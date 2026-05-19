<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "../../../services/axios";

  const route = useRoute();
  const router = useRouter();

  const loading = ref(true);
  const course = ref(null);
  const sections = ref([]);

  // States for forms
  const addingSection = ref(false);
  const newSectionName = ref("");
  
  const editingSectionId = ref(null);
  const editSectionName = ref("");

  const addingLessonToSectionId = ref(null);
  const newLesson = ref({ title: "", video: null, videoName: "" });

  const uploading = ref(false);

  async function loadCourseData() {
    loading.value = true;
    try {
      const response = await api.get(`/courses/${route.params.slug}/sections`);
      course.value = response.data?.data?.course || response.data?.data;
      sections.value = course.value?.sections || [];
    } catch (error) {
      console.error("Failed to load course sections:", error);
      alert("Failed to load course sections. Please check if the course exists.");
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadCourseData);

  // --- Section Actions ---
  async function saveNewSection() {
    if (!newSectionName.value.trim() || !course.value?.id) return;
    try {
      const { data } = await api.post("/instructor/sections", {
        name: newSectionName.value,
        course_id: course.value.id
      });
      sections.value.push(data.data?.section || data.data);
      addingSection.value = false;
      newSectionName.value = "";
    } catch (err) {
      console.error("Failed to add section:", err);
      alert("Failed to add section.");
    }
  }

  async function deleteSection(slug, index) {
    if (!confirm("Delete this section and all its lessons?")) return;
    try {
      await api.delete(`/instructor/sections/${slug}`);
      sections.value.splice(index, 1);
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  }

  async function saveEditedSection(slug, index) {
    if (!editSectionName.value.trim()) return;
    try {
      const { data } = await api.put(`/instructor/sections/${slug}`, {
        name: editSectionName.value
      });
      sections.value[index] = data.data?.section || data.data;
      editingSectionId.value = null;
    } catch (err) {
      console.error("Failed to update section:", err);
    }
  }

  // --- Lesson Actions ---
  function onVideoChange(e) {
    const file = e.target.files[0];
    if (file) {
      newLesson.value.video = file;
      newLesson.value.videoName = file.name;
    }
  }

  async function saveNewLesson(sectionId, sectionIndex) {
    if (!newLesson.value.title.trim()) {
      alert("Lesson title is required.");
      return;
    }
    
    uploading.value = true;
    try {
      const fd = new FormData();
      fd.append("title", newLesson.value.title);
      fd.append("section_id", sectionId);
      if (newLesson.value.video) fd.append("video", newLesson.value.video);

      const { data } = await api.post("/instructor/lessons", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (!sections.value[sectionIndex].lessons) sections.value[sectionIndex].lessons = [];
      sections.value[sectionIndex].lessons.push(data.data?.lesson || data.data);
      
      addingLessonToSectionId.value = null;
      newLesson.value = { title: "", video: null, videoName: "" };
    } catch (err) {
      console.error("Failed to add lesson:", err);
      alert("Failed to upload lesson video.");
    } finally {
      uploading.value = false;
    }
  }

  async function deleteLesson(slug, sectionIndex, lessonIndex) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/instructor/lessons/${slug}`);
      sections.value[sectionIndex].lessons.splice(lessonIndex, 1);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
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
        <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Curriculum Builder</h2>
        <p class="text-sm text-gray-500 mt-1">Manage sections and upload video lessons for <span class="font-bold text-gray-800">{{ course?.title }}</span></p>
      </div>
      <button @click="addingSection = true" v-if="!addingSection" class="btn-primary gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
        New Section
      </button>
    </div>

    <div v-if="loading" class="saas-card py-20 flex justify-center">
      <div class="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-6">
      
      <!-- Add Section Form -->
      <div v-if="addingSection" class="saas-card bg-blue-50/50 border-blue-100 flex items-center gap-4">
        <input v-model="newSectionName" type="text" placeholder="e.g. Introduction to the Course" class="form-input flex-1" @keyup.enter="saveNewSection" autoFocus />
        <button @click="saveNewSection" class="btn-primary py-3 px-6 whitespace-nowrap">Save Section</button>
        <button @click="addingSection = false; newSectionName = ''" class="btn-secondary py-3 px-6">Cancel</button>
      </div>

      <!-- Sections List -->
      <div v-if="sections.length === 0 && !addingSection" class="saas-card text-center py-20">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">No sections created</h3>
        <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">Start building your curriculum by adding the first section.</p>
        <button @click="addingSection = true" class="text-[var(--color-primary)] font-bold hover:underline">Add Section &rarr;</button>
      </div>

      <div v-for="(section, sIndex) in sections" :key="section.id" class="saas-card p-0 overflow-hidden shadow-sm">
        <!-- Section Header -->
        <div class="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between group">
          <div class="flex-1 flex items-center gap-4">
            <span class="text-sm font-bold text-gray-400">Section {{ sIndex + 1 }}:</span>
            
            <div v-if="editingSectionId === section.id" class="flex items-center gap-2 flex-1">
              <input v-model="editSectionName" type="text" class="form-input py-2 flex-1" @keyup.enter="saveEditedSection(section.slug, sIndex)" />
              <button @click="saveEditedSection(section.slug, sIndex)" class="text-[var(--color-primary)] font-bold text-sm px-3 hover:underline">Save</button>
              <button @click="editingSectionId = null" class="text-gray-500 font-bold text-sm px-3 hover:underline">Cancel</button>
            </div>
            
            <h3 v-else class="text-base font-bold text-gray-900">{{ section.name }}</h3>
          </div>
          
          <div v-if="editingSectionId !== section.id" class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="editingSectionId = section.id; editSectionName = section.name" class="p-1.5 text-gray-400 hover:text-[var(--color-primary)] bg-white rounded-lg border border-gray-200 shadow-sm transition-colors" title="Edit Section">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button @click="deleteSection(section.slug, sIndex)" class="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors" title="Delete Section">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <!-- Lessons List -->
        <div class="p-6">
          <div class="space-y-3">
            <div v-for="(lesson, lIndex) in section.lessons" :key="lesson.id" class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[var(--color-primary)]/30 hover:bg-blue-50/20 transition-colors group/lesson">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                  <span class="text-xs font-bold">{{ lIndex + 1 }}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ lesson.title }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <svg class="w-3.5 h-3.5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span class="text-xs text-gray-500">{{ lesson.video_path ? 'Video Uploaded' : 'No Video' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                <button @click="deleteLesson(lesson.slug, sIndex, lIndex)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Add Lesson Form -->
            <div v-if="addingLessonToSectionId === section.id" class="p-4 rounded-xl border-2 border-dashed border-[var(--color-primary)]/40 bg-blue-50/20 space-y-4">
              <div>
                <label class="form-label">Lesson Title</label>
                <input v-model="newLesson.title" type="text" placeholder="e.g. Welcome & Introduction" class="form-input" />
              </div>
              <div>
                <label class="form-label">Video File</label>
                <div class="flex items-center gap-4">
                  <label class="btn-secondary py-2 px-4 cursor-pointer">
                    <span>Choose Video</span>
                    <input type="file" accept="video/*" class="hidden" @change="onVideoChange" />
                  </label>
                  <span class="text-sm text-gray-500 truncate">{{ newLesson.videoName || 'No file selected' }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <button @click="saveNewLesson(section.id, sIndex)" :disabled="uploading" class="btn-primary py-2 px-5 gap-2">
                  <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span v-else>Save Lesson</span>
                </button>
                <button @click="addingLessonToSectionId = null; newLesson = {title: '', video: null, videoName: ''}" class="btn-secondary py-2 px-5">Cancel</button>
              </div>
            </div>
            
            <button v-else @click="addingLessonToSectionId = section.id" class="w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[var(--color-primary)] hover:bg-blue-50 border border-dashed border-gray-200 hover:border-[var(--color-primary)]/30 rounded-xl transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              Add Lesson
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="flex justify-end pt-4">
        <button @click="router.push('/instructor/dashboard/courses')" class="btn-primary px-8 py-3 text-sm">
          Finish & Return to Courses
        </button>
      </div>

    </div>
  </div>
</template>
