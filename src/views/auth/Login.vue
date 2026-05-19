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

      authStore.login(response.data.data.user);
      localStorage.setItem("token", response.data.data.token);
      router.push("/dashboard");
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

