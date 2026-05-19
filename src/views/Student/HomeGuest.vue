<script setup>
  import HeroSection from "../../components/home/HeroSection.vue";
  import CoursesSection from "../../components/home/CoursesSection.vue";
  import FeaturesSection from "../../components/home/FeaturesSection.vue";
  import JsCompilerSection from "../../components/home/JsCompilerSection.vue";
  import TestimonialsSection from "../../components/home/TestimonialsSection.vue";
  import Footer from "../../components/layout/Footer.vue";
</script>

<template>
  <div class="overflow-hidden">
    <HeroSection />
    <CoursesSection />
    <JsCompilerSection />
    <FeaturesSection />
    <TestimonialsSection />
    <Footer />
  </div>
</template>
