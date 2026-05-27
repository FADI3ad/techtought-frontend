<script setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import api from "../../services/axios";
  import { useAuthStore } from "../../stores/useAuthStore";
  import Swal from "sweetalert2";

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  
  const statusMessage = ref("Verifying your credentials...");
  const loading = ref(true);

  onMounted(async () => {
    const provider = route.params.provider;
    const code = route.query.code;

    if (!provider || !code) {
      Swal.fire({
        title: "Authentication Error",
        text: "Invalid OAuth callback arguments.",
        icon: "error",
        confirmButtonColor: "#12141a"
      });
      router.push("/login");
      return;
    }

    statusMessage.value = `Signing you in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`;

    try {
      // Send code to backend callback API
      const response = await api.post(`/login/${provider}/callback?code=${encodeURIComponent(code)}`);

      if (response.data.status === "success") {
        const { token, user } = response.data.data;

        // Login to store and persist token
        authStore.login(user);
        localStorage.setItem("token", token);

        Swal.fire({
          title: "Successfully Authenticated!",
          text: `Welcome back, ${user.name}!`,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });

        // Redirect based on role
        if (user.role === "admin" || user.role === "super_admin") {
          router.push("/admin/dashboard");
        } else if (user.role === "instructor") {
          router.push("/instructor/dashboard");
        } else {
          router.push("/home");
        }
      } else {
        throw new Error(response.data.message || "OAuth login failed");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Failed to authenticate with social provider.";
      
      Swal.fire({
        title: "Login Failed",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#12141a"
      });
      router.push("/login");
    } finally {
      loading.value = false;
    }
  });
</script>

<template>
  <div class="callback-container">
    <div class="callback-card">
      <!-- Glow effect -->
      <div class="glow"></div>
      
      <div class="spinner-container">
        <div class="outer-ring"></div>
        <div class="inner-ring"></div>
        <div class="pulse-core"></div>
      </div>
      
      <h2 class="status-title">{{ statusMessage }}</h2>
      <p class="status-subtitle">Please do not refresh this page or close your browser tab.</p>
    </div>
  </div>
</template>

<style scoped>
  .callback-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    background-color: #020103;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
    position: relative;
  }

  .callback-container::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(97, 218, 251, 0.15) 0%, transparent 70%);
    top: -50px;
    left: -50px;
    pointer-events: none;
  }

  .callback-container::after {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    bottom: -100px;
    right: -100px;
    pointer-events: none;
  }

  .callback-card {
    position: relative;
    background: rgba(18, 16, 22, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    padding: 48px;
    border-radius: 20px;
    text-align: center;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  .glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(97, 218, 251, 0.05);
    pointer-events: none;
  }

  /* Premium Loader Styles */
  .spinner-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 32px;
  }

  .outer-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: #61dafb;
    border-bottom-color: #8b5cf6;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  }

  .inner-ring {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-left-color: #34d399;
    border-right-color: #fbbf24;
    border-radius: 50%;
    animation: spin-reverse 1s linear infinite;
  }

  .pulse-core {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .status-title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: -0.3px;
  }

  .status-subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.5;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spin-reverse {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(0.85); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
</style>
