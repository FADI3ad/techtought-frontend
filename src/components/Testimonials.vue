<script setup>
  import { ref } from "vue";

  const activeSlide = ref(0);
  const sliderRef = ref(null);

  const handleScroll = (e) => {
    const element = e.target;
    const scrollLeft = element.scrollLeft;
    const width = element.clientWidth;
    activeSlide.value = Math.round(scrollLeft / width);
  };

  const scrollToSlide = (index) => {
    if (sliderRef.value) {
      const width = sliderRef.value.clientWidth;
      sliderRef.value.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
    }
  };

  const reviews = [
    {
      name: "Emily Jeff",
      role: "CEO",
      company: "TheWebagency",
      image: "",
      text: "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.",
      rating: 5,
    },
    {
      name: "Hamza Malik",
      role: "Manager",
      company: "TheWekrtech",
      image: "",
      text: "Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical. Me mr what.",
      rating: 4,
    },
    {
      name: "Elizabeth Rai",
      role: "Developer",
      company: "I2c Company",
      image: "",
      text: "park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.",
      rating: 5,
    },
    {
      name: "Sara Thomas",
      role: "Accountant",
      company: "TheConsturction",
      image: "",
      text: "Concerns greatest margaret him absolute entrance nay. Door neat week do find past he. Be no surprise he honoured.",
      rating: 5,
    },
  ];
</script>

<template>
  <section class="py-24 bg-[#020617] overflow-hidden relative">
    <!-- Glow Effects -->
    <div
      class="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
    <div
      class="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

    <div class="max-w-[1340px] mx-auto px-6 lg:px-10 relative z-10">
      <!-- Section Title -->
      <div class="flex items-center justify-between mb-16 flex-wrap gap-6">
        <div class="w-full lg:w-auto text-center lg:text-left">
          <span
            class="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
            Testimonials
          </span>
          <h2
            class="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
            What our
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
              >students</span
            >
            say
          </h2>
        </div>

        <RouterLink
          to="/reviews"
          class="hidden lg:flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group">
          <span class="font-bold">Show all reviews</span>
          <svg
            class="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>

      <!-- Slider/Grid Container -->
      <div
        ref="sliderRef"
        @scroll="handleScroll"
        class="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory no-scrollbar pb-8 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="min-w-[85vw] md:min-w-[45vw] lg:min-w-0 snap-center group relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden">
          <!-- Card Glow -->
          <div
            class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>

          <!-- User Info -->
          <div class="flex items-center gap-4 mb-8">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-blue-500/20">
              {{ review.name.charAt(0) }}
            </div>

            <div>
              <h4 class="font-bold text-white text-xl">
                {{ review.name }}
              </h4>
              <p class="text-blue-400/60 text-sm font-medium tracking-wide">
                Student
              </p>
            </div>
          </div>

          <!-- Stars -->
          <div class="flex items-center gap-1.5 mb-6">
            <span
              v-for="i in 5"
              :key="i"
              class="text-xl"
              :class="i <= review.rating ? 'text-yellow-400' : 'text-white/10'">
              ★
            </span>
          </div>

          <!-- Review Text -->
          <p
            class="text-slate-300 leading-relaxed text-lg italic font-medium relative z-10">
            "{{ review.text }}"
          </p>

          <!-- Quote Decor -->
          <div
            class="absolute -bottom-4 -right-2 text-[10rem] text-white/5 font-serif select-none pointer-events-none">
            ”
          </div>
        </div>
      </div>

      <!-- Mobile Slider Indicators -->
      <div class="flex lg:hidden justify-center mt-8 gap-3">
        <button
          v-for="(_, index) in reviews"
          :key="index"
          @click="scrollToSlide(index)"
          class="h-2 rounded-full transition-all duration-500"
          :class="
            activeSlide === index
              ? 'w-10 bg-blue-500 shadow-lg shadow-blue-500/50'
              : 'w-2 bg-white/20 hover:bg-white/40'
          ">
        </button>
      </div>

      <!-- Mobile Show All -->
      <div class="mt-12 flex justify-center lg:hidden">
        <RouterLink
          to="/reviews"
          class="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
          <span>Explore All Success Stories</span>
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
