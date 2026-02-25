<template>
  <div class="my-learning">
    <Header />
    
    <main class="main-content">
      <div class="container">
        <CourseSection 
          title="My favorait courses"
          subtitle="We know the best things for You. Top picks for You."
          :courses="favoriteCourses"
        />

        <CourseSection 
          subtitle="We know the best things for You. Top picks for You."
          :courses="section2Courses"
        />

        <CourseSection 
          subtitle="We know the best things for You. Top picks for You."
          :courses="section3Courses"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../components/Header.vue'
import CourseSection from '../components/CourseSection.vue'

const allCourses = ref([
  { id: 1, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 24, instructorName: "Robert Martinez", instructorImage: "/img3.jpg", rating: 4.8, cardType: "blue", section: 1 },
  { id: 2, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img2.jpg", rating: 4.8, cardType: "yellow", section: 1 },
  { id: 3, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img1.jpg", rating: 4.8, cardType: "yellow", section: 1 },
  { id: 4, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img3.jpg", rating: 4.8, cardType: "blue", section: 1 },
  { id: 5, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img2.jpg", rating: 4.8, cardType: "yellow", section: 1 },
  { id: 6, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 24, instructorName: "Robert Martinez", instructorImage: "/img1.jpg", rating: 4.8, cardType: "blue", section: 2 },
  { id: 7, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img3.jpg", rating: 4.8, cardType: "yellow", section: 2 },
  { id: 8, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img2.jpg", rating: 4.8, cardType: "yellow", section: 2 },
  { id: 9, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img1.jpg", rating: 4.8, cardType: "blue", section: 2 },
  { id: 10, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img3.jpg", rating: 4.8, cardType: "yellow", section: 2 },
  { id: 11, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 24, instructorName: "Robert Martinez", instructorImage: "/img2.jpg", rating: 4.8, cardType: "blue", section: 3 },
  { id: 12, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img1.jpg", rating: 4.8, cardType: "yellow", section: 3 },
  { id: 13, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img3.jpg", rating: 4.8, cardType: "yellow", section: 3 },
  { id: 14, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img2.jpg", rating: 4.8, cardType: "blue", section: 3 },
  { id: 15, title: "Beginner's Guide To Becoming A Professional Frontend Developer", duration: "10 weeks", lessons: 4, instructorName: "Robert Martinez", instructorImage: "/img1.jpg", rating: 4.8, cardType: "yellow", section: 3 }
])

const favoriteCourses = computed(() => allCourses.value.filter(c => c.section === 1))
const section2Courses = computed(() => allCourses.value.filter(c => c.section === 2))
const section3Courses = computed(() => allCourses.value.filter(c => c.section === 3))
</script>

<style scoped>
.my-learning {
  min-height: 100vh;
}

.main-content {
  padding: 60px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>