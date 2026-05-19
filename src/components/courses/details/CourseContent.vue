<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Track which sections are expanded (by default, first section is expanded)
const expandedSections = ref({});

// Initialize expanded states (first section expanded by default)
if (props.sections && props.sections.length > 0) {
  expandedSections.value[props.sections[0].id] = true;
}

function toggleSection(id) {
  expandedSections.value[id] = !expandedSections.value[id];
}

const isAllExpanded = computed(() => {
  if (!props.sections || props.sections.length === 0) return false;
  return props.sections.every(s => expandedSections.value[s.id]);
});

function toggleAll() {
  const targetState = !isAllExpanded.value;
  props.sections.forEach(s => {
    expandedSections.value[s.id] = targetState;
  });
}

const totalLectures = computed(() => {
  if (!props.sections) return 0;
  return props.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);
});
</script>

<template>
  <div v-if="sections && sections.length > 0" class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-[#1c1d1f] tracking-tight">
          Course content
        </h2>
        <p class="text-xs text-gray-500 font-semibold mt-1">
          {{ sections.length }} sections • {{ totalLectures }} lectures
        </p>
      </div>

      <!-- Expand/Collapse All Button (Classic text link layout) -->
      <button 
        @click="toggleAll" 
        class="text-xs font-bold text-[#a435f0] hover:text-[#8710d8] transition-colors uppercase tracking-wider"
      >
        {{ isAllExpanded ? 'Collapse All Sections' : 'Expand All Sections' }}
      </button>
    </div>

    <!-- Accordion Syllabus list (Classic Udemy border-radius rounded-sm) -->
    <div class="border border-[#d1d7dc] rounded-sm overflow-hidden divide-y divide-[#d1d7dc]">
      <div 
        v-for="section in sections" 
        :key="section.id" 
        class="bg-[#f7f9fa] overflow-hidden"
      >
        <!-- Section Header -->
        <button 
          @click="toggleSection(section.id)"
          class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100/80 transition-colors focus:outline-none"
        >
          <div class="flex items-center gap-3 pr-4">
            <!-- Down/Up chevron -->
            <svg 
              class="w-3.5 h-3.5 text-gray-600 transition-transform duration-300 shrink-0" 
              :class="{ 'rotate-180': expandedSections[section.id] }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
            <span class="font-bold text-[#1c1d1f] text-[15px] leading-snug">
              {{ section.name }}
            </span>
          </div>
          <span class="text-xs font-semibold text-gray-500 shrink-0">
            {{ section.lessons?.length || 0 }} lectures
          </span>
        </button>

        <!-- Section Lessons List (Collapsible) -->
        <Transition name="slide">
          <div 
            v-show="expandedSections[section.id]"
            class="bg-white divide-y divide-gray-100 border-t border-[#d1d7dc]"
          >
            <div 
              v-for="lesson in section.lessons" 
              :key="lesson.id"
              class="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <!-- Lesson info -->
              <div class="flex items-center gap-3.5 text-gray-700 min-w-0 pr-4">
                <!-- Play symbol -->
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-normal text-[#1c1d1f] truncate leading-relaxed">
                  {{ lesson.title }}
                </span>
              </div>

              <!-- Lock indicator -->
              <div class="shrink-0 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
