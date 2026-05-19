<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import cppIcon from "../../assets/images/cplusplus.svg";
  import dockerIcon from "../../assets/images/docker.svg";
  import flutterIcon from "../../assets/images/flutter.svg";
  import gitIcon from "../../assets/images/git.svg";
  import laravelIcon from "../../assets/images/laravel.svg";
  import nodeIcon from "../../assets/images/nodejs.svg";
  import pythonIcon from "../../assets/images/python.svg";
  import reactIcon from "../../assets/images/react.svg";
  import vueIcon from "../../assets/images/vue.svg";
  import mainIcon from "../../assets/images/postgresql.svg";
  import main2Icon from "../../assets/images/spring.svg";
  import main3Icon from "../../assets/images/angular.svg";

  const iconData = [
    { img: cppIcon, label: "C++" },
    { img: dockerIcon, label: "Docker" },
    { img: flutterIcon, label: "Flutter" },
    { img: gitIcon, label: "Git" },
    { img: laravelIcon, label: "Laravel" },
    { img: nodeIcon, label: "Node.js" },
    { img: pythonIcon, label: "Python" },
    { img: reactIcon, label: "React" },
    { img: vueIcon, label: "Vue" },
    { img: mainIcon, label: "PostgreSQL" },
    { img: main2Icon, label: "Spring Boot" },
    { img: main3Icon, label: "Angular" },
  ];

  const rotation = ref(0);

  const viewBox = 320;
  const containerSize = 512;
  const scale = containerSize / viewBox;
  const R = 141;
  const cx = 166;
  const cy = 166;

  const speed = ref(0.5);
  const targetSpeed = ref(0.5);

  const iconPositions = computed(() => {
    return iconData.map((item, i) => {
      const angleDeg = i * (360 / iconData.length) + rotation.value;
      const angleRad = (angleDeg * Math.PI) / 180;
      return {
        ...item,
        x: (cx + R * Math.cos(angleRad)) * scale,
        y: (cy + R * Math.sin(angleRad)) * scale,
      };
    });
  });

  const EASE = 0.04;

  let interval;
  onMounted(() => {
    interval = setInterval(() => {
      speed.value += (targetSpeed.value - speed.value) * EASE;
      rotation.value += speed.value;
    }, 20);
  });
  onUnmounted(() => {
    clearInterval(interval);
  });

  function onMouseEnter() {
    targetSpeed.value = 0;
  }

  function onMouseLeave() {
    targetSpeed.value = 0.5;
  }
</script>

<template>
  <section
    class="relative pt-48 pb-24 bg-gradient-to-r from-white via-[#b3eeff] via-[#61DAFB] to-[#0800FF] overflow-hidden">
    <div
      class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-start justify-between">
      <div
        class="flex-1 z-10 text-center lg:text-left lg:mb-0 mb-20 lg:-translate-y-10">
        <h1
          class="text-4xl sm:text-5xl lg:text-5xl font-black text-gray-900 tracking-tight mb-5 leading-tight"
          style="text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25)">
          Build a Powerful Computer Science - Foundation !
        </h1>
        <p
          class="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed"
          style="text-shadow: 0 2px 10px rgba(0, 0, 0, 0.18)">
          Start from the basics and grow step by step into a confident
          <br />
          CS student.
        </p>
      </div>

      <div
        class="relative w-[450px] h-[380px] lg:w-[512px] lg:h-[100px] flex items-start justify-center lg:mt-5">
        <div
          class="relative w-[712px] h-[512px] masked-container"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave">
          <svg class="w-full h-full" :viewBox="`0 0 ${viewBox} ${viewBox}`">
            <circle
              :cx="cx"
              :cy="cy"
              :r="R"
              class="stroke-black fill-none"
              stroke-width="5" />
            <circle
              :cx="cx"
              :cy="cy"
              :r="R * 0.773"
              class="stroke-black fill-none"
              stroke-width="5" />
          </svg>

          <div
            v-for="(icon, i) in iconPositions"
            :key="i"
            class="absolute w-24 h-24 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group/icon"
            :style="{
              left: icon.x + 'px',
              top: icon.y + 'px',
              zIndex: 20,
              marginTop: '22px',
            }">
            <!-- Label Tooltip -->
            <span
              class="absolute -top-8 px-2.5 py-1 text-[11px] font-bold text-white bg-gray-900/90 rounded-md border border-white/10 opacity-0 group-hover/icon:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-md translate-y-1 group-hover/icon:-translate-y-0 z-30">
              {{ icon.label }}
            </span>

            <!-- White Badge Frame -->
            <div
              class="w-24 h-24 p-2.5 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
              <img
                :src="icon.img"
                :alt="icon.label"
                class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .masked-container {
    -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 50%);
    mask-image: linear-gradient(to bottom, black 50%, transparent 50%);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
</style>
.
