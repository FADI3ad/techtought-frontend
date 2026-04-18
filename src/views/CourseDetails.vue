<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axios";

const route = useRoute();

const course = ref(null);
const loading = ref(true);
const activeTab = ref("overview");
const expandedSection = ref(null);
const enrolled = ref(false);

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "curriculum", label: "Curriculum" },
  { key: "instructor", label: "Instructor" },
  { key: "reviews", label: "Reviews" },
];

async function getCourse() {
  try {
    const slug = route.params.slug;
    const response = await api.get(`/courses/${slug}`);
    course.value = response.data.data.course;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getCourse();
});

function toggleSection(index) {
  expandedSection.value = expandedSection.value === index ? null : index;
}

function handleEnroll() {
  enrolled.value = true;
}

const mockCourse = {
  title: "Complete JavaScript Mastery — From Zero to Hero",
  subtitle:
    "Master modern JavaScript from the ground up. Build real-world projects, understand ES6+, async/await, and land your first dev job.",
  image: "",
  rating: 4.8,
  reviews_count: 3241,
  students_count: 18402,
  last_updated: "March 2026",
  language: "English",
  level: "Beginner to Advanced",
  duration: "42 hours",
  lectures: 312,
  instructor: {
    name: "Adam Watts",
    role: "Senior Front-End Engineer",
    avatar: "",
    bio: "10+ years building products at scale. Taught over 50,000 students worldwide. Passionate about making complex topics simple and practical.",
    rating: 4.9,
    students: 51200,
    courses: 6,
  },
  what_you_learn: [
    "Understand core JavaScript fundamentals deeply",
    "Write modern ES6+ code with confidence",
    "Build real-world apps from scratch",
    "Work with APIs, fetch, and async/await",
    "Master DOM manipulation and events",
    "Understand closures, prototypes & OOP",
    "Use Git and deploy projects to the web",
    "Prepare for technical interviews",
  ],
  requirements: [
    "Basic understanding of HTML & CSS",
    "A computer with an internet connection",
    "No prior JavaScript knowledge needed",
  ],
  sections: [
    {
      title: "Getting Started with JavaScript",
      duration: "2h 14m",
      lectures: [
        { title: "What is JavaScript?", duration: "5:20", preview: true },
        { title: "Setting up your environment", duration: "7:45", preview: true },
        { title: "Your first JavaScript program", duration: "9:10", preview: false },
        { title: "Variables & Data Types", duration: "14:30", preview: false },
      ],
    },
    {
      title: "Control Flow & Functions",
      duration: "3h 40m",
      lectures: [
        { title: "If statements and conditions", duration: "11:00", preview: false },
        { title: "Loops: for, while, do-while", duration: "16:20", preview: false },
        { title: "Functions: declaration vs expression", duration: "18:45", preview: false },
        { title: "Arrow functions & scope", duration: "14:00", preview: false },
      ],
    },
    {
      title: "Working with the DOM",
      duration: "4h 10m",
      lectures: [
        { title: "What is the DOM?", duration: "8:00", preview: true },
        { title: "Selecting & modifying elements", duration: "19:30", preview: false },
        { title: "Event listeners & delegation", duration: "22:15", preview: false },
      ],
    },
    {
      title: "Async JavaScript & APIs",
      duration: "5h 00m",
      lectures: [
        { title: "Callbacks and the event loop", duration: "17:00", preview: false },
        { title: "Promises in depth", duration: "21:30", preview: false },
        { title: "Async / Await syntax", duration: "15:45", preview: false },
        { title: "Fetching data from REST APIs", duration: "24:10", preview: false },
      ],
    },
  ],
  reviews: [
    {
      name: "Sarah K.",
      role: "Junior Developer",
      rating: 5,
      text: "Best JavaScript course out there. Adam explains everything so clearly. I went from knowing nothing to building full projects in 3 months.",
    },
    {
      name: "Michael B.",
      role: "Career Changer",
      rating: 5,
      text: "The curriculum is incredibly well structured. Every section builds on the last. I finally understand async JavaScript after struggling with it for years.",
    },
    {
      name: "Lena M.",
      role: "Computer Science Student",
      rating: 4,
      text: "Great depth of content. A few sections felt slightly slow but overall this is a must-take course for any serious developer.",
    },
    {
      name: "Omar F.",
      role: "Freelance Designer",
      rating: 5,
      text: "I now add JavaScript interactivity to all my design projects. This course changed how I approach client work entirely.",
    },
  ],
};
</script>

