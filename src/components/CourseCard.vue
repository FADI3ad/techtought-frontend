<template>
  <div class="course-card">
    <div class="card-image" :class="cardClass">
      <span class="heart-icon">♡</span>
      <img :src="course.instructorImage" :alt="course.instructorName" class="instructor-img">
    </div>
    
    <div class="card-content">
      <h3>{{ course.title }}</h3>
      <div class="card-meta">
        <span>⏱ {{ course.duration }}</span>
        <span>📄 {{ course.lessons }} lessons</span>
      </div>
      <div class="card-footer">
        <span class="instructor-name">{{ course.instructorName }}</span>
        <span class="rating">⭐⭐⭐⭐ {{ course.rating }}</span>
      </div>
    </div>
    
    <button class="btn-complete">▶ Complete Course</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const cardClass = computed(() => {
  return props.course.cardType === 'blue' ? 'blue-card' : 'yellow-card'
})
</script>

<style scoped>
.course-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 140px;
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

.blue-card {
  background: linear-gradient(135deg, #4169E1 0%, #6B9EFF 100%);
}

.yellow-card {
  background: #FFC700;
}

.heart-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.85);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.instructor-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.card-content {
  padding: 15px;
}

.card-content h3 {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 12px;
  min-height: 55px;
}

.card-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 11px;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.instructor-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.rating {
  font-size: 11px;
  color: #FFA500;
  font-weight: 600;
}

.btn-complete {
  width: calc(100% - 30px);
  margin: 0 15px 15px;
  background: linear-gradient(135deg, #00BFFF 0%, #0099FF 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
</style>