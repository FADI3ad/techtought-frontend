<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const activeTab = ref('Web Development')

const tabs = [
    'Computer Fundamentals', 
    'Web Development', 
    'Mobile Development', 
    'Artificial Intelligence (AI)'
]

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value

const reviews = [
    {
        name: "Emily Jeff",
        role: "CEO",
        company: "TheWebagency",
        text: "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.",
        img: "C:\\Users\\VICTUS\\Desktop\\techtought-frontend\\emily.png"
    },
    {
        name: "Hamza Malik",
        role: "Manager",
        company: "TheWektech",
        text: "Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical.",
        img: "C:\\Users\\VICTUS\\Desktop\\techtought-frontend\\hamza.png" 
    },
    {
        name: "Elizabeth Rai",
        role: "Developer",
        company: "I2c Company",
        text: "Park next busy ever. Elinor her his secure far twenty object. Any far saw size want man.",
        img: "C:\\Users\\VICTUS\\Desktop\\techtought-frontend\\elizabeth.png"
    },
    {
        name: "Sara Thomas",
        role: "Accountant",
        company: "TheConstruction",
        text: "Concerns greatest margaret him absolute entrance nay. Door neat week do find past.",
        img: "C:\\Users\\VICTUS\\Desktop\\techtought-frontend\\Sara.png"
    }
]
</script>

<template>
    <div class="main-wrapper">
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-left">
                    <h1 class="logo">TechTought</h1>
                    <div class="search-container desktop-only">
                        <input type="text" placeholder="Search for files, plugins, and creators" class="search-input">
                        <button class="search-btn">🔍</button>
                    </div>
                </div>

                <div class="nav-right" :class="{ 'open': isMenuOpen }">
                    <a href="#" class="nav-link">Teach with Us</a> 
                    <a href="#" class="nav-link">About</a> 
                    <div class="lang-selector"><span>☀️ En</span></div>
                    <button class="join-btn">join us</button> 
                </div>

                <div class="menu-toggle" @click="toggleMenu">☰</div>
            </div>
        </nav>

        <section class="hero-sec">
            <h2 class="hero-title">Build A Strong Web Foundation</h2>
            <p class="hero-subtitle">Start from the basics and grow your skills step by step to become a confident web developer.</p>
            
            <div class="carousel">
  <div class="group">
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\c++.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\flutter.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\js.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\hmtl.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\csharp.jpeg "alt=""></div>
  </div>
  <div class="group" aria-hidden="true">
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\c++.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\flutter.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\js.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\hmtl.png" alt=""></div>
    <div class="card"><img src="C:\Users\VICTUS\Desktop\techtought-frontend\csharp.jpeg "alt=""></div>

  </div>
</div>
        </section>

        <section class="skills-sec">
            <div class="container">
                <div class="sec-header">
                    <h2>Skills to transform your career and life</h2>
                    <p>From critical skills to technical topics, TechTought supports your professional development.</p> 
                </div>

                <div class="tabs-container">
                    <span v-for="tab in tabs" :key="tab" 
                        class="tab" :class="{ active: activeTab === tab }" 
                        @click="activeTab = tab">
                        {{ tab }}
                    </span>
                </div>

                <div class="skills-content">
                    <div class="mockup-side">
                        <img src="C:\Users\VICTUS\Desktop\techtought-frontend\mobile.png" alt="Mobile App" class="mobile-img">
                    </div>

                    <div class="cards-side">
                        <div class="course-grid">
                            <div class="course-card" v-for="n in 6" :key="n"> 
                                <img src="C:\Users\VICTUS\Desktop\techtought-frontend\cont2.png" alt="Course" class="course-img">
                                <div class="course-body">
                                    <h4>Beginner’s Guide to becoming a professional frontend developer</h4>
                                    <div class="course-info">
                                        <span>⏳ 10 weeks</span>
                                        <span>📚 24 lessons</span>
                                    </div>
                                    <div class="rating">⭐⭐⭐⭐⭐ 4.8</div>
                                </div>
                            </div>
                        </div>
                        <div class="show-all">show all courses →</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="daily-tasks-sec">
            <div class="container flex-row">
                <div class="tasks-text">
                    <h2 class="tasks-title">Daily Tasks</h2>
                    <p class="tasks-desc">
                        Enjoy customizable lists, team work tools, and smart tracking all in one place. 
                        Set tasks, get reminders, and see your progress simply and quickly.
                    </p>
                    <a href="#" class="cta-link">Complete Code →</a>
                </div>
                <div class="tasks-visual">
                    <div class="code-card">
                        <img src="C:\Users\VICTUS\Desktop\techtought-frontend\code.png" alt="Code Preview">
                    </div>
                </div>
            </div>
        </section>

        <section class="reviews-sec">
            <div class="container">
                <h2 class="sec-title-center">Best TechTought user reviews!</h2>
                <div class="reviews-grid">
                    <div class="review-card" v-for="(review, index) in reviews" :key="index">
                        <div class="review-header">
                            <img :src="review.img" class="user-avatar">
                            <div class="user-meta">
                                <h4>{{ review.name }}</h4>
                                <p>{{ review.role }} • {{ review.company }}</p>
                            </div>
                        </div>
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p class="review-body">{{ review.text }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* --- Base Styles --- */
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

.main-wrapper {
    max-width: 1340px;
    margin: 0 auto;
    background: #fff;
    overflow: hidden;
}

.container { width: 100%; padding: 0 40px; }
.flex-row { display: flex; align-items: center; justify-content: space-between; gap: 40px; }

/* --- Navbar --- */
.navbar { background: #fff; border-bottom: 1px solid #eee; padding: 15px 0; position: sticky; top: 0; z-index: 1000; }
.nav-container { display: flex; justify-content: space-between; align-items: center; padding: 0 30px; }
.nav-left, .nav-right { display: flex; gap: 20px; align-items: center; }
.logo { font-size: 24px; font-weight: 800; color: #333; }
.search-container { position: relative; }
.search-input { width: 320px; padding: 10px 45px 10px 20px; border-radius: 25px; border: 1px solid #e0e0e0; background: #f9f9f9; outline: none; }
.search-btn { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
.nav-link { text-decoration: none; color: #666; font-weight: 500; font-size: 14px; }
.join-btn { background: #00a3ff; color: #fff; padding: 10px 25px; border-radius: 25px; border: none; font-weight: 700; cursor: pointer; text-transform: capitalize; }
.menu-toggle { display: none; font-size: 24px; cursor: pointer; }

/* --- Hero & Carousel --- */
.hero-sec { text-align: center; padding: 80px 20px; background: #fff; }
.hero-title { font-size: 42px; font-weight: 800; margin-bottom: 15px; color: #1a1a1a; }
.hero-subtitle { color: #666; max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }

/* الحاوية الأساسية */
.carousel {
  display: flex; overflow: hidden; width: 90%; max-width: 650px; margin: 0 auto;
    background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);
    border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); padding: 20px 0; /* عشان نشوف حدود الكاروسيل */
}

/* المجموعة اللي شايلة الكروت */
.group {
  display: flex;
  gap: 5em; /* مسافة بين الكروت */
  padding-right: 5em; /* مهمة جداً عشان الحركة متقطعش */
  animation: spin 5s linear infinite; /* لفي يا دنيا للأبد */
}

/* شكل الكارت */
.card {
  width: 50px; height: auto; filter: grayscale(20%);
}
.card :hover{transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05);}

/* أنيميشن الحركة */
@keyframes spin {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%); /* بتتحرك للشمال لحد ما تختفي */
  }
}

/* --- Skills Section --- */
.skills-sec { padding: 80px 0; background: #f8fafc; }
.sec-header { margin-bottom: 40px; }
.sec-header h2 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
.tabs-container { display: flex; gap: 30px; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; overflow-x: auto; }
.tab { padding: 12px 0; cursor: pointer; color: #94a3b8; font-weight: 600; transition: 0.3s; white-space: nowrap; }
.tab.active { color: #0f172a; border-bottom: 3px solid #00a3ff; }

.skills-content { display: flex; gap: 60px; }
.mockup-side { flex: 0 0 280px; }
.mobile-img { width: 100%; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
.cards-side { flex: 1; }
.course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.course-card { background: #fff; border-radius: 15px; overflow: hidden; border: 1px solid #f1f5f9; transition: 0.3s; }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.course-img { width: 100%; height: 150px; object-fit: cover; }
.course-body { padding: 15px; }
.course-body h4 { font-size: 14px; line-height: 1.4; margin-bottom: 10px; color: #1e293b; }
.course-info { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 8px; }
.rating { color: #f59e0b; font-weight: 700; font-size: 13px; }
.show-all { margin-top: 30px; color: #00a3ff; font-weight: 700; cursor: pointer; }

/* --- Daily Tasks (Updated) --- */
.daily-tasks-sec { padding: 100px 0; background: #f1f5f9; }
.tasks-title { font-size: 64px; font-weight: 800; margin-bottom: 25px; line-height: 1.1; color: #0f172a; }
.tasks-desc { font-size: 18px; color: #475569; margin-bottom: 30px; line-height: 1.6; max-width: 500px; }
.cta-link { color: #00a3ff; text-decoration: none; font-weight: 700; font-size: 18px; }

.code-card { 
    width: 100%; 
    max-width: 520px; 
    background: #1f1f2e; 
    border-radius: 20px; 
    overflow: hidden; 
    box-shadow: 0 25px 40px rgba(0,0,0,0.2); 
}
.code-card img { width: 100%; display: block; }

/* --- Reviews --- */
.reviews-sec { padding: 80px 0; }
.sec-title-center { text-align: center; font-size: 32px; font-weight: 800; margin-bottom: 50px; }
.reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.review-card { background: #fff; padding: 25px; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.review-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.user-avatar { width: 50px; height: 50px; border-radius: 12px; object-fit: cover; }
.user-meta h4 { font-size: 16px; color: #1e293b; }
.user-meta p { font-size: 12px; color: #64748b; }
.stars { margin-bottom: 10px; font-size: 14px; }
.review-body { font-size: 14px; color: #475569; line-height: 1.6; }

/* --- Responsive --- */
@media (max-width: 1100px) {
    .course-grid { grid-template-columns: repeat(2, 1fr); }
    .tasks-title { font-size: 48px; }
}

@media (max-width: 992px) {
    .flex-row, .skills-content { flex-direction: column; text-align: center; }
    .nav-right { display: none; }
    .nav-right.open { display: flex; position: absolute; top: 100%; left: 0; width: 100%; flex-direction: column; background: #fff; padding: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .menu-toggle { display: block; }
    .desktop-only { display: none; }
    .tasks-desc { margin: 0 auto 30px; }
    .course-grid { grid-template-columns: 1fr; }
    .mockup-side { max-width: 250px; margin: 0 auto; }
}
</style>