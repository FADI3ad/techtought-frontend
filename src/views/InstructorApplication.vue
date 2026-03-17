<script setup>
  import { ref } from "vue";

  const formData = ref({
    name: "Ahmed Fady",
    email: "ahmed.fady@example.com",
    phone: "+201234567890",
    country: "Egypt",
    age: 28,
    cv_link: null,
    national_id_front_image: null,
    national_id_back_image: null,
    experience_years: 3,
  });

  const status = ref("idle");

  const handleSubmit = () => {
    status.value = "success";
    console.log("Application Sent:", formData.value);
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

      <form
        @submit.prevent="handleSubmit"
        class="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-6 lg:p-10 border border-white/50 flex flex-col gap-4 overflow-y-auto">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="md:col-span-2 flex items-center gap-2 mb-1">
            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</div>
            <h3 class="text-md font-bold text-gray-900 tracking-tight">Personal Credentials</h3>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-gray-600 ml-1">Full Name</label>
            <input v-model="formData.name" type="text" class="input-style" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-gray-600 ml-1">Email Address</label>
            <input v-model="formData.email" type="email" class="input-style" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-gray-600 ml-1">Phone Number</label>
            <input v-model="formData.phone" type="tel" class="input-style" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-gray-600 ml-1">Country</label>
              <input v-model="formData.country" type="text" class="input-style" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] font-bold text-gray-600 ml-1">Age</label>
              <input v-model="formData.age" type="number" class="input-style" />
            </div>
          </div>

          <div class="md:col-span-2 flex items-center gap-2 mt-2 mb-1">
            <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</div>
            <h3 class="text-md font-bold text-gray-900 tracking-tight">Experience & Identity</h3>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-gray-600 ml-1">Years of Experience</label>
            <select v-model="formData.experience_years" class="input-style appearance-none">
              <option :value="3">3-5 Years</option>
              <option :value="5">5-10 Years</option>
              <option :value="10">More than 10 Years</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-gray-600 ml-1">CV (PDF)</label>
            <div class="relative h-[42px]">
              <input type="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div class="w-full h-full px-4 bg-blue-50 border border-dashed border-blue-200 rounded-xl text-[12px] text-blue-600 flex justify-between items-center">
                <span>Upload CV</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
            </div>
          </div>

          <div class="group relative h-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center transition-all hover:bg-indigo-50">
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" />
            <span class="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase">ID Front</span>
          </div>

          <div class="group relative h-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center transition-all hover:bg-indigo-50">
            <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" />
            <span class="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase">ID Back</span>
          </div>
        </div>

        <div class="mt-4 flex flex-col items-center">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-md hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]">
            Send Application
          </button>
          <p v-if="status === 'success'" class="text-green-600 text-xs font-bold mt-2">
            Application Sent Successfully!
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
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap");

  .font-sans {
    font-family: "Inter", sans-serif;
  }

  
  .input-style {
    @apply w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] focus:border-blue-500 focus:bg-white transition-all outline-none;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }


  form::-webkit-scrollbar {
    width: 4px;
  }
  form::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
</style>