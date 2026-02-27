<template>
  <router-view />
</template>

<script>
export default {};
</script>

<style>
body {
  font-family: "Poppins", sans-serif;
  scroll-behavior: smooth;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* ده اللي هيخلي الصفحات 1340px */
.main-container {
  max-width: 1340px;
  margin: auto; /* يخليها في النص */
  padding: 0 20px; /* مسافة يمين وشمال */
}
</style>
