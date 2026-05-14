<script setup>
  import HeroSection from "../../components/home/HeroSection.vue";
  import CoursesSection from "../../components/courses/CoursesSection.vue";
  import FeaturesSection from "../../components/home/FeaturesSection.vue";
  import JsCompiler from "../../components/home/JsCompiler.vue";
  import Testimonials from "../../components/home/Testimonials.vue";
  import Footer from "../../components/layout/Footer.vue";
</script>

<template>
  <div class="overflow-hidden">
    <HeroSection />
    <CoursesSection />
    <JsCompiler />
    <FeaturesSection />

    <!-- <Testimonials /> -->
    <Footer />
  </div>
</template>
