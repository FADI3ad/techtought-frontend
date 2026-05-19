<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const videoRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const isMuted = ref(false);
const isFullscreen = ref(false);
const showControls = ref(true);
const playbackRate = ref(1);
const showSettings = ref(false);

let controlsTimeout = null;

// Watch for src change to reset state
watch(() => props.src, () => {
  isPlaying.value = false;
  currentTime.value = 0;
  showSettings.value = false;
  if (videoRef.value) {
    videoRef.value.load();
    videoRef.value.play().then(() => {
      isPlaying.value = true;
    }).catch(e => console.log('Autoplay prevented'));
  }
});

const togglePlay = () => {
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
};

const handleTimeUpdate = () => {
  currentTime.value = videoRef.value.currentTime;
};

const handleLoadedMetadata = () => {
  duration.value = videoRef.value.duration;
};

const handleSeek = (e) => {
  const time = (e.target.value / 100) * duration.value;
  videoRef.value.currentTime = time;
  currentTime.value = time;
};

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "0:00";
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
};

const changeVolume = (e) => {
  volume.value = e.target.value;
  videoRef.value.volume = volume.value;
  isMuted.value = volume.value == 0;
};

const toggleFullscreen = () => {
  const container = videoRef.value.parentElement;
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

const changePlaybackRate = (rate) => {
  playbackRate.value = rate;
  videoRef.value.playbackRate = rate;
  showSettings.value = false;
};

const skip = (seconds) => {
  videoRef.value.currentTime += seconds;
};

const handleMouseMove = () => {
  showControls.value = true;
  clearTimeout(controlsTimeout);
  if (isPlaying.value) {
    controlsTimeout = setTimeout(() => {
      showControls.value = false;
      showSettings.value = false;
    }, 2500);
  }
};

const handleMouseLeave = () => {
  if (isPlaying.value) {
    showControls.value = false;
    showSettings.value = false;
  }
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  if (videoRef.value) {
    videoRef.value.volume = volume.value;
  }
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  clearTimeout(controlsTimeout);
});
</script>

<template>
  <div 
    class="relative w-full h-full bg-black flex justify-center items-center overflow-hidden group"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Video Element -->
    <video
      ref="videoRef"
      :src="src"
      class="w-full h-full object-contain cursor-pointer outline-none"
      @click="togglePlay"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="isPlaying = false"
      controlsList="nodownload"
    ></video>

    <!-- Big Play Button Overlay (when paused) -->
    <div 
      v-if="!isPlaying" 
      class="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
      @click="togglePlay"
    >
      <div class="w-20 h-20 bg-[#a435f0]/90 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-[#8710d8] hover:scale-110 transition-all">
        <svg class="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M4 3v18l17-9L4 3z"/></svg>
      </div>
    </div>

    <!-- Controls Bar -->
    <div 
      class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-4 transition-transform duration-300 z-10"
      :class="showControls || !isPlaying || showSettings ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
    >
      <!-- Progress Bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 group/progress cursor-pointer px-4">
        <input 
          type="range" 
          min="0" 
          max="100" 
          :value="(currentTime / duration) * 100 || 0"
          @input="handleSeek"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div class="w-full h-full bg-white/30 relative">
          <!-- Buffered (Mock) -->
          <div class="absolute top-0 left-0 h-full bg-white/50" style="width: 100%"></div>
          <!-- Played -->
          <div class="absolute top-0 left-0 h-full bg-[#a435f0]" :style="{ width: (currentTime / duration) * 100 + '%' }"></div>
          <!-- Thumb -->
          <div 
            class="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#a435f0] rounded-full scale-0 group-hover/progress:scale-100 transition-transform"
            :style="{ left: (currentTime / duration) * 100 + '%' }"
            style="margin-left: -6px;"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-between text-white mt-3 relative">
        <!-- Left Controls -->
        <div class="flex items-center gap-4">
          <!-- Play/Pause -->
          <button @click="togglePlay" class="hover:text-[#a435f0] transition-colors focus:outline-none">
            <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 3v18l17-9L4 3z"/></svg>
            <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          </button>

          <!-- Skip Backward -->
          <button @click="skip(-10)" class="hover:text-white text-gray-300 transition-colors focus:outline-none relative group/skip hidden sm:block">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
            </svg>
            <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded opacity-0 group-hover/skip:opacity-100 pointer-events-none">10s</span>
          </button>

          <!-- Skip Forward -->
          <button @click="skip(10)" class="hover:text-white text-gray-300 transition-colors focus:outline-none relative group/skip hidden sm:block">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
            </svg>
            <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded opacity-0 group-hover/skip:opacity-100 pointer-events-none">10s</span>
          </button>

          <!-- Time Display -->
          <div class="text-xs font-medium font-mono text-gray-200 select-none hidden sm:block tracking-wider">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-4 sm:gap-6">
          <!-- Time Display (Mobile Only) -->
          <div class="text-[10px] font-medium font-mono text-gray-200 select-none sm:hidden">
            {{ formatTime(currentTime) }}
          </div>

          <!-- Volume Group -->
          <div class="flex items-center gap-2 group/volume">
            <button @click="toggleMute" class="hover:text-[#a435f0] transition-colors focus:outline-none w-6 flex justify-center">
              <svg v-if="isMuted || volume == 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
              <svg v-else-if="volume < 0.5" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              v-model="volume"
              @input="changeVolume"
              class="w-0 scale-x-0 hidden sm:block group-hover/volume:w-20 group-hover/volume:scale-x-100 transition-all duration-300 origin-left accent-[#a435f0] h-1.5 bg-gray-600 rounded-full cursor-pointer appearance-none"
            />
          </div>

          <!-- Settings (Playback Speed) -->
          <div class="relative">
            <button @click="showSettings = !showSettings" class="hover:text-white text-gray-300 transition-colors focus:outline-none flex items-center gap-1 font-mono text-xs font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="hidden md:inline">{{ playbackRate }}x</span>
            </button>

            <!-- Settings Menu -->
            <div 
              v-if="showSettings"
              class="absolute bottom-full right-0 mb-4 w-32 bg-[#1c1d1f] border border-gray-700 shadow-2xl py-2 overflow-hidden z-50 rounded"
            >
              <div class="px-3 py-1.5 text-xs font-bold text-gray-400 border-b border-gray-800 uppercase tracking-wider mb-1">Playback Speed</div>
              <button 
                v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]" 
                :key="rate"
                @click="changePlaybackRate(rate)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center justify-between font-medium"
                :class="playbackRate === rate ? 'text-[#a435f0]' : 'text-gray-300'"
              >
                {{ rate }}x
                <svg v-if="playbackRate === rate" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </button>
            </div>
          </div>

          <!-- Fullscreen -->
          <button @click="toggleFullscreen" class="hover:text-white text-gray-300 transition-colors focus:outline-none">
            <svg v-if="!isFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h4v4m0-4l-5 5m15-5h-4v4m0-4l5 5M4 10h4V6m0 4L3 5m15 5h-4V6m0 4l5-5"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Range Slider Styling */
input[type=range] {
  -webkit-appearance: none;
  background: transparent;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 0;
  width: 0;
}
input[type=range]::-moz-range-thumb {
  height: 0;
  width: 0;
  border: none;
}
input[type=range]:focus {
  outline: none;
}

/* Volume slider thumb */
.group\/volume input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #a435f0;
  cursor: pointer;
}
.group\/volume input[type=range]::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #a435f0;
  cursor: pointer;
  border: none;
}
</style>
