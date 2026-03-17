<script setup>
import { ref, onMounted } from "vue";
import CourseCard from "../components/CourseCard.vue"; // تأكد من المسار
import api from "../api/axios";

// بيانات تجريبية في حال عدم توفر الـ API حالياً لملء الأقسام
const trendingCourses = ref([]);
const fundamentalsCourses = ref([]);

// محاكاة لجلب البيانات من الـ API الخاص بك
async function loadData() {
  try {
    // يمكنك استبدال هذه المسارات بمسارات الـ API الفعلية عندك
    const resTrending = await api.get("categories/trending/courses");
    trendingCourses.value = resTrending.data.data.category.courses;

    const resFundamentals = await api.get("categories/computer-fundamentals/courses");
    fundamentalsCourses.value = resFundamentals.data.data.category.courses;
  } catch (error) {
    console.error("Error loading courses:", error);
    // بيانات احتياطية (Mock Data) للشكل فقط
    const mock = Array(5).fill({
      id: Math.random(),
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      image_path: "https://placehold.co/600x400/1e1e2e/white?text=Course+Image",
    });
    trendingCourses.value = mock;
    fundamentalsCourses.value = mock;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="pt-24 pb-12 bg-gradient-to-b from-[#f8f8ff] to-white">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <div class="flex items-center gap-6">
          <div class="relative">
            <img 
              src="https://placehold.co/100x100?text=S" 
              alt="Sandra" 
              class="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Welcome back, <span class="text-indigo-600">Sandra</span>
            </h1>
            <p class="text-gray-500 mt-1 font-medium">Ready to continue your learning journey?</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1340px] mx-auto px-6 lg:px-10 space-y-20 pb-24">
      
      <section>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Trending courses</h2>
          <p class="text-gray-400 text-sm mt-1">We know the best things for You. Top picks for You.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <CourseCard 
            v-for="course in trendingCourses" 
            :key="course.id" 
            :course="course" 
            class="transform transition-all duration-300 hover:-translate-y-2"
          />
        </div>
      </section>

      <div class="h-px bg-gray-100 w-full"></div>

      <section>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Top courses in Computer Fundamentals</h2>
          <div class="w-20 h-1.5 bg-indigo-600 mt-2 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <CourseCard 
            v-for="course in fundamentalsCourses" 
            :key="course.id" 
            :course="course" 
            class="transform transition-all duration-300 hover:-translate-y-2"
          />
        </div>
      </section>

    </main>

    <footer class="py-10 border-t border-gray-50 text-center">
      <p class="text-gray-400 text-xs font-medium uppercase tracking-widest">
        © 2026 TechTought · Keep Learning
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* إضافة خطوط مخصصة لزيادة الفخامة */
h1, h2 {
  font-family: 'Inter', sans-serif;
}

/* تأثير تنعيم الحركة للكروت */
.grid > * {
  backface-visibility: hidden;
}
</style>