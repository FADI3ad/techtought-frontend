<template>
  <header class="header">
    <div class="container">
      <div class="nav-wrapper">
        <div class="logo">LOGO</div>
        
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search for files, plugins, and creators"
          >
          <button class="search-btn">🔍</button>
        </div>
        
        <nav class="nav-menu">
          <a href="#">About</a>
          <a href="#">Tech Taught</a>
          <a href="#">Contact Us</a>
          <a href="#" class="active">My learning</a>
        </nav>
        
        <div class="header-icons">
          <button class="wishlist-btn">♡</button>
          <div class="user-avatar">
            <img src="/img1.jpg" alt="User">
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const searchQuery = ref('')
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #E5E5E5;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.search-bar {
  flex: 1;
  max-width: 500px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 1px solid #E5E5E5;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #0091FF;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-menu a {
  text-decoration: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
}

.nav-menu a.active {
  color: #000;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.wishlist-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>