<template>
  <div class="overflow-hidden">

    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-r from-white via-[#efefff] to-[#0800FF] overflow-hidden">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10 py-16 flex flex-col lg:flex-row gap-12 items-start">

        <!-- Left: Course Info -->
        <div class="flex-1 z-10">
          <div class="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200 text-xs font-semibold text-indigo-700 px-3 py-1.5 rounded-full mb-5">
            <span class="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            {{ mockCourse.level }}
          </div>

          <h1 class="text-3xl lg:text-5xl font-extrabold text-black tracking-tighter leading-tight mb-4">
            {{ mockCourse.title }}
          </h1>

          <p class="text-gray-700 text-lg leading-relaxed max-w-2xl mb-6">
            {{ mockCourse.subtitle }}
          </p>

          <!-- Stars + Meta -->
          <div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div class="flex items-center gap-1.5">
              <div class="flex">
                <span v-for="s in 5" :key="s" class="text-yellow-400 text-base">★</span>
              </div>
              <span class="font-bold text-gray-900">{{ mockCourse.rating }}</span>
              <span class="text-gray-500">({{ mockCourse.reviews_count.toLocaleString() }} reviews)</span>
            </div>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600">{{ mockCourse.students_count.toLocaleString() }} students</span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-600">{{ mockCourse.duration }} total</span>
          </div>

          <div class="flex items-center gap-3 text-sm text-gray-600 mb-8">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                {{ mockCourse.instructor.name.split(' ').map(n => n[0]).join('') }}
              </div>
              <span>Created by <a href="#" class="text-blue-600 font-medium hover:underline">{{ mockCourse.instructor.name }}</a></span>
            </div>
            <span class="text-gray-300">|</span>
            <span>Last updated {{ mockCourse.last_updated }}</span>
            <span class="text-gray-300">|</span>
            <span>{{ mockCourse.language }}</span>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap items-center gap-4">
            <button
              @click="handleEnroll"
              :class="enrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'"
              class="text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-black/20 flex items-center gap-2">
              <svg v-if="enrolled" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {{ enrolled ? 'Enrolled!' : 'Enroll Now — Free' }}
            </button>
            <button class="border-2 border-black text-black px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all">
              Preview Course
            </button>
          </div>
        </div>

        <!-- Right: Video Thumbnail Card -->
        <div class="w-full lg:w-[380px] flex-shrink-0 z-10">
          <div class="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            <div class="relative h-52 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
              <button class="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div class="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Preview
              </div>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Duration</span>
                <span class="font-semibold text-gray-900">{{ mockCourse.duration }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Lectures</span>
                <span class="font-semibold text-gray-900">{{ mockCourse.lectures }} lessons</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Level</span>
                <span class="font-semibold text-gray-900">{{ mockCourse.level }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Language</span>
                <span class="font-semibold text-gray-900">{{ mockCourse.language }}</span>
              </div>
              <div class="pt-2 border-t border-gray-100">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Certificate</span>
                  <span class="text-green-600 font-semibold flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sticky Nav Tabs -->
    <div class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div class="flex gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="pb-4 pt-4 text-base font-medium transition-all duration-300 relative"
            :class="activeTab === tab.key
              ? 'text-black border-b-2 border-black'
              : 'text-gray-400 hover:text-gray-600'">
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="py-16 bg-white">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 space-y-12">

            <!-- What You'll Learn -->
            <div>
              <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-6">
                What you'll learn
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="(item, i) in mockCourse.what_you_learn"
                  :key="i"
                  class="flex items-start gap-3 text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div>
              <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-6">
                Requirements
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="(req, i) in mockCourse.requirements"
                  :key="i"
                  class="flex items-start gap-3 text-sm text-gray-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2"></span>
                  {{ req }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Stats Sidebar -->
          <div class="space-y-6">
            <div class="bg-[#f9fafb] rounded-2xl p-6 space-y-4">
              <h3 class="font-bold text-gray-900 text-base">Course includes</h3>
              <div class="space-y-3">
                <div v-for="(stat, i) in [
                  { icon: '▶', label: mockCourse.duration + ' on-demand video' },
                  { icon: '⬇', label: 'Downloadable resources' },
                  { icon: '∞', label: 'Full lifetime access' },
                  { icon: '📱', label: 'Access on mobile & desktop' },
                  { icon: '🏆', label: 'Certificate of completion' },
                ]" :key="i" class="flex items-center gap-3 text-sm text-gray-600">
                  <span class="text-base w-5 text-center">{{ stat.icon }}</span>
                  <span>{{ stat.label }}</span>
                </div>
              </div>
            </div>

            <!-- Share / Save -->
            <div class="flex gap-3">
              <button class="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-xl hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save
              </button>
              <button class="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-3 rounded-xl hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Curriculum Tab -->
        <div v-if="activeTab === 'curriculum'" class="max-w-3xl">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Course Content
            </h2>
            <span class="text-sm text-gray-500">{{ mockCourse.sections.length }} sections • {{ mockCourse.lectures }} lectures • {{ mockCourse.duration }}</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(section, si) in mockCourse.sections"
              :key="si"
              class="border border-gray-200 rounded-2xl overflow-hidden">

              <!-- Section Header -->
              <button
                @click="toggleSection(si)"
                class="w-full flex items-center justify-between px-6 py-4 bg-[#f9fafb] hover:bg-gray-100 transition-colors text-left">
                <div class="flex items-center gap-4">
                  <div
                    :class="expandedSection === si ? 'rotate-90' : ''"
                    class="transition-transform duration-300 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-900 text-sm">{{ section.title }}</span>
                </div>
                <span class="text-xs text-gray-400 flex-shrink-0">{{ section.lectures.length }} lectures • {{ section.duration }}</span>
              </button>

              <!-- Lectures List -->
              <transition name="expand">
                <div v-if="expandedSection === si" class="divide-y divide-gray-100">
                  <div
                    v-for="(lecture, li) in section.lectures"
                    :key="li"
                    class="flex items-center justify-between px-6 py-3.5 hover:bg-indigo-50/40 transition-colors">
                    <div class="flex items-center gap-3">
                      <div :class="lecture.preview ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'" class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-700">{{ lecture.title }}</span>
                      <span v-if="lecture.preview" class="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Preview</span>
                    </div>
                    <span class="text-xs text-gray-400 flex-shrink-0 ml-4">{{ lecture.duration }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Instructor Tab -->
        <div v-if="activeTab === 'instructor'" class="max-w-3xl">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-10">
            About the Instructor
          </h2>
          <div class="flex flex-col sm:flex-row gap-8 items-start">
            <div class="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 flex-shrink-0">
              {{ mockCourse.instructor.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900">{{ mockCourse.instructor.name }}</h3>
              <p class="text-blue-600 text-sm font-medium mt-1 mb-4">{{ mockCourse.instructor.role }}</p>
              <div class="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400">★</span>
                  <span>{{ mockCourse.instructor.rating }} Instructor Rating</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ mockCourse.instructor.students.toLocaleString() }} Students</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{{ mockCourse.instructor.courses }} Courses</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed">{{ mockCourse.instructor.bio }}</p>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'">
          <div class="flex items-center justify-between mb-10">
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Student Reviews
            </h2>
            <div class="flex items-center gap-3">
              <div class="text-5xl font-extrabold text-gray-900 tracking-tighter">{{ mockCourse.rating }}</div>
              <div>
                <div class="flex">
                  <span v-for="s in 5" :key="s" class="text-yellow-400 text-lg">★</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">Course Rating</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div
              v-for="(review, index) in mockCourse.reviews"
              :key="index"
              class="flex flex-col h-full">
              <div class="bg-[#f3f4f6] p-6 rounded-t-[1.5rem] flex items-center gap-4">
                <div class="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 flex-shrink-0">
                  {{ review.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm lg:text-base">{{ review.name }}</h4>
                  <p class="text-xs text-gray-400 font-medium">{{ review.role }}</p>
                </div>
              </div>
              <div class="bg-white p-6 pt-10 rounded-b-[1.5rem] shadow-sm flex-grow relative">
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-md flex gap-1">
                  <span v-for="star in 5" :key="star" class="text-yellow-400 text-sm">★</span>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed text-center">{{ review.text }}</p>
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
              <a href="#" class="inline-flex items-center text-[#3b82f6] font-bold hover:underline">
                show all reviews
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 pt-16 pb-8">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div class="space-y-6">
            <div class="text-3xl font-bold tracking-tight text-black">LOGO</div>
            <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
              TechTought is a leading platform for mastering modern technology. We help developers build a strong foundation and scale their careers.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.493-1.1-1.109 0-.616.493-1.109 1.1-1.109.617 0 1.1.493 1.1 1.109 0 .616-.483 1.109-1.1 1.109zm8 6.891h-1.999v-2.846c0-.723-.014-1.653-1.007-1.653-1.009 0-1.163.788-1.163 1.602v2.897h-1.999v-6h1.919v.819h.029c.268-.507.92-1.042 1.896-1.042 2.029 0 2.404 1.335 2.404 3.071v3.152z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" class="hover:text-blue-600 transition-colors">Courses</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Learning Paths</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Mentorship</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
            <ul class="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" class="hover:text-blue-600 transition-colors">Community</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" class="hover:text-blue-600 transition-colors">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Join our newsletter</h4>
            <p class="text-gray-500 text-sm mb-4">Get the latest updates and resources directly in your inbox.</p>
            <div class="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
              <button class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-xs">© 2026 TechTought Inc. All rights reserved.</p>
          <div class="flex gap-8">
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900">Privacy Policy</a>
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900">Terms of Service</a>
            <a href="#" class="text-gray-400 text-xs hover:text-gray-900">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 800px;
  opacity: 1;
}
</style>