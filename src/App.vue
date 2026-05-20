<script>
  import Navbar from "./components/layout/Navbar.vue"; 

  export default {
    components: {
      Navbar,
    },
    computed: {
      showNavbar() {
        const path = this.$route.path;
        const name = this.$route.name;
        return (
          !(path.startsWith("/admin/") || path === "/admin") &&
          !(path.startsWith("/instructor/") || path === "/instructor") &&
          name !== "login" &&
          name !== "signup" &&
          name !== "create-course"
        );
      },
    },
  };
</script>

<template>
  <Navbar v-if="showNavbar" />
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
