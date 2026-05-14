<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/axios";

// ─── State ─────────────────────────────────────────
const expandedSection = ref(null);
const currentVideo = ref(null);
const activeTab = ref("overview");
const sidebarOpen = ref(false);

const course = ref(null);
const loading = ref(true);

// ─── Route (dynamic slug) ─────────────────────────
const route = useRoute();

// ─── API ─────────────────────────────────────────
const fetchCourse = async () => {
  try {
    const res = await api.get(
      `/courses/${route.params.slug}/sections`
    );

    course.value = res.data.data;

    // تحديد أول فيديو تلقائي عند التحميل
    if (course.value?.sections?.length) {
      const firstSection = course.value.sections[0];
      const firstLesson = firstSection?.lessons?.[0];

      if (firstLesson) {
        currentVideo.value = firstLesson;
        expandedSection.value = 0;
      }
    }
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCourse);

// ─── UI Logic ─────────────────────────────────────
function toggleSection(index) {
  expandedSection.value = expandedSection.value === index ? null : index;
}

function selectVideo(lesson) {
  currentVideo.value = lesson;
  sidebarOpen.value = false;
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-screen bg-slate-50">
    <div class="flex flex-col items-center gap-2">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-500 text-sm font-medium">Loading course...</p>
    </div>
  </div>

  <div v-else class="flex flex-col h-screen bg-slate-50 overflow-hidden">
    


    <div class="flex-1 flex overflow-hidden relative">
      
      <div class="flex-1 flex flex-col overflow-y-auto bg-slate-100">
        
        <div class="bg-slate-900 w-full flex justify-center shadow-inner">
          <div class="w-full max-w-5xl px-0 md:px-6 lg:px-10">
            <div class="aspect-video bg-black relative shadow-2xl overflow-hidden md:my-4 md:rounded-lg">
              <video
                v-if="currentVideo?.video_url"
                :key="currentVideo.id"
                :src="currentVideo.video_url"
                controls
                autoplay
                class="w-full h-full object-contain"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center">
                <p class="text-slate-400 text-sm">No video selected</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 bg-white">
          <div class="sticky top-0 z-10 flex border-b bg-white/90 backdrop-blur-md px-4 md:px-10">
            <button
              v-for="tab in ['overview', 'resources', 'notes']"
              :key="tab"
              @click="activeTab = tab"
              class="py-4 px-6 text-[11px] font-bold border-b-2 transition-all uppercase tracking-widest"
              :class="activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
            >
              {{ tab }}
            </button>
          </div>

          <div class="p-6 md:p-10 max-w-4xl">
            <div v-if="activeTab === 'overview'" class="space-y-4">
              <h3 class="text-xl md:text-2xl font-bold text-slate-800">
                {{ currentVideo?.title }}
              </h3>
              <div class="h-1.5 w-16 bg-indigo-500 rounded-full"></div>
              <p class="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {{ course?.description }}
              </p>
            </div>
            
            <div v-else class="py-16 text-center">
              <div class="text-slate-300 mb-2 text-4xl">📁</div>
              <p class="text-slate-400 text-sm italic font-medium">
                {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }} section is coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
      />

      <aside
        class="fixed top-14 right-0 h-[calc(100vh-56px)] z-40 w-[85vw] max-w-[320px] bg-white border-l transition-transform duration-300 md:static md:translate-x-0 md:w-80 flex flex-col"
        :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'"
      >
        <div class="p-4 border-b bg-slate-50 flex-shrink-0">
          <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Course Content
          </h3>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div v-for="(section, si) in course?.sections" :key="section.id" class="border-b last:border-b-0">
            
            <button
              @click="toggleSection(si)"
              class="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
            >
              <div class="pr-2">
                <p class="text-[11px] font-black text-indigo-600 uppercase mb-1">
                  Section {{ si + 1 }}
                </p>
                <p class="text-xs font-bold text-slate-800 leading-tight">
                  {{ section.name }}
                </p>
              </div>
              <span class="text-[10px] text-slate-400 transition-transform duration-200" :class="{'rotate-180': expandedSection === si}">
                ▼
              </span>
            </button>

            <div v-show="expandedSection === si" class="bg-slate-50/50">
              <div
                v-for="(lesson, li) in section.lessons"
                :key="lesson.id"
                @click="selectVideo(lesson)"
                class="group p-3 pl-6 cursor-pointer border-l-4 transition-all hover:bg-indigo-50 flex items-start gap-3"
                :class="currentVideo?.id === lesson.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent'"
              >
                <div class="mt-0.5 text-[10px] text-slate-400 font-medium">{{ li + 1 }}.</div>
                <p class="text-xs font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                  {{ lesson.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* تحسين شكل الفيديو */
video {
  outline: none;
}

/* تخصيص السكرول بار ليصبح نحيفاً وجميلاً */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* حركات الانميشن البسيطة */
.rotate-180 {
  transform: rotate(180deg);
}

/* Responsive adjustments for video container */
@media (max-width: 768px) {
  .aspect-video {
    border-radius: 0;
  }
}
</style>