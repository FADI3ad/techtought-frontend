<script setup>
  import { ref } from "vue";

  // بيانات المستخدم (يمكنك جلبها من store مثل Pinia)
  const user = ref({
    name: "Sandra",
    avatar: "", // ضع رابط صورة المستخدم هنا
  });

  // مصفوفة الكورسات بنفس هيكل البيانات في صفحتك
  const courseSections = ref([
    {
      id: 1,
      title: "Trending courses",
      subtitle: "We know the best things for You. Top picks for You.",
      courses: [
        {
          id: 101,
          title:
            "Beginner's Guide To Becoming A Professional Frontend Developer",
          instructor: "Robert Martinez",
          rating: 4.8,
          weeks: 10,
          lessons: 24,
          progress: 0,
        },
        {
          id: 102,
          title: "Advanced Vue.js Patterns & Best Practices",
          instructor: "Sarah Ahmed",
          rating: 4.9,
          weeks: 8,
          lessons: 18,
          progress: 30,
        },
        {
          id: 103,
          title: "Mastering Tailwind CSS for Modern UI",
          instructor: "John Doe",
          rating: 4.7,
          weeks: 5,
          lessons: 12,
          progress: 10,
        },
        {
          id: 104,
          title: "Node.js Backend Architecture",
          instructor: "Michael Scott",
          rating: 4.6,
          weeks: 12,
          lessons: 30,
          progress: 0,
        },
      ],
    },
    {
      id: 2,
      title: "Top courses in Computer Fundamentals",
      subtitle: "Strengthen your foundation with these hand-picked courses.",
      courses: [
        {
          id: 201,
          title: "Data Structures & Algorithms in C++",
          instructor: "Robert Martinez",
          rating: 4.8,
          weeks: 14,
          lessons: 40,
          progress: 0,
        },
        {
          id: 202,
          title: "Operating Systems Deep Dive",
          instructor: "Emily Jeff",
          rating: 4.5,
          weeks: 10,
          lessons: 22,
          progress: 0,
        },
        {
          id: 203,
          title: "Database Management Systems (SQL)",
          instructor: "Hamza Malik",
          rating: 4.8,
          weeks: 8,
          lessons: 16,
          progress: 0,
        },
      ],
    },
  ]);
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] pt-24 pb-20">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <header class="flex items-center gap-6 mb-16 animate-fade-in">
        <div
          class="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            class="w-full h-full object-cover" />
          <span v-else class="text-2xl font-bold text-indigo-600">S</span>
        </div>
        <div>
          <h1
            class="text-3xl lg:text-4xl font-extrabold text-black tracking-tighter">
            Welcome back, {{ user.name }}
          </h1>
          <p class="text-gray-500 font-medium">
            Ready to continue your learning journey?
          </p>
        </div>
      </header>

      <div v-for="section in courseSections" :key="section.id" class="mb-16">
        <div class="mb-8">
          <h2
            class="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-2">
            {{ section.title }}
          </h2>
          <p class="text-gray-500">{{ section.subtitle }}</p>
        </div>

        <div class="flex gap-6 overflow-x-auto pb-6 no-scrollbar mask-edge">
          <div
            v-for="course in section.courses"
            :key="course.id"
            class="min-w-[300px] md:min-w-[340px] flex flex-col group cursor-pointer">
            <div
              class="relative overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-md transition-all duration-300">
              <div class="w-full h-44 bg-gray-200 relative">
                <div
                  class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center text-indigo-200 font-bold">
                  Course Preview
                </div>
              </div>

              <div
                class="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
            </div>

            <div class="flex-grow">
              <h3
                class="font-bold text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {{ course.title }}
              </h3>

              <div
                class="flex items-center text-sm text-gray-500 gap-4 mb-4 font-medium">
                <span class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ course.weeks }} weeks
                </span>
                <span class="flex items-center gap-1.5">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  {{ course.lessons }} lessons
                </span>
              </div>

              <div
                class="flex items-center justify-between border-t border-gray-100 pt-4 mb-5">
                <span class="text-sm font-semibold text-gray-800">{{
                  course.instructor
                }}</span>
                <div class="flex items-center gap-1">
                  <span class="text-yellow-400 text-sm">★</span>
                  <span class="text-xs font-bold text-gray-900">{{
                    course.rating
                  }}</span>
                </div>
              </div>
            </div>

            <button
              class="w-full bg-[#3b82f6] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 group/btn">
              Complete Course
              <svg
                class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* لإخفاء الـ Scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* حركة دخول ناعمة */
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* تأثير التدرج في أطراف السكرول لإعطاء انطباع بالاستمرارية */
  .mask-edge {
    mask-image: linear-gradient(to right, black 85%, transparent 100%);
  }
</style>
