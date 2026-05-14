<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";
  import nodeIcon from "../assets/images/cpp.png";
  import reactIcon from "../assets/images/flutter.png";
  import mongoIcon from "../assets/images/js.png";

  const iconData = [
    { img: nodeIcon, label: "Node.js" },
    { img: reactIcon, label: "React" },
    { img: mongoIcon, label: "MongoDB" },
    { img: nodeIcon, label: "Node.js" },
    { img: reactIcon, label: "React" },
    { img: mongoIcon, label: "MongoDB" },
    { img: nodeIcon, label: "Node.js" },
    { img: reactIcon, label: "React" },
    { img: mongoIcon, label: "MongoDB" },
    { img: nodeIcon, label: "Node.js" },
    { img: reactIcon, label: "React" },
    { img: mongoIcon, label: "MongoDB" },
  ];

  const rotation = ref(0);
  const viewBox = 250;
  const containerSize = 400;
  const scale = containerSize / viewBox;
  const R = 110;
  const cx = 130;
  const cy = 130;

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

  let interval;
  onMounted(() => {
    interval = setInterval(() => {
      rotation.value += 0.5;
    }, 20);
  });
  onUnmounted(() => {
    clearInterval(interval);
  });
</script>

<template>
  <section
    class="relative pt-32 pb-0 bg-gradient-to-r from-white via-[#efefff] to-[#0800FF] overflow-hidden">
    <div
      class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-start justify-between">
      <div class="flex-1 z-10 text-center lg:text-left lg:mb-0">
        <h2
          class="text-4xl lg:text-5xl font-extrabold text-black tracking-tighter leading-tight mb-2">
          Build A Strong Web Foundation
        </h2>

        <p
          class="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Start from the basics and grow your skills step by step to become a
          confident web developer.
        </p>
      </div>
      <div
        class="relative w-[350px] h-[350px] lg:w-[500px] lg:h-[200px] flex items-start justify-center lg:mt-0">
        <div class="relative w-[400px] h-[400px] masked-container">
          <svg class="w-full h-full" viewBox="0 0 250 250">
            <circle
              cx="130"
              cy="130"
              r="110"
              class="stroke-black fill-none"
              stroke-width="4" />
            <circle
              cx="130"
              cy="130"
              r="85"
              class="stroke-black fill-none"
              stroke-width="4" />
          </svg>

          <div
            v-for="(icon, i) in iconPositions"
            :key="i"
            class="absolute w-16 h-16 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            :style="{
              left: icon.x + 'px',
              top: icon.y + 'px',
              zIndex: 20,
              marginTop: '22px',
            }">
            <img
              :src="icon.img"
              :alt="icon.label"
              class="w-full h-full object-contain drop-shadow-lg" />
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
