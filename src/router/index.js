
import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/auth/Signup.vue'
import Login from '../views/auth/Login.vue'
import studentprofile from '../views/studentprofile.vue'

const routes = [
  {
    path: '/signup', 
    name: 'SignUp',
    component: SignUp  
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
     path: '/studentprofile',
    name: 'studentprofile',
    component: studentprofile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
