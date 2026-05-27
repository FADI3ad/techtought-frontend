<script setup>
  import { ref, computed } from "vue";
  import api from "../../services/axios";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../../stores/useAuthStore";
  import AuthInput from "../../components/common/AuthInput.vue";

  const router = useRouter();
  const authStore = useAuthStore();

  const form = ref({
    email: "",
    password: "",
  });

  const errors = ref({});
  const loading = ref(false);
  const serverError = ref("");

  const validate = () => {
    errors.value = {};
    let isValid = true;

    if (!form.value.email) {
      errors.value.email = ["Email is required"];
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = ["Invalid email format"];
      isValid = false;
    }

    if (!form.value.password) {
      errors.value.password = ["Password is required"];
      isValid = false;
    } else if (form.value.password.length < 8) {
      errors.value.password = ["Password must be at least 8 characters"];
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    serverError.value = "";
    loading.value = true;

    try {
      const response = await api.post("/login", {
        email: form.value.email,
        password: form.value.password,
      });

      const user = response.data.data.user;
      authStore.login(user);
      localStorage.setItem("token", response.data.data.token);

      if (user.role === "admin" || user.role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "instructor") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/home");
      }
    } catch (error) {
      loading.value = false;

      if (error.response?.status === 422) {
        errors.value = error.response.data.errors || {};
      } else if (error.response?.status === 401) {
        serverError.value = "Invalid email or password.";
      } else if (error.response?.status === 403) {
        serverError.value = error.response.data.message || "Your account has been blocked.";
      } else if (error.response?.data?.message) {
        serverError.value = error.response.data.message;
      } else {
        serverError.value = "Something went wrong. Please try again.";
      }
    }
  };

  import { onMounted } from "vue";
  import Swal from "sweetalert2";

  const handleSocialLogin = async (provider) => {
    try {
      const res = await api.get(`/login/${provider}`);
      if (res.data.status === "success" && res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      serverError.value = "Failed to initiate login with " + provider;
    }
  };

  onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'blocked') {
      Swal.fire({
        title: 'Account Blocked',
        text: 'Your account has been blocked by an administrator. Please contact support.',
        icon: 'error',
        confirmButtonColor: '#12141a'
      });
      // Clear the URL param without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
</script>

<template>
  <div class="sign">
    <!-- Left Side -->
    <div class="signin">
      <div class="inner left-inner">
        <div class="stars"></div>
        <h2 class="signin-left">Welcome back to TechTought</h2>
        <p>
          Explore TechTought core features for individuals and organizations.
        </p>
      </div>
    </div>

    <!-- Right Side -->
    <div class="signin-right">
      <div class="inner right-inner">
        <h4 class="already-have-account">
          Don't have an account?
          <router-link to="/signup">Sign up →</router-link>
        </h4>

        <h2 class="sig">Sign in to TechTought</h2>

        <!-- Server Error -->
        <Transition name="fade">
          <div v-if="serverError" class="server-error">
            {{ serverError }}
          </div>
        </Transition>

        <form class="form-container" @submit.prevent="handleSubmit">
          <AuthInput
            v-model="form.email"
            id="email"
            type="email"
            label="Email"
            placeholder="Your email"
            required
            :error="errors.email?.[0]" />

          <AuthInput
            v-model="form.password"
            id="password"
            type="password"
            label="Password"
            placeholder="Must be at least 8 characters."
            required
            :error="errors.password?.[0]" />

          <!-- Submit -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="loader"></span>
            {{ loading ? "Signing in..." : "Login" }}
          </button>

          <!-- Divider -->
          <div class="oauth-divider">
            <span class="oauth-line"></span>
            <span class="oauth-text">Or continue with</span>
            <span class="oauth-line"></span>
          </div>

          <!-- OAuth Buttons Group -->
          <div class="oauth-buttons">
            <button type="button" @click="handleSocialLogin('google')" class="oauth-btn google-btn">
              <svg class="oauth-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.08-3.1 4.09l4.8 3.73c2.8-2.58 4.35-6.39 4.35-10.67z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.8-3.73c-1.33.89-3.04 1.43-5.16 1.43-3.97 0-7.35-2.69-8.55-6.31L1.13 16.2c2.4 4.77 7.34 8 13.06 8z"/>
                <path fill="#FBBC05" d="M3.45 12.48c-.31-.93-.49-1.92-.49-2.94s.18-2.01.49-2.94L1.13 2.8C.41 4.24 0 5.88 0 7.5s.41 3.26 1.13 4.7l2.32-1.72z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 6.28 0 1.34 3.23.13 8l3.32 2.48c1.2-3.62 4.58-6.31 8.55-6.31z"/>
              </svg>
              Google
            </button>

            <button type="button" @click="handleSocialLogin('github')" class="oauth-btn github-btn">
              <svg class="oauth-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>

            <button type="button" @click="handleSocialLogin('facebook')" class="oauth-btn facebook-btn">
              <svg class="oauth-icon" viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div class="terms">
            <p>
              By signing in, you agree to the
              <a href="">Terms of Service</a> and <a href="">Privacy Policy</a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
  /* ===== Layout Structure ===== */
  .sign {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }

  .signin {
    background: radial-gradient(circle at bottom, #61dafb -150%, #020103 70%, #020103 10%);
    color: white;
    padding: 80px 15px;
    width: 50%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .signin-right {
    width: 50%;
    padding: 40px 80px;
    background-color: #f6f8fa;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .inner {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
  }

  /* Stars Animation */
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .stars::before {
    content: "";
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    box-shadow: 20px 40px 0 0 white, 80px 100px 0 0 white, 150px 60px 0 0 white, 300px 150px 0 0 white, 250px 50px 0 0 white, 100px 200px 0 0 white, 350px 250px 0 0 white, 180px 180px 0 0 white, 280px 80px 0 0 white, 50px 300px 0 0 white;
    animation: twinkle 3s infinite alternate;
  }

  @keyframes twinkle {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.4; }
  }

  .signin-left {
    font-size: 48px;
    font-weight: 300;
    margin-bottom: 20px;
    line-height: 1.25;
    letter-spacing: -0.5px;
    z-index: 1;
  }

  .signin p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    z-index: 1;
  }

  .already-have-account {
    text-align: right;
    font-size: 14px;
    margin-bottom: 40px;
    color: #57606a;
  }

  .already-have-account a {
    color: #0969da;
    text-decoration: none;
    font-weight: 500;
  }

  .sig {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 32px;
    color: #1f2328;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .submit-btn {
    width: 100%;
    background-color: #12141a;
    color: white;
    height: 48px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: #2a2c36;
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .server-error {
    background-color: #ffebe9;
    border: 1px solid rgba(207, 34, 46, 0.2);
    color: #cf222e;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 24px;
    font-weight: 500;
  }

  .terms p {
    font-size: 12px;
    color: #57606a;
    line-height: 1.6;
    margin-top: 16px;
  }

  .terms a {
    color: #0969da;
    text-decoration: none;
  }

  /* Loader */
  .loader {
    width: 18px;
    height: 18px;
    border: 2px solid #ffffff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Animations */
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  /* OAuth Styles */
  .oauth-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 8px 0;
  }

  .oauth-line {
    flex-grow: 1;
    height: 1px;
    background-color: #d0d7de;
  }

  .oauth-text {
    font-size: 11px;
    color: #57606a;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .oauth-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .oauth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 44px;
    background-color: white;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #24292f;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.3, 0, 0, 1);
  }

  .oauth-btn:hover {
    background-color: #f6f8fa;
    border-color: #57606a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .oauth-btn:active {
    transform: translateY(0);
  }

  .oauth-icon {
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    .signin-right { padding: 40px 50px; }
    .signin { padding: 60px 40px; }
  }

  @media (max-width: 768px) {
    .sign { flex-direction: column; }
    .signin, .signin-right { width: 100%; }
    .signin { min-height: 300px; padding: 40px 30px; }
    .signin-left { font-size: 36px; }
    .signin-right { padding: 30px; }
  }
</style>

