<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";

  import nodeIcon from "../assets/images/cpp.png";
  import reactIcon from "../assets/images/flutter.png";
  import mongoIcon from "../assets/images/js.png";
  import api from "../api/axios";
  import CourseCard from "../components/CourseCard.vue";
  import Footer from "../components/Footer.vue";

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

    getCategories();
  });
  onUnmounted(() => {
    clearInterval(interval);
  });

  const tabs = ref([]);
  const category = ref(null);
  const courses = ref([]);
  const activeTab = ref(null);

  async function getCategories() {
    try {
      const response = await api.get("/categories");
      tabs.value = response.data.data.categories;
      if (tabs.value.length) {
        selectCategory(tabs.value[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getCategoryCoursesAndImages(slug) {
    try {
      const response = await api.get(`categories/${slug}/courses`);
      category.value = response.data.data.category;
      courses.value = response.data.data.category.courses;
    } catch (error) {
      console.error(error);
    }
  }

  function selectCategory(tab) {
    activeTab.value = tab.slug;
    getCategoryCoursesAndImages(tab.slug);
  }

  const initialCode = `int sum(int a, int b) {
    return a + b;`;

  const userCode = ref(initialCode);
  const status = ref("idle");

  const checkCode = () => {
    const trimmedCode = userCode.value.trim();

    if (trimmedCode.endsWith("}")) {
      status.value = "success";
    } else {
      status.value = "error";

      setTimeout(() => {
        if (status.value === "error") status.value = "idle";
      }, 2000);
    }
  };

  const reviews = [
    {
      name: "Emily Jeff",
      role: "CEO",
      company: "TheWebagency",
      image: "",
      text: "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.",
    },
    {
      name: "Hamza Malik",
      role: "Manager",
      company: "TheWekrtech",
      image: "",
      text: "Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical. Me mr what.",
    },
    {
      name: "Elizabeth Rai",
      role: "Developer",
      company: "I2c Company",
      image: "",
      text: "park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.",
    },
    {
      name: "Sara Thomas",
      role: "Accountant",
      company: "TheConsturction",
      image: "",
      text: "Concerns greatest margaret him absolute entrance nay. Door neat week do find past he. Be no surprise he honoured.",
    },
  ];
</script>
<template>
  <div class="overflow-hidden">
    <!-- Hero  -->
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

    <!-- courses -->
    <section class="py-16 bg-white">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div class="mb-10">
          <h2
            class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            Skills to transform your career and life
          </h2>
          <p class="text-gray-600 text-lg">
            From critical skills to technical topics, TechTought supports your
            professional development.
          </p>
        </div>

        <div class="flex flex-wrap border-b border-gray-200 mb-12 gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectCategory(tab)"
            class="pb-4 text-lg font-medium transition-all duration-300 relative"
            :class="
              activeTab === tab.slug
                ? 'text-black border-b-2 border-black'
                : 'text-gray-400 hover:text-gray-600'
            ">
            {{ tab.name }}
          </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-10 items-start">
          <div class="w-full lg:w-1/3 flex justify-center">
            <div class="grid grid-cols-2 gap-2">
              <template v-if="category?.image">
                <div class="col-span-2 h-[400px] rounded-lg overflow-hidden">
                  <img
                    :src="category.image"
                    :alt="category.name"
                    class="w-full h-full object-cover object-center" />
                </div>
              </template>
            </div>
          </div>

          <div
            class="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard
              v-for="course in courses"
              :key="course.id"
              :course="course" />
          </div>
        </div>

        <div class="mt-12 text-center lg:text-left">
          <a
            href="#"
            class="inline-flex items-center text-[#3b82f6] font-bold hover:underline">
            show all courses
            <svg
              class="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-[#f9fafb]">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10 text-center">
        <div class="max-w-2xl mx-auto mb-16">
          <h2
            class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            Everything you need
          </h2>
          <p class="text-gray-600 text-lg">
            Enjoy customizable lists, team work tools, and smart tracking all in
            one place. Set tasks, get reminders, and see your progress simply
            and quickly.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-10 transition-shadow flex flex-col items-center">
            <div class="w-24 h-24 mb-6 flex items-center justify-center">
              <img
                src="../assets/images/main3.png"
                alt="Instructours Icon"
                class="max-w-full max-h-full object-contain" />
            </div>
            <h3 class="text-xl font-bold text-black mb-4">instructours</h3>
            <p class="text-gray-500 leading-relaxed text-sm lg:text-base">
              Enhance your productivity by connecting with your favorite tools,
              keeping all your essentials in one place.
            </p>
          </div>

          <div class="p-10 transition-shadow flex flex-col items-center">
            <div class="w-24 h-24 mb-6 flex items-center justify-center">
              <img
                src="../assets/images/main.png"
                alt="Courses Icon"
                class="max-w-full max-h-full object-contain" />
            </div>
            <h3 class="text-xl font-bold text-black mb-4">
              Courses at any track
            </h3>
            <p class="text-gray-500 leading-relaxed text-sm lg:text-base">
              Define and track your goals, breaking down objectives into
              achievable tasks to keep your targets in sight.
            </p>
          </div>

          <div class="p-10 transition-shadow flex flex-col items-center">
            <div class="w-24 h-24 mb-6 flex items-center justify-center">
              <img
                src="../assets/images/main2.png"
                alt="Todo Icon"
                class="max-w-full max-h-full object-contain" />
            </div>
            <h3 class="text-xl font-bold text-black mb-4">Todo list</h3>
            <p class="text-gray-500 leading-relaxed text-sm lg:text-base">
              With end-to-end encryption, your data is securely stored and
              protected from unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Tasks Section -->
    <section class="py-24 bg-[#0f172a] overflow-hidden relative">
      <!-- تأثيرات إضاءة خلفية (Glow Effects) لإعطاء عمق للمكان -->
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div
        class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        <!-- Left Content -->
        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <span
            class="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
            Interactive Learning
          </span>
          <h2
            class="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
            Daily
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"
              >Coding</span
            >
            Tasks
          </h2>

          <p
            class="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
            Master logic through daily challenges. Write your code in the
            sandbox, test your knowledge, and level up your engineering skills.
          </p>

          <div
            class="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <button
              @click="checkCode"
              class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center gap-3 group">
              <span>Run Code</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            <!-- Dynamic Status Message -->
            <div class="h-12 flex items-center">
              <transition name="fade">
                <p
                  v-if="status === 'success'"
                  class="text-emerald-400 font-bold flex items-center gap-2 px-6 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 backdrop-blur-md">
                  <span class="text-xl">✨</span> Brilliant! Correct Logic.
                </p>
                <p
                  v-else-if="status === 'error'"
                  class="text-rose-400 font-bold flex items-center gap-2 px-6 py-3 bg-rose-500/10 rounded-xl border border-rose-500/20 backdrop-blur-md">
                  <span class="text-xl">⚠️</span> Check your brackets!
                </p>
              </transition>
            </div>
          </div>
        </div>

        <!-- Right Side: Professional Code Editor -->
        <div class="w-full lg:w-1/2 relative group">
          <!-- البرواز المضيء حول المحرر -->
          <div
            class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.1rem] opacity-20 group-hover:opacity-40 blur transition duration-1000"></div>

          <div
            class="relative w-full max-w-[580px] bg-[#020617] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5">
            <!-- Editor Toolbar -->
            <div
              class="bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div class="flex gap-2">
                <div
                  class="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner"></div>
                <div
                  class="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                <div
                  class="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner"></div>
              </div>
              <div
                class="bg-white/5 px-3 py-1 rounded-md border border-white/10">
                <span class="text-blue-400 text-xs font-mono font-medium"
                  >solution.cpp</span
                >
              </div>
            </div>

            <!-- Textarea & Line Numbers -->
            <div class="flex bg-transparent">
              <div
                class="w-12 pt-8 text-right pr-4 select-none text-slate-700 font-mono text-sm border-r border-white/5">
                1<br />2<br />3<br />4<br />5<br />6
              </div>

              <div class="relative flex-1">
                <textarea
                  v-model="userCode"
                  class="w-full h-[320px] bg-transparent text-blue-50 p-8 font-mono text-base outline-none resize-none leading-relaxed caret-blue-500 selection:bg-blue-500/30"
                  spellcheck="false"></textarea>

                <!-- Success Overlay -->
                <transition name="fade">
                  <div
                    v-if="status === 'success'"
                    class="absolute inset-0 bg-emerald-500/5 pointer-events-none border-l-4 border-emerald-500 transition-all duration-500"></div>
                </transition>
              </div>
            </div>

            <!-- Footer Bar -->
            <div
              class="bg-slate-900/80 px-6 py-3 flex justify-end gap-6 text-[11px] text-slate-500 font-mono border-t border-white/5">
              <div class="flex items-center gap-1">
                <span
                  class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Live Compiler
              </div>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
  <section class="py-20 bg-[#f9fafb] overflow-hidden">
  <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
    <!-- Section Title -->
    <div class="flex items-center justify-between mb-12 flex-wrap gap-4">
      <div>
        <p class="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          Testimonials
        </p>

        <h2
          class="text-3xl lg:text-5xl font-bold text-[#0f172a] leading-tight">
          What our students say
        </h2>
      </div>

      <RouterLink
        to="/reviews"
        class="hidden lg:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300">
        Show all reviews

        <svg
          class="w-4 h-4"
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

    <!-- Reviews -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(review, index) in reviews"
        :key="index"
        class="group relative bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

        <!-- Top Glow -->
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400">
        </div>

        <!-- User -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Avatar -->
          <div
            class="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            {{ review.name.charAt(0) }}
          </div>

          <div>
            <h4 class="font-bold text-[#0f172a] text-lg">
              {{ review.name }}
            </h4>

            <p class="text-sm text-gray-500">
              Student
            </p>
          </div>
        </div>

        <!-- Stars -->
        <div class="flex items-center gap-1 mb-5">
          <span
            v-for="star in review.rating"
            :key="star"
            class="text-yellow-400 text-lg">
            ★
          </span>
        </div>

        <!-- Review -->
        <p class="text-gray-600 leading-7 text-sm">
          {{ review.text }}
        </p>

        <!-- Quote Icon -->
        <div
          class="absolute bottom-5 right-5 text-6xl text-gray-100 font-serif pointer-events-none">
          ”
        </div>
      </div>
    </div>

    <!-- Slider Indicators -->
    <div
      v-if="reviews.length > 4"
      class="hidden lg:flex justify-center mt-12 gap-3">

      <button
        v-for="(_, index) in Math.ceil(reviews.length / 4)"
        :key="index"
        class="w-12 h-2 rounded-full transition-all duration-300"
        :class="
          activeSlide === index
            ? 'bg-blue-600'
            : 'bg-blue-100 hover:bg-blue-300'
        ">
      </button>
    </div>

    <!-- Mobile Indicators -->
    <div
      v-if="reviews.length > 1"
      class="flex lg:hidden justify-center mt-10 gap-2">

      <button
        v-for="(_, index) in reviews"
        :key="index"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="
          activeSlide === index
            ? 'bg-blue-600 scale-110'
            : 'bg-blue-200'
        ">
      </button>
    </div>

    <!-- Mobile Show All -->
    <div class="mt-10 flex justify-center lg:hidden">
      <RouterLink
        to="/reviews"
        class="inline-flex items-center gap-2 text-blue-600 font-semibold">
        Show all reviews

        <svg
          class="w-4 h-4"
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
  </div>
</section>
    <Footer />
  </div>
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
  textarea {
    tab-size: 2;
    caret-color: #ffffff;
  }

  textarea::selection {
    background: rgba(255, 255, 255, 0.1);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
