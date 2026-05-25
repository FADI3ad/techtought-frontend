<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import Footer from "../../components/layout/Footer.vue";
import Swal from "sweetalert2";

// ─── Timer Modes ───────────────────────────────────────────────
const MODES = {
  work:       { label: "Focus",       color: "primary", defaultMin: 25 },
  shortBreak: { label: "Short Break", color: "emerald", defaultMin: 5  },
  longBreak:  { label: "Long Break",  color: "amber",   defaultMin: 15 },
};

// ─── State ─────────────────────────────────────────────────────
const currentMode    = ref("work");
const isRunning      = ref(false);
const sessionCount   = ref(0);   // completed focus sessions
const cycleCount     = ref(0);   // how many full pomodoro cycles

// Configurable durations (minutes)
const settings = ref({
  work:       25,
  shortBreak:  5,
  longBreak:  15,
  longBreakAfter: 4,   // long break after N sessions
});

// Seconds remaining
const totalSeconds   = computed(() => settings.value[currentMode.value] * 60);
const secondsLeft    = ref(totalSeconds.value);

// Interval handle
let intervalHandle = null;

// ─── Derived ───────────────────────────────────────────────────
const minutesLeft = computed(() => Math.floor(secondsLeft.value / 60));
const secsLeft    = computed(() => secondsLeft.value % 60);

const timerDisplay = computed(() =>
  `${String(minutesLeft.value).padStart(2, "0")}:${String(secsLeft.value).padStart(2, "0")}`
);

const progressPercent = computed(() => {
  const total = totalSeconds.value;
  return ((total - secondsLeft.value) / total) * 100;
});

// SVG circle progress
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const strokeDash = computed(() => {
  const filled = (progressPercent.value / 100) * CIRCUMFERENCE;
  return `${filled} ${CIRCUMFERENCE}`;
});

const modeColor = computed(() => MODES[currentMode.value].color);
const modeColors = {
  primary: {
    ring: "stroke-primary-600",
    bg:   "bg-primary-900",
    badge:"bg-primary-100 text-primary-800",
    btn:  "bg-primary-600 hover:bg-primary-700",
    glow: "shadow-primary-500/30",
  },
  emerald: {
    ring: "stroke-emerald-500",
    bg:   "bg-emerald-900",
    badge:"bg-emerald-100 text-emerald-800",
    btn:  "bg-emerald-600 hover:bg-emerald-700",
    glow: "shadow-emerald-500/30",
  },
  amber: {
    ring: "stroke-amber-500",
    bg:   "bg-amber-800",
    badge:"bg-amber-100 text-amber-800",
    btn:  "bg-amber-500 hover:bg-amber-600",
    glow: "shadow-amber-500/30",
  },
};

const colors = computed(() => modeColors[modeColor.value]);

// Settings panel
const showSettings = ref(false);
const tempSettings = ref({ ...settings.value });

// ─── Timer control ─────────────────────────────────────────────
function startTimer() {
  if (isRunning.value) return;
  isRunning.value = true;
  intervalHandle = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--;
    } else {
      clearInterval(intervalHandle);
      isRunning.value = false;
      onTimerEnd();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(intervalHandle);
  isRunning.value = false;
}

function resetTimer() {
  pauseTimer();
  secondsLeft.value = totalSeconds.value;
}

function skipToNext() {
  pauseTimer();
  onTimerEnd(true);
}

function switchMode(mode) {
  pauseTimer();
  currentMode.value = mode;
  secondsLeft.value = settings.value[mode] * 60;
}

function onTimerEnd(skipped = false) {
  if (!skipped) {
    // Play a soft notification
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (_) {}
  }

  // Advance session
  if (currentMode.value === "work") {
    sessionCount.value++;

    // Determine next break type
    if (sessionCount.value % settings.value.longBreakAfter === 0) {
      cycleCount.value++;
      if (!skipped) {
        Swal.fire({
          title: "🎉 Great work!",
          text: "You completed a full Pomodoro cycle! Take a long break.",
          icon: "success",
          confirmButtonColor: "#1a365d",
          confirmButtonText: "Start Long Break",
        }).then(() => {
          switchMode("longBreak");
          startTimer();
        });
        return;
      }
      switchMode("longBreak");
    } else {
      if (!skipped) {
        Swal.fire({
          title: "✅ Focus session done!",
          text: "Take a short break, you earned it!",
          icon: "success",
          confirmButtonColor: "#10b981",
          confirmButtonText: "Start Break",
        }).then(() => {
          switchMode("shortBreak");
          startTimer();
        });
        return;
      }
      switchMode("shortBreak");
    }
  } else {
    // Break finished → back to work
    if (!skipped) {
      Swal.fire({
        title: "⏰ Break's over!",
        text: "Time to get back to work. Stay focused!",
        icon: "info",
        confirmButtonColor: "#1a365d",
        confirmButtonText: "Start Focus",
      }).then(() => {
        switchMode("work");
        startTimer();
      });
      return;
    }
    switchMode("work");
  }
}

