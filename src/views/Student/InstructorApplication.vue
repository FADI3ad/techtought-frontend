<template>
  <div class="h-[calc(100vh-85px)] bg-gray-50 pt-20">
    <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-6 animate-fade-in">
        <h1 class="text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
          Become an <span class="text-[#1a365d]">Instructor</span>
        </h1>
        <p class="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Join our global community of experts and share your knowledge with the world.
        </p>
      </div>

      <div class="animate-slide-in-up">
        <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl p-8 shadow-md shadow-gray-200/40 border border-gray-100/80 space-y-6">
          
          <!-- Personal Info Section -->
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-blue-50 text-[#1a365d] flex items-center justify-center text-sm font-semibold">1</span>
              Personal Credentials
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Full Name</label>
                <input v-model="formData.name" required type="text" placeholder="John Doe" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Email Address</label>
                <input v-model="formData.email" required type="email" placeholder="john@example.com" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Phone Number</label>
                <input v-model="formData.phone" required type="tel" placeholder="+1 (234) 567-890" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Country</label>
                <input v-model="formData.country" required type="text" placeholder="Egypt" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none text-sm font-medium" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Age</label>
                <input v-model="formData.age" required type="number" placeholder="30" class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          <hr class="border-gray-100">

          <!-- Experience & Identity Section -->
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-blue-50 text-[#1a365d] flex items-center justify-center text-sm font-semibold">2</span>
              Experience & Identity
            </h2>

            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs font-bold text-gray-700 ml-1">Years of Experience</label>
                <div class="relative">
                  <select v-model="formData.experience_years" required class="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus:bg-white focus:border-[#1a365d] focus:ring-4 focus:ring-blue-900/5 transition-all duration-200 outline-none appearance-none cursor-pointer text-sm font-medium">
                    <option value="" disabled selected>Select Experience</option>
                    <option :value="3">3-5 Years</option>
                    <option :value="5">5-10 Years</option>
                    <option :value="10">10+ Years</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label class="file-upload-card" :class="{ 'border-[#1a365d] bg-blue-50/50': formData.cv_link }">
                  <input type="file" @change="(e) => (formData.cv_link = e.target.files[0])" hidden accept=".pdf,.doc,.docx" />
                  <div class="flex flex-col items-center gap-1.5 text-center overflow-hidden w-full">
                    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#1a365d] flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span class="text-xs font-bold text-gray-700">Upload CV</span>
                    <span class="text-[10px] text-gray-400 font-medium truncate w-full px-1">
                      {{ getFileName(formData.cv_link, 'PDF, DOC (Max 5MB)') }}
                    </span>
                  </div>
                </label>

                <label class="file-upload-card" :class="{ 'border-[#1a365d] bg-blue-50/50': formData.national_id_front_image }">
                  <input type="file" @change="(e) => (formData.national_id_front_image = e.target.files[0])" hidden accept="image/*" />
                  <div class="flex flex-col items-center gap-1.5 text-center overflow-hidden w-full">
                    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#1a365d] flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <span class="text-xs font-bold text-gray-700">ID Front</span>
                    <span class="text-[10px] text-gray-400 font-medium truncate w-full px-1">
                      {{ formData.national_id_front_image ? formData.national_id_front_image.name : 'Image file' }}
                    </span>
                  </div>
                </label>

                <label class="file-upload-card" :class="{ 'border-[#1a365d] bg-blue-50/50': formData.national_id_back_image }">
                  <input type="file" @change="(e) => (formData.national_id_back_image = e.target.files[0])" hidden accept="image/*" />
                  <div class="flex flex-col items-center gap-1.5 text-center overflow-hidden w-full">
                    <div class="w-8 h-8 rounded-full bg-blue-50 text-[#1a365d] flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <span class="text-xs font-bold text-gray-700">ID Back</span>
                    <span class="text-[10px] text-gray-400 font-medium truncate w-full px-1">
                      {{ formData.national_id_back_image ? formData.national_id_back_image.name : 'Image file' }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button type="submit" :disabled="status === 'loading'" class="w-full bg-[#1a365d] hover:bg-[#11243f] text-white font-semibold py-3.5 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-900/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base">
              <span v-if="status === 'loading'" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Submit Application</span>
              <svg v-if="status !== 'loading'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../../services/axios";
import Swal from 'sweetalert2';
import { useRouter } from "vue-router";

const router = useRouter();

const formData = ref({
  name: "",
  email: "",
  phone: "",
  country: "",
  age: null,
  cv_link: null,
  national_id_front_image: null,
  national_id_back_image: null,
  experience_years: "",
});

const status = ref("idle"); // idle | loading

const handleSubmit = async () => {
  try {
    status.value = "loading";

    const data = new FormData();
    data.append("name", formData.value.name);
    data.append("email", formData.value.email);
    data.append("phone", formData.value.phone);
    data.append("country", formData.value.country);
    data.append("age", formData.value.age);
    data.append("experience_years", formData.value.experience_years);

    if (formData.value.cv_link) data.append("cv_link", formData.value.cv_link);
    if (formData.value.national_id_front_image) {
      data.append("national_id_front_image", formData.value.national_id_front_image);
    }
    if (formData.value.national_id_back_image) {
      data.append("national_id_back_image", formData.value.national_id_back_image);
    }

    await api.post("/instructor-requests", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    status.value = "idle";
    
    Swal.fire({
      icon: 'success',
      title: 'Application Submitted!',
      text: 'Thank you for applying to be an instructor. We will review your application and get back to you soon.',
      confirmButtonColor: '#4f46e5'
    }).then(() => {
        router.push('/');
    });

  } catch (error) {
    status.value = "idle";
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response?.data?.message || 'Failed to submit application. Please try again.'
    });
  }
};

const getFileName = (file, defaultText) => {
  return file ? file.name : defaultText;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
.animate-slide-in-up {
  animation: slideInUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.file-upload-card {
  @apply flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl py-4 px-3 cursor-pointer transition-all hover:border-[#1a365d] hover:bg-blue-50/30 active:scale-95;
}
</style>