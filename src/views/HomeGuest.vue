<script setup>
  import { ref, computed, onMounted, onUnmounted } from "vue";

  import nodeIcon from "../assets/images/cpp.png";
  import reactIcon from "../assets/images/flutter.png";
  import mongoIcon from "../assets/images/js.png";
  import api from "../api/axios";
  import CourseCard from "../components/CourseCard.vue";

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
      const response = await api.get("/categories/navbar");
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
      class="relative pt-32 pb-0 bg-gradient-to-r from-white via-[#efefff] to-[#0800FF] overflow-hidden ">
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
            <div
              class="relative w-[280px] h-[580px] border-[8px] border-black rounded-[3rem] shadow-2xl overflow-hidden bg-white">
              <div class="p-4">
                <div class="w-12 h-1 bg-gray-200 mx-auto mb-6 rounded"></div>
                <div class="bg-indigo-50 p-4 rounded-2xl mb-4">
                  <p class="text-[10px] font-bold text-indigo-600 uppercase">
                    Updates this week
                  </p>
                  <h4 class="text-sm font-bold mt-1">
                    Ultimate collection for creativity & productivity
                  </h4>
                  <button
                    class="mt-3 bg-white text-[10px] px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    Subscribe for Free
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
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

    <!-- Daily Tasks -->
    <section class="py-20 bg-white">
      <div
        class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <h2
            class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight drop-shadow-sm">
            Daily Tasks
          </h2>
          <p
            class="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias
            exercitationem natus quasi ullam nostrum odio praesentium iste
            suscipit voluptate aliquam. Excepturi ex quibusdam dolorum
            praesentium soluta tempora fugit numquam ipsum! Temporibus sequi
          </p>

          <div class="flex items-center justify-center lg:justify-start gap-4">
            <button
              @click="checkCode"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
              Run Code
            </button>
            <p
              v-if="status === 'success'"
              class="text-green-600 font-bold animate-bounce">
              Excellent!
            </p>
            <p v-if="status === 'error'" class="text-red-500 font-bold">
              Try again!
            </p>
          </div>
        </div>

        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div
            class="w-full max-w-[550px] bg-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div
              class="bg-[#252539] px-4 py-3 flex items-center justify-between">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span class="text-gray-400 text-xs font-mono">index.tsx</span>
            </div>

            <div class="relative">
              <textarea
                v-model="userCode"
                @keydown.enter.prevent="checkCode"
                class="w-full h-[300px] bg-transparent text-[#c3e88d] p-6 font-mono text-sm outline-none resize-none leading-relaxed"
                spellcheck="false"></textarea>

              <div
                v-if="status === 'success'"
                class="absolute inset-0 bg-green-500/10 pointer-events-none border-2 border-green-500 rounded-b-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section class="py-20 bg-[#f9fafb]">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <h2
          class="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-2 flex items-center justify-center mb-12">
          Best TechTaught user reviews!
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            v-for="(review, index) in reviews"
            :key="index"
            class="flex flex-col h-full">
            <div
              class="bg-[#f3f4f6] p-6 rounded-t-[1.5rem] flex items-center gap-4">
              <div
                class="w-16 h-16 rounded-xl overflow-hidden bg-gray-300 flex-shrink-0">
                <img :src="review.image" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-sm lg:text-base">
                  {{ review.name }}
                </h4>
                <p class="text-xs text-gray-500">{{ review.role }}</p>
                <p class="text-xs text-gray-400 font-medium">
                  {{ review.company }}
                </p>
              </div>
            </div>

            <div
              class="bg-white p-6 pt-10 rounded-b-[1.5rem] shadow-sm flex-grow relative">
              <div
                class="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-md flex gap-1">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-yellow-400 text-sm"
                  >★</span
                >
              </div>

              <p class="text-gray-600 text-sm leading-relaxed text-center">
                {{ review.text }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-10">
          <div class="flex gap-2">
            <span class="w-10 h-1.5 rounded-full bg-blue-200"></span>
            <span class="w-10 h-1.5 rounded-full bg-blue-500"></span>
            <span class="w-10 h-1.5 rounded-full bg-blue-200"></span>
            <span class="w-10 h-1.5 rounded-full bg-blue-200"></span>
          </div>

          <div class="w-full text-left">
            <a
              href="#"
              class="inline-flex items-center text-[#3b82f6] font-bold hover:underline">
              show all reviews
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
      </div>
    </section>

    <footer class="bg-white border-t border-gray-100 pt-16 pb-8">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div class="space-y-6">
            <div class="text-3xl font-bold tracking-tight text-black">LOGO</div>
            <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
              TechTought is a leading platform for mastering modern technology.
              We help developers build a strong foundation and scale their
              careers.
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.109 0-.616.493-1.109 1.1-1.109.617 0 1.1.493 1.1 1.109 0 .616-.483 1.109-1.1 1.109zm8 6.891h-1.999v-2.846c0-.723-.014-1.653-1.007-1.653-1.009 0-1.163.788-1.163 1.602v2.897h-1.999v-6h1.919v.819h.029c.268-.507.92-1.042 1.896-1.042 2.029 0 2.404 1.335 2.404 3.071v3.152z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4
              class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">
              Platform
            </h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Courses</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Learning Paths</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Mentorship</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Pricing</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4
              class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">
              Resources
            </h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Community</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Blog</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Documentation</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-600 transition-colors"
                  >Help Center</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h4
              class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">
              Join our newsletter
            </h4>
            <p class="text-gray-500 text-sm mb-4">
              Get the latest updates and resources directly in your inbox.
            </p>
            <form class="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
              <button
                class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div
          class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-xs">
            © 2026 TechTought Inc. All rights reserved.
          </p>
          <div class="flex gap-8">
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900"
              >Privacy Policy</a
            >
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900"
              >Terms of Service</a
            >
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900"
              >Cookies Settings</a
            >
          </div>
        </div>
      </div>
    </footer>
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
</style>