// Re-init secondsLeft when mode settings change
watch(
  () => settings.value,
  () => {
    if (!isRunning.value) {
      secondsLeft.value = settings.value[currentMode.value] * 60;
    }
  },
  { deep: true }
);

// Open/close settings
function openSettings() {
  tempSettings.value = { ...settings.value };
  showSettings.value = true;
}
function saveSettings() {
  settings.value = { ...tempSettings.value };
  showSettings.value = false;
  if (!isRunning.value) {
    secondsLeft.value = settings.value[currentMode.value] * 60;
  }
}

// Cleanup
onUnmounted(() => { clearInterval(intervalHandle); });

// ─── Motivational quotes ───────────────────────────────────────
const quotes = [
  "Focus is not about saying yes to your task, it's about saying no to everything else.",
  "Small steps, every day. That's how big things get done.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Stay committed to your goals and flexible in your approach.",
  "One session at a time. One page at a time. One day at a time.",
];
const quoteIndex = ref(Math.floor(Math.random() * quotes.length));
const currentQuote = computed(() => quotes[quoteIndex.value]);
function nextQuote() {
  quoteIndex.value = (quoteIndex.value + 1) % quotes.length;
}

// Session history dots
const MAX_DOTS = 8;
const sessionDots = computed(() => {
  const total = sessionCount.value % MAX_DOTS || (sessionCount.value > 0 ? MAX_DOTS : 0);
  return Array.from({ length: MAX_DOTS }, (_, i) => i < (sessionCount.value % MAX_DOTS || (sessionCount.value > 0 && sessionCount.value % MAX_DOTS === 0 ? MAX_DOTS : 0)));
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">

    <!-- Header -->
    <div :class="colors.bg" class="text-white py-12 transition-colors duration-700">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black mb-2">Pomodoro Timer</h1>
          <p class="text-white/70">Stay focused, take breaks, and build momentum one session at a time.</p>
        </div>
        <!-- Session tracker -->
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3">
          <div>
            <p class="text-xs uppercase font-bold tracking-wider text-white/60">Sessions Today</p>
            <p class="text-2xl font-black text-white">{{ sessionCount }}</p>
          </div>
          <div class="h-10 w-px bg-white/20 mx-2"></div>
          <div>
            <p class="text-xs uppercase font-bold tracking-wider text-white/60">Cycles</p>
            <p class="text-2xl font-black text-white">{{ cycleCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 py-12 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        <!-- ── Left: Settings & Info Panel ─────────── -->
        <div class="space-y-6">

          <!-- Mode Selector -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h3 class="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">Timer Mode</h3>
            <button v-for="(info, mode) in MODES" :key="mode"
              @click="switchMode(mode)"
              :class="currentMode === mode
                ? 'bg-primary-50 text-primary-700 border-primary-200 font-bold'
                : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'"
              class="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all">
              <span class="flex items-center gap-3">
                <span :class="currentMode === mode ? 'bg-primary-600' : 'bg-gray-300'" class="w-2.5 h-2.5 rounded-full transition-colors"></span>
                {{ info.label }}
              </span>
              <span class="text-xs font-semibold text-gray-400">{{ settings[mode] }}min</span>
            </button>
          </div>

          <!-- Session Progress Dots -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 class="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">Session Progress</h3>
            <div class="flex items-center gap-2 flex-wrap mb-3">
              <div v-for="(filled, i) in Array.from({ length: MAX_DOTS })" :key="i"
                :class="i < (sessionCount % MAX_DOTS || (sessionCount > 0 && sessionCount % MAX_DOTS === 0 ? MAX_DOTS : 0))
                  ? 'bg-primary-600 scale-110'
                  : 'bg-gray-200'"
                class="w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center">
                <svg v-if="i < (sessionCount % MAX_DOTS || (sessionCount > 0 && sessionCount % MAX_DOTS === 0 ? MAX_DOTS : 0))"
                  class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500">
              {{ sessionCount % settings.longBreakAfter }} / {{ settings.longBreakAfter }} sessions until long break
            </p>
            <div class="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-primary-600 rounded-full transition-all duration-500"
                :style="{ width: `${((sessionCount % settings.longBreakAfter) / settings.longBreakAfter) * 100}%` }">
              </div>
            </div>
          </div>

          <!-- Motivational Quote -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm text-gray-600 italic leading-relaxed">"{{ currentQuote }}"</p>
              <button @click="nextQuote" class="flex-shrink-0 text-gray-400 hover:text-primary-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Settings Button -->
          <button @click="openSettings"
            class="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-sm font-bold text-gray-700 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50 transition-all flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Customize Timer Settings
          </button>
        </div>

        <!-- ── Center & Right: Timer ─────────────── -->
        <div class="lg:col-span-2 flex flex-col items-center justify-center gap-8">

          <!-- Mode Badge -->
          <div :class="colors.badge" class="px-5 py-2 rounded-full text-sm font-extrabold uppercase tracking-widest transition-colors duration-500">
            {{ MODES[currentMode].label }} Session
          </div>

          <!-- SVG Ring Timer -->
          <div class="relative flex items-center justify-center">
            <svg class="w-72 h-72 -rotate-90" viewBox="0 0 260 260">
              <!-- Background track -->
              <circle cx="130" cy="130" :r="RADIUS" stroke="currentColor" class="text-gray-200" stroke-width="10" fill="transparent" />
              <!-- Progress arc -->
              <circle cx="130" cy="130" :r="RADIUS"
                :class="colors.ring"
                stroke-width="10" fill="transparent"
                :stroke-dasharray="strokeDash"
                :stroke-dashoffset="0"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-linear" />
            </svg>

            <!-- Center Content -->
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <!-- Timer digits -->
              <span class="text-7xl font-black text-gray-900 tabular-nums tracking-tight leading-none">
                {{ timerDisplay }}
              </span>
              <span class="text-sm font-semibold text-gray-400 mt-2 uppercase tracking-wider">
                {{ isRunning ? 'Focusing...' : secondsLeft === totalSeconds ? 'Ready' : 'Paused' }}
              </span>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-4">
            <!-- Reset -->
            <button @click="resetTimer"
              class="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-all hover:scale-105 active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Play / Pause (Big) -->
            <button @click="isRunning ? pauseTimer() : startTimer()"
              :class="[colors.btn, colors.glow]"
              class="w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95">
              <!-- Play icon -->
              <svg v-if="!isRunning" class="w-9 h-9 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <!-- Pause icon -->
              <svg v-else class="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>

            <!-- Skip -->
            <button @click="skipToNext"
              class="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-all hover:scale-105 active:scale-95">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Quick Mode Switcher Row -->
          <div class="flex gap-3">
            <button v-for="(info, mode) in MODES" :key="mode"
              @click="switchMode(mode)"
              :class="currentMode === mode ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
              class="px-4 py-2 rounded-lg border text-xs font-bold transition-all">
              {{ info.label }} ({{ settings[mode] }}m)
            </button>
          </div>

          <!-- Progress bar under timer -->
          <div class="w-full max-w-sm">
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>0:00</span>
              <span>{{ settings[currentMode] }}:00</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000"
                :class="modeColor === 'primary' ? 'bg-primary-600' : modeColor === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'"
                :style="{ width: `${progressPercent}%` }">
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <Footer />

    <!-- ── Settings Modal ──────────────────────────── -->
    <div v-if="showSettings"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
      @click.self="showSettings = false">
      <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200">
        <div class="flex items-center justify-between border-b pb-4 mb-6">
          <h3 class="text-xl font-bold text-gray-900">Timer Settings</h3>
          <button @click="showSettings = false" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-5">
          <div v-for="(info, mode) in MODES" :key="mode">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {{ info.label }} Duration (minutes)
            </label>
            <div class="flex items-center gap-3">
              <button @click="tempSettings[mode] = Math.max(1, tempSettings[mode] - 1)"
                class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg transition-all">−</button>
              <input v-model.number="tempSettings[mode]" type="number" min="1" max="120"
                class="w-full text-center bg-gray-50 border border-gray-200 rounded-lg py-2 text-sm font-bold focus:outline-none focus:border-primary-500 text-gray-800" />
              <button @click="tempSettings[mode] = Math.min(120, tempSettings[mode] + 1)"
                class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg transition-all">+</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Long Break After (sessions)</label>
            <div class="flex items-center gap-3">
              <button @click="tempSettings.longBreakAfter = Math.max(1, tempSettings.longBreakAfter - 1)"
                class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg transition-all">−</button>
              <input v-model.number="tempSettings.longBreakAfter" type="number" min="1" max="10"
                class="w-full text-center bg-gray-50 border border-gray-200 rounded-lg py-2 text-sm font-bold focus:outline-none focus:border-primary-500 text-gray-800" />
              <button @click="tempSettings.longBreakAfter = Math.min(10, tempSettings.longBreakAfter + 1)"
                class="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg transition-all">+</button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t mt-6">
          <button @click="showSettings = false"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-lg text-sm transition-all">Cancel</button>
          <button @click="saveSettings"
            class="btn-global px-6 py-2.5 rounded-lg text-sm">Save Settings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth SVG arc transition */
circle {
  transition: stroke-dasharray 1s linear;
}
</style>
