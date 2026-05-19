<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../../services/axios";
import PremiumVideoPlayer from "./components/PremiumVideoPlayer.vue";

// ─── State ─────────────────────────────────────────
const expandedSections = ref([]);
const currentVideo = ref(null);
const activeTab = ref("overview");
const sidebarOpen = ref(true); // Default open on desktop
const isMobile = ref(false);
const isSidebarDark = ref(false); // Customization feature

const course = ref(null);
const loading = ref(true);

// ─── Route & Router ───────────────────────────────
const route = useRoute();
const router = useRouter();

// ─── API ─────────────────────────────────────────
const fetchCourse = async () => {
  try {
    const res = await api.get(`/courses/${route.params.slug}/sections`);
    course.value = res.data.data;

    // Expand the first section by default
    if (course.value?.sections?.length) {
      expandedSections.value.push(course.value.sections[0].id);
      
      const firstSection = course.value.sections[0];
      const firstLesson = firstSection?.lessons?.[0];

      if (firstLesson) {
        currentVideo.value = firstLesson;
      }
    }
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourse();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Load user preference for sidebar theme
  const savedTheme = localStorage.getItem('techtought_sidebar_theme');
  if (savedTheme === 'dark') {
    isSidebarDark.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

function toggleTheme() {
  isSidebarDark.value = !isSidebarDark.value;
  localStorage.setItem('techtought_sidebar_theme', isSidebarDark.value ? 'dark' : 'light');
}

function checkMobile() {
  isMobile.value = window.innerWidth < 1024;
  if (isMobile.value) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }
}

// ─── UI Logic ─────────────────────────────────────
function toggleSection(id) {
  const index = expandedSections.value.indexOf(id);
  if (index > -1) {
    expandedSections.value.splice(index, 1);
  } else {
    expandedSections.value.push(id);
  }
}

function isSectionExpanded(id) {
  return expandedSections.value.includes(id);
}

function selectVideo(lesson) {
  currentVideo.value = lesson;
  if (isMobile.value) {
    sidebarOpen.value = false; // Auto-close sidebar on mobile after selection
  }
}

const progress = computed(() => {
  return 15;
});
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center h-screen bg-[#1c1d1f] text-white">
    <div class="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
    <p class="text-gray-300 font-medium tracking-wide">Loading Course Environment...</p>
  </div>

  <div v-else class="flex flex-col h-screen bg-white overflow-hidden font-sans">
    
    <!-- 1. Top Navbar (Dark, Premium, Modern) -->
    <header class="h-16 bg-[#1c1d1f] text-white flex items-center justify-between px-6 z-50 shrink-0 border-b border-white/10 shadow-lg">
      <div class="flex items-center gap-6">
        <!-- Logo -->
        <div class="flex items-center cursor-pointer hover:opacity-80 transition-opacity" @click="router.push('/')">
          <img src="../../../assets/images/Group 13.png" alt="TechTought" class="h-8 brightness-0 invert" />
        </div>

        <div class="hidden md:block w-px h-8 bg-white/20"></div>

        <h1 class="text-sm md:text-base font-semibold truncate max-w-[200px] md:max-w-lg text-gray-100 tracking-wide">
          {{ course?.title }}
        </h1>
      </div>

      <div class="flex items-center gap-5 md:gap-8">
        <!-- Theme Toggle -->
        <button 
          @click="toggleTheme"
          class="flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all group relative"
          title="Customize Sidebar Theme"
        >
          <svg v-if="!isSidebarDark" class="w-5 h-5 group-active:scale-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5 group-active:scale-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="absolute -bottom-8 right-0 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {{ isSidebarDark ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </button>

        <!-- Progress -->
        <div class="hidden md:flex flex-col gap-1.5 mt-0.5">
          <div class="w-36 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="text-[10px] font-semibold text-gray-400 tracking-wider">YOUR PROGRESS: {{ progress }}%</span>
        </div>

        <button 
          @click="router.push('/dashboard')"
          class="text-sm font-bold text-gray-200 hover:text-white transition-all border border-gray-600 hover:border-gray-400 hover:bg-white/10 px-5 py-2 rounded-lg"
        >
          Dashboard
        </button>
      </div>
    </header>

    <!-- 2. Main Layout (Video + Sidebar) -->
    <div class="flex flex-1 overflow-hidden relative">
      
      <!-- Video & Content Area -->
      <div 
        class="flex-1 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out relative"
        :class="sidebarOpen && !isMobile ? 'mr-[420px]' : 'mr-0'"
      >
        <!-- Video Player Wrapper -->
        <div class="bg-black w-full flex justify-center items-center relative shadow-inner" style="height: calc(100vh - 64px - 100px); min-height: 450px; max-height: 80vh;">
          <PremiumVideoPlayer
            v-if="currentVideo?.video_url"
            :key="currentVideo.id"
            :src="currentVideo.video_url"
          />
          <div v-else class="flex flex-col items-center justify-center text-gray-500">
            <svg class="w-20 h-20 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-lg font-medium tracking-wide">Select a video from the course content to begin.</p>
          </div>
          
          <!-- Mobile Toggle Sidebar Overlay Button -->
          <button 
            v-if="!sidebarOpen"
            @click="sidebarOpen = true"
            class="lg:hidden absolute top-6 right-6 bg-black/70 text-white p-3 rounded-lg hover:bg-black/90 backdrop-blur-md z-10 transition-all border border-white/10 shadow-xl"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
          </button>
        </div>

        <!-- Below Video Content -->
        <div class="flex-1 bg-white">
          <div class="border-b border-gray-200">
            <div class="max-w-[1200px] mx-auto px-6 md:px-10 flex items-center">
              <button
                v-for="tab in ['overview', 'Q&A', 'notes', 'announcements']"
                :key="tab"
                @click="activeTab = tab"
                class="py-5 px-2 mr-10 text-[15px] font-bold border-b-[3px] transition-all capitalize"
                :class="activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'"
              >
                {{ tab }}
              </button>
            </div>
          </div>

          <div class="max-w-[1200px] mx-auto px-6 md:px-10 py-10 pb-24">
            <div v-if="activeTab === 'overview'" class="space-y-10 max-w-4xl">
              <div>
                <h2 class="text-3xl font-extrabold text-gray-900 mb-2">About this lesson</h2>
                <h3 class="text-xl font-semibold text-gray-700">{{ currentVideo?.title }}</h3>
              </div>
              
              <div class="border-t border-gray-100 pt-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Course Description</h2>
                <div class="prose prose-base md:prose-lg max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                  {{ course?.description }}
                </div>
              </div>
            </div>
            
            <div v-else class="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl max-w-4xl bg-gray-50/50">
              <div class="text-gray-300 mb-6 text-6xl">🚧</div>
              <h3 class="text-2xl font-bold text-gray-800 mb-3">{{ activeTab.toUpperCase() }}</h3>
              <p class="text-gray-500 text-lg">This feature is currently under development and will be available soon.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay Backdrop -->
      <div
        v-if="sidebarOpen && isMobile"
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity"
      ></div>

      <!-- Right Sidebar (Curriculum) -->
      <aside
        class="fixed lg:absolute top-16 lg:top-0 right-0 h-[calc(100vh-64px)] z-40 border-l transition-all duration-500 ease-in-out flex flex-col shadow-2xl lg:shadow-none"
        :class="[
          sidebarOpen ? 'translate-x-0 w-[85vw] sm:w-[420px]' : 'translate-x-full w-[420px]',
          isSidebarDark ? 'bg-[#1c1d1f] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        ]"
      >
        <div 
          class="p-5 border-b shrink-0 flex justify-between items-center transition-colors"
          :class="isSidebarDark ? 'border-gray-800 bg-[#1c1d1f]' : 'border-gray-200 bg-white'"
        >
          <h2 class="text-lg font-bold tracking-tight">Course content</h2>
          <button 
            @click="sidebarOpen = false" 
            class="transition-colors p-1.5 rounded-lg"
            :class="isSidebarDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-black hover:bg-gray-100'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div 
          class="flex-1 overflow-y-auto custom-scrollbar transition-colors"
          :class="isSidebarDark ? 'bg-black/20' : 'bg-gray-50/50'"
        >
          <div 
            v-for="(section, si) in course?.sections" :key="section.id" 
            class="border-b transition-colors"
            :class="isSidebarDark ? 'border-gray-800 bg-[#1c1d1f]' : 'border-gray-200 bg-white'"
          >
            
            <!-- Section Header -->
            <button
              @click="toggleSection(section.id)"
              class="w-full px-5 py-5 flex justify-between items-start text-left transition-colors"
              :class="isSidebarDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'"
            >
              <div class="pr-4 flex-1">
                <h3 
                  class="text-[16px] font-bold leading-tight mb-1.5"
                  :class="isSidebarDark ? 'text-gray-100' : 'text-gray-900'"
                >
                  Section {{ si + 1 }}: {{ section.name }}
                </h3>
                <p 
                  class="text-xs font-medium"
                  :class="isSidebarDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  0 / {{ section.lessons?.length || 0 }} | {{ section.lessons?.length || 0 }} min
                </p>
              </div>
              <svg 
                class="w-5 h-5 transition-transform duration-300 mt-0.5" 
                :class="[{'rotate-180': isSectionExpanded(section.id)}, isSidebarDark ? 'text-gray-400' : 'text-gray-500']"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Lessons List -->
            <div 
              v-show="isSectionExpanded(section.id)" 
              class="transition-colors"
              :class="isSidebarDark ? 'bg-[#1c1d1f]' : 'bg-white'"
            >
              <button
                v-for="(lesson, li) in section.lessons"
                :key="lesson.id"
                @click="selectVideo(lesson)"
                class="w-full text-left group px-5 py-3.5 flex gap-4 transition-all relative"
                :class="[
                  isSidebarDark ? 'hover:bg-white/5' : 'hover:bg-gray-50',
                  currentVideo?.id === lesson.id ? (isSidebarDark ? 'bg-white/10' : 'bg-[#f4f4f9]') : ''
                ]"
              >
                <!-- Active Indicator Line -->
                <div 
                  v-if="currentVideo?.id === lesson.id"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"
                ></div>

                <!-- Checkbox (Mock) -->
                <div class="mt-1 shrink-0">
                  <div 
                    class="w-4 h-4 border rounded-sm"
                    :class="isSidebarDark ? 'border-gray-500' : 'border-gray-400'"
                  ></div>
                </div>

                <div class="flex-1">
                  <p 
                    class="text-sm font-semibold leading-snug mb-1.5" 
                    :class="[
                      currentVideo?.id === lesson.id ? (isSidebarDark ? 'text-white' : 'text-gray-900') : (isSidebarDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900')
                    ]"
                  >
                    {{ li + 1 }}. {{ lesson.title }}
                  </p>
                  
                  <div class="flex items-center gap-2 text-xs" :class="isSidebarDark ? 'text-gray-500' : 'text-gray-500'">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span>10:00</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Expand Sidebar Button (when collapsed on desktop) -->
      <button 
        v-if="!sidebarOpen && !isMobile"
        @click="sidebarOpen = true"
        class="absolute top-6 right-6 bg-gray-900 border border-gray-700 text-white shadow-2xl p-4 rounded-xl hover:bg-black hover:scale-105 z-20 flex items-center gap-3 font-bold text-sm transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
        </svg>
        Course Content
      </button>

    </div>
  </div>
</template>

<style scoped>
/* Elegant scrollbar matching modern platforms */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #6b7280;
}

/* Specific styling for dark mode scrollbar */
.bg-\[\#1c1d1f\] .custom-scrollbar::-webkit-scrollbar-thumb,
.bg-black\/20 .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
.bg-\[\#1c1d1f\] .custom-scrollbar:hover::-webkit-scrollbar-thumb,
.bg-black\/20 .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #6b7280;
}

/* Animations */
.rotate-180 {
  transform: rotate(180deg);
}
</style>
