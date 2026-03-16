<script>
  import Navbar from "./components/Navbar.vue"; 

  export default {
    components: {
      Navbar,
    },
  };
</script>

<template>
  <Navbar />
  <router-view />
</template>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Poppins", sans-serif;
    scroll-behavior: smooth;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
  }
/* 
  .main-container {
    max-width: 1340px;
    margin: auto;
    padding: 0 20px;
  } */
</style>
