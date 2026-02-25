<template>
  <section class="courses-section">
    <h1 v-if="title" class="section-title">{{ title }}</h1>
    <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
    
    <div class="courses-grid">
      <CourseCard 
        v-for="course in courses" 
        :key="course.id"
        :course="course"
      />
    </div>
  </section>
</template>

<script setup>
import CourseCard from './CourseCard.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  courses: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.courses-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.section-subtitle {
  font-size: 16px;
  color: #999;
  margin-bottom: 40px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

@media (max-width: 1400px) {
  .courses-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1100px) {
  .courses-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>