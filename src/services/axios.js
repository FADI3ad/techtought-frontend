import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000/api", 
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If blocked or unauthorized, clear storage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      if (window.location.pathname !== '/login') {
        // We use window.location.href to force a full refresh and clear all states
        window.location.href = "/login?message=blocked";
      }
    }
    return Promise.reject(error);
  }
);

export default api;