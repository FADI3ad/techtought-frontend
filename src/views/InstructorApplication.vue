<script setup>
import { ref } from "vue";
import api from "../api/axios";

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

const status = ref("idle"); // idle | loading | success | error
const errorMessage = ref("");

const handleSubmit = async () => {
  try {
    status.value = "loading";
    errorMessage.value = "";

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

    status.value = "success";
  } catch (error) {
    status.value = "error";
    errorMessage.value = error.response?.data?.message || "Something went wrong";
  }
};


const getFileName = (file, defaultText) => {
  return file ? file.name : defaultText;
};
</script>

<template>
  <div class="h-screen bg-gradient-to-r from-white via-[#efefff] to-[#d1d1ff] flex flex-col justify-center items-center px-4 font-sans overflow-hidden">
    <div class="w-full max-w-[800px] flex flex-col h-full max-h-[95vh]">
      
      <div class="mb-4 text-center">
        <h2 class="text-2xl lg:text-3xl font-extrabold text-black tracking-tighter leading-tight">
          Become a TechTought Instructor
        </h2>
        <p class="text-gray-400 text-[10px] font-medium uppercase tracking-widest mt-1">
          Join our global community of experts
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-6 lg:p-10 border border-white/50 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="md:col-span-2 flex items-center gap-2 mb-1">
            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</div>
            <h3 class="text-md font-bold text-gray-900 tracking-tight">Personal Credentials</h3>
          </div>

          <input v-model="formData.name" type="text" class="input-style" placeholder="Full Name" />
          <input v-model="formData.email" type="email" class="input-style" placeholder="Email" />
          <input v-model="formData.phone" type="tel" class="input-style" placeholder="Phone" />
          <input v-model="formData.country" type="text" class="input-style" placeholder="Country" />
          <input v-model="formData.age" type="number" class="input-style" placeholder="Age" />

          <div class="md:col-span-2 flex items-center gap-2 mt-2 mb-1">
            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</div>
            <h3 class="text-md font-bold text-gray-900 tracking-tight">Experience & Identity</h3>
          </div>

          <div class="relative group">
            <select v-model="formData.experience_years" class="input-style appearance-none cursor-pointer">
              <option value="" disabled selected>Select Experience</option>
              <option :value="3">3-5 Years</option>
              <option :value="5">5-10 Years</option>
              <option :value="10">10+ Years</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <label class="file-upload-card" :class="{ 'border-blue-500 bg-blue-50/30': formData.cv_link }">
            <input type="file" @change="(e) => (formData.cv_link = e.target.files[0])" hidden />
            <div class="flex flex-col items-center gap-1">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span class="text-[11px] font-bold text-gray-600 uppercase">{{ getFileName(formData.cv_link, 'Upload CV') }}</span>
            </div>
          </label>

          <label class="file-upload-card" :class="{ 'border-blue-500 bg-blue-50/30': formData.national_id_front_image }">
            <input type="file" @change="(e) => (formData.national_id_front_image = e.target.files[0])" hidden />
            <div class="flex flex-col items-center gap-1">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <span class="text-[11px] font-bold text-gray-600 uppercase leading-none text-center">
                {{ formData.national_id_front_image ? 'Front ID Ready' : 'National ID (Front)' }}
              </span>
            </div>
          </label>

          <label class="file-upload-card" :class="{ 'border-blue-500 bg-blue-50/30': formData.national_id_back_image }">
            <input type="file" @change="(e) => (formData.national_id_back_image = e.target.files[0])" hidden />
            <div class="flex flex-col items-center gap-1">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <span class="text-[11px] font-bold text-gray-600 uppercase leading-none text-center">
                 {{ formData.national_id_back_image ? 'Back ID Ready' : 'National ID (Back)' }}
              </span>
            </div>
          </label>
        </div>

        <div class="mt-4 flex flex-col items-center shrink-0">
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-md hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="status !== 'loading'">Send Application</span>
            <div v-else class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </div>
          </button>

          <p v-if="status === 'success'" class="text-green-600 text-xs font-bold mt-2 animate-bounce">
            Application Sent Successfully!
          </p>

          <p v-if="status === 'error'" class="text-red-600 text-xs font-bold mt-2">
            {{ errorMessage }}
          </p>
        </div>
      </form>

      <p class="text-center text-gray-400 text-[9px] mt-4 uppercase tracking-widest font-medium">
        © 2026 TechTought Faculty Recruitment
      </p>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  @apply w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-800 font-medium;
}

/* بطاقة رفع الملفات الجديدة */
.file-upload-card {
  @apply flex flex-col items-center justify-center border-2 border-dashed border-gray-100 bg-gray-50 rounded-xl py-3 px-4 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50 active:scale-[0.99];
}

/* تحسين السكرول بار */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-full hover:bg-gray-300;
}
</style>