<script setup>
  import { reactive, ref, onMounted } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const settings = reactive({
    owner_name: "",
    developer_name: "",
    site_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    footer_text: "",
    team_members: [],
    payment_methods: [],
    social_links: {
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: ""
    },
    logo: null,
    favicon: null,
    existingLogo: "",
    existingFavicon: ""
  });

  const loading = ref(false);
  const saving = ref(false);

  async function loadSettings() {
    loading.value = true;
    try {
      const response = await api.get("/admin/settings");
      const data = response?.data?.data;
      if (data) {
        Object.assign(settings, data);
        settings.team_members = data.team_members || [];
        settings.payment_methods = data.payment_methods || [];
        settings.social_links = data.social_links || { facebook: "", twitter: "", linkedin: "", youtube: "" };
        settings.existingLogo = data.logo || "";
        settings.existingFavicon = data.favicon || "";
        settings.logo = null;
        settings.favicon = null;
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      loading.value = false;
    }
  }

  async function saveSettings() {
    saving.value = true;
    const formData = new FormData();
    Object.keys(settings).forEach(key => {
      if (['team_members', 'payment_methods', 'social_links'].includes(key)) {
        formData.append(key, JSON.stringify(settings[key]));
      } else if (['logo', 'favicon'].includes(key)) {
        if (settings[key]) formData.append(key, settings[key]);
      } else if (!['existingLogo', 'existingFavicon', 'theme_settings'].includes(key)) {
        formData.append(key, settings[key]);
      }
    });

    try {
      await api.post("/admin/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Swal.fire("Success", "Settings updated successfully", "success");
      await loadSettings();
    } catch (err) {
      Swal.fire("Error", "Failed to update settings", "error");
    } finally {
      saving.value = false;
    }
  }

  function addTeamMember() {
    settings.team_members.push({ name: "", role: "" });
  }

  function removeTeamMember(index) {
    settings.team_members.splice(index, 1);
  }

  function addPaymentMethod() {
    settings.payment_methods.push({ method: "", value: "" });
  }

  function removePaymentMethod(index) {
    settings.payment_methods.splice(index, 1);
  }

  onMounted(loadSettings);
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Global Configuration</h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">Control platform identity, branding, and system-wide parameters.</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-8">
      <!-- Section 1: Branding -->
      <section class="saas-card">
        <h3 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
          Branding & Identity
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Platform Name</label>
            <input v-model="settings.site_name" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Site Owner Name</label>
            <input v-model="settings.owner_name" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Platform Logo</label>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                <img v-if="settings.logo || settings.existingLogo" :src="settings.logo ? URL.createObjectURL(settings.logo) : settings.existingLogo" class="w-full h-full object-contain" />
              </div>
              <input type="file" @change="e => settings.logo = e.target.files[0]" class="text-xs text-gray-400" accept="image/*" />
            </div>
          </div>
          <div>
            <label class="form-label">Developer Name</label>
            <input v-model="settings.developer_name" type="text" class="form-input" />
          </div>
        </div>
      </section>

      <!-- Section 2: Contact Info -->
      <section class="saas-card">
        <h3 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Contact & Location
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Public Support Email</label>
            <input v-model="settings.contact_email" type="email" class="form-input" />
          </div>
          <div>
            <label class="form-label">Public Phone Number</label>
            <input v-model="settings.contact_phone" type="text" class="form-input" />
          </div>
          <div class="md:col-span-2">
            <label class="form-label">Physical Address</label>
            <input v-model="settings.address" type="text" class="form-input" />
          </div>
        </div>
      </section>

      <!-- Section 3: Dynamic Repeaters -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Team Members -->
        <section class="saas-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              Core Team members
            </h3>
            <button type="button" @click="addTeamMember" class="text-primary-600 font-bold text-xs hover:underline">+ Add Member</button>
          </div>
          <div class="space-y-4">
            <div v-for="(member, index) in settings.team_members" :key="index" class="flex gap-3 animate-slide-right">
              <input v-model="member.name" type="text" placeholder="Name" class="form-input flex-[2]" />
              <input v-model="member.role" type="text" placeholder="Role" class="form-input flex-[1]" />
              <button type="button" @click="removeTeamMember(index)" class="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
            <div v-if="settings.team_members.length === 0" class="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
               <p class="text-xs font-bold text-gray-300">No team members added yet.</p>
            </div>
          </div>
        </section>

        <!-- Payment Settings -->
        <section class="saas-card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              Payment Gateways
            </h3>
            <button type="button" @click="addPaymentMethod" class="text-primary-600 font-bold text-xs hover:underline">+ Add Option</button>
          </div>
          <div class="space-y-4">
            <div v-for="(pay, index) in settings.payment_methods" :key="index" class="flex gap-3 animate-slide-left">
              <input v-model="pay.method" type="text" placeholder="Provider (e.g. Vodafone Cash)" class="form-input flex-[1]" />
              <input v-model="pay.value" type="text" placeholder="Account / Number" class="form-input flex-[1]" />
              <button type="button" @click="removePaymentMethod(index)" class="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
            <div v-if="settings.payment_methods.length === 0" class="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
               <p class="text-xs font-bold text-gray-300">No payment methods configured.</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Section 4: Social Media -->
      <section class="saas-card">
        <h3 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          Social Connectivity
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(val, key) in settings.social_links" :key="key">
            <label class="form-label capitalize">{{ key }}</label>
            <input v-model="settings.social_links[key]" type="url" :placeholder="'https://'+key+'.com/...'" class="form-input" />
          </div>
        </div>
      </section>

      <!-- Submit Bar -->
      <div class="sticky bottom-6 flex items-center justify-between bg-white/90 backdrop-blur-xl border border-primary-100 p-4 rounded-3xl shadow-2xl shadow-primary-100/50 z-40">
        <p class="text-xs text-gray-400 font-bold ml-4">Unsaved changes will be lost on refresh.</p>
        <button type="submit" :disabled="saving" class="btn-primary px-10 py-3 shadow-lg shadow-primary-200">
           {{ saving ? 'Syncing...' : 'Deploy Settings' }}
        </button>
      </div>
    </form>
  </div>
</template>
