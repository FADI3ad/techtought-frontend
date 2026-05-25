<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../services/axios";
import { useAuthStore } from "../../stores/useAuthStore";
import Footer from "../../components/layout/Footer.vue";
import Swal from "sweetalert2";

const authStore = useAuthStore();

// State
const profile = ref(null);
const loading = ref(true);
const activeTab = ref("info"); // 'info' | 'security'
const saving = ref(false);

const form = ref({
  name: "",
  email: "",
  phone: "",
  country: "",
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

// Fetch Profile
const fetchProfile = async () => {
  loading.value = true;
  try {
    const res = await api.get("/profile");
    profile.value = res.data.data;
    form.value = {
      name: profile.value.name || "",
      email: profile.value.email || "",
      phone: profile.value.phone || "",
      country: profile.value.country || "",
    };
  } catch (err) {
    console.error("Failed to fetch profile:", err);
  } finally {
    loading.value = false;
  }
};

// Update Profile Info
const handleUpdateInfo = async () => {
  saving.value = true;
  try {
    const res = await api.put("/profile", form.value);
    if (res.data.status === "success") {
      profile.value = { ...profile.value, ...res.data.data };
      // Update the name in the auth store so the navbar reflects it
      authStore.user.name = res.data.data.name;
      localStorage.setItem("user", JSON.stringify(authStore.user));

      Swal.fire({
        title: "Updated!",
        text: "Your profile info has been saved.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  } catch (err) {
    const msg =
      err.response?.data?.message || "Failed to update profile. Please try again.";
    Swal.fire({ title: "Error", text: msg, icon: "error", confirmButtonColor: "#1a365d" });
  } finally {
    saving.value = false;
  }
};

// Change Password
const handleChangePassword = async () => {
  saving.value = true;
  try {
    const res = await api.put("/profile/password", passwordForm.value);
    if (res.data.status === "success") {
      passwordForm.value = { current_password: "", new_password: "", new_password_confirmation: "" };
      Swal.fire({
        title: "Password Changed!",
        text: "Your password has been updated successfully.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to change password.";
    Swal.fire({ title: "Error", text: msg, icon: "error", confirmButtonColor: "#1a365d" });
  } finally {
    saving.value = false;
  }
};

// Computed helpers
const memberSince = computed(() => {
  if (!profile.value?.created_at) return "—";
  return new Date(profile.value.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
});

const roleLabel = computed(() => {
  const map = {
    admin: "Admin",
    super_admin: "Super Admin",
    instructor: "Instructor",
    student: "Student",
  };
  return map[profile.value?.role] || "Student";
});

const roleBadgeClass = computed(() => {
  const map = {
    admin: "bg-red-100 text-red-700",
    super_admin: "bg-purple-100 text-purple-700",
    instructor: "bg-amber-100 text-amber-700",
    student: "bg-emerald-100 text-emerald-700",
  };
  return map[profile.value?.role] || "bg-emerald-100 text-emerald-700";
});

const initials = computed(() => {
  const n = profile.value?.name || "U";
  return n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
});

onMounted(fetchProfile);
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">

    <!-- Header -->
    <div class="bg-primary-900 text-white py-12">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <h1 class="text-3xl font-black mb-2">My Profile</h1>
        <p class="text-primary-200">Manage your personal information and account security.</p>
      </div>
    </div>

    <!-- Main -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 py-12 w-full">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p class="text-gray-500 font-medium">Loading your profile...</p>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        <!-- ── Left: Profile Card ── -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <!-- Avatar Section -->
          <div class="bg-gradient-to-br from-primary-900 to-primary-700 px-6 pt-10 pb-16 flex flex-col items-center text-center relative">
            <div v-if="profile?.image"
              class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
              <img :src="profile.image" :alt="profile.name" class="w-full h-full object-cover" />
            </div>
            <div v-else
              class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white/20 flex items-center justify-center mb-4">
              <span class="text-3xl font-black text-white">{{ initials }}</span>
            </div>
            <h2 class="text-xl font-black text-white">{{ profile?.name }}</h2>
            <p class="text-primary-200 text-sm mt-1">{{ profile?.email }}</p>
            <span :class="roleBadgeClass"
              class="mt-3 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              {{ roleLabel }}
            </span>
          </div>

          <!-- Stats -->
          <div class="mt-4 mx-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5 grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-2xl font-black text-primary-700">{{ profile?.enrolled_courses_count ?? 0 }}</p>
              <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Courses</p>
            </div>
            <div class="border-l border-gray-200">
              <p class="text-2xl font-black text-primary-700">{{ memberSince }}</p>
              <p class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Member Since</p>
            </div>
          </div>

          <!-- Quick Info -->
          <div class="p-6 space-y-3 mt-2">
            <div v-if="profile?.phone" class="flex items-center gap-3 text-sm text-gray-600">
              <span class="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span>{{ profile.phone }}</span>
            </div>
            <div v-if="profile?.country" class="flex items-center gap-3 text-sm text-gray-600">
              <span class="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </span>
              <span>{{ profile.country }}</span>
            </div>
          </div>
        </div>

        <!-- ── Right: Edit Forms ── -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Tab Navigation -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex gap-1">
            <button @click="activeTab = 'info'"
              :class="activeTab === 'info' ? 'bg-primary-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Info
            </button>
            <button @click="activeTab = 'security'"
              :class="activeTab === 'security' ? 'bg-primary-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </button>
          </div>

          <!-- ── Personal Info Tab ── -->
          <div v-if="activeTab === 'info'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div class="border-b pb-4 mb-6">
              <h3 class="text-lg font-bold text-gray-900">Personal Information</h3>
              <p class="text-sm text-gray-500 mt-1">Update your name, contact details, and country.</p>
            </div>

            <div class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input v-model="form.name" type="text" placeholder="Your full name"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input v-model="form.email" type="email" placeholder="you@example.com"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input v-model="form.phone" type="tel" placeholder="+20 100 000 0000"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                  <input v-model="form.country" type="text" placeholder="Egypt"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t">
                <button @click="handleUpdateInfo" :disabled="saving"
                  class="btn-global px-8 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
                  <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <!-- ── Security Tab ── -->
          <div v-if="activeTab === 'security'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div class="border-b pb-4 mb-6">
              <h3 class="text-lg font-bold text-gray-900">Change Password</h3>
              <p class="text-sm text-gray-500 mt-1">Make sure your new password is at least 8 characters.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                <div class="relative">
                  <input v-model="passwordForm.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    placeholder="Enter current password"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-4 pr-11 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                  <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <div class="relative">
                    <input v-model="passwordForm.new_password"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Min. 8 characters"
                      class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-4 pr-11 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                    <button type="button" @click="showNewPassword = !showNewPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input v-model="passwordForm.new_password_confirmation"
                    type="password"
                    placeholder="Repeat new password"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800" />
                </div>
              </div>

              <!-- Password strength hint -->
              <div v-if="passwordForm.new_password" class="flex items-center gap-2">
                <div class="flex gap-1">
                  <div v-for="n in 4" :key="n"
                    :class="passwordForm.new_password.length >= n * 2 ? 'bg-primary-600' : 'bg-gray-200'"
                    class="h-1.5 w-8 rounded-full transition-colors duration-300"></div>
                </div>
                <span class="text-xs text-gray-500">
                  {{ passwordForm.new_password.length < 4 ? 'Too weak' : passwordForm.new_password.length < 6 ? 'Weak' : passwordForm.new_password.length < 8 ? 'Fair' : 'Strong' }}
                </span>
              </div>

              <div class="flex justify-end pt-4 border-t">
                <button @click="handleChangePassword"
                  :disabled="saving || !passwordForm.current_password || !passwordForm.new_password || passwordForm.new_password !== passwordForm.new_password_confirmation"
                  class="btn-global px-8 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-60">
                  <span v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Change Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>
