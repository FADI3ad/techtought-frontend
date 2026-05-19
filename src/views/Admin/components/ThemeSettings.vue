<script setup>
  import { reactive, ref, onMounted, watch } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const themeSettings = reactive({
    primary_color: "#4f46e5",
    font_family: "Poppins",
  });

  const loading = ref(false);
  const saving = ref(false);

  const fontOptions = [
    { label: "Poppins", value: "Poppins" },
    { label: "Inter", value: "Inter" },
    { label: "Roboto", value: "Roboto" },
    { label: "Open Sans", value: "Open Sans" },
    { label: "Outfit", value: "Outfit" },
  ];

  async function loadSettings() {
    loading.value = true;
    try {
      const response = await api.get("/admin/settings");
      const data = response?.data?.data;
      if (data && data.theme_settings) {
        Object.assign(themeSettings, data.theme_settings);
      }
      applyThemeLocally();
    } catch (err) {
      console.error("Failed to load theme settings:", err);
    } finally {
      loading.value = false;
    }
  }

  async function saveSettings() {
    saving.value = true;
    const formData = new FormData();

    formData.append("theme_settings", JSON.stringify(themeSettings));

    try {
      await api.post("/admin/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Theme settings updated successfully",
        confirmButtonColor: "var(--color-primary)",
      });
      applyThemeLocally();
    } catch (err) {
      Swal.fire("Error", "Failed to update theme settings", "error");
    } finally {
      saving.value = false;
    }
  }

  function hexToRgb(hex) {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return [r, g, b];
  }

  function mixColors(color1, color2, weight) {
    const w = weight / 100;
    const r = Math.round(color1[0] * w + color2[0] * (1 - w));
    const g = Math.round(color1[1] * w + color2[1] * (1 - w));
    const b = Math.round(color1[2] * w + color2[2] * (1 - w));
    return `${r} ${g} ${b}`;
  }

  function applyThemeLocally() {
    const root = document.documentElement;
    const rgb = hexToRgb(themeSettings.primary_color);
    const white = [255, 255, 255];
    const black = [0, 0, 0];

    root.style.setProperty("--color-primary-50", mixColors(rgb, white, 10));
    root.style.setProperty("--color-primary-100", mixColors(rgb, white, 20));
    root.style.setProperty("--color-primary-200", mixColors(rgb, white, 40));
    root.style.setProperty("--color-primary-300", mixColors(rgb, white, 60));
    root.style.setProperty("--color-primary-400", mixColors(rgb, white, 80));
    root.style.setProperty("--color-primary-500", mixColors(rgb, white, 100));
    root.style.setProperty("--color-primary-600", mixColors(rgb, white, 100));
    root.style.setProperty("--color-primary-700", mixColors(rgb, black, 80));
    root.style.setProperty("--color-primary-800", mixColors(rgb, black, 60));
    root.style.setProperty("--color-primary-900", mixColors(rgb, black, 40));

    root.style.setProperty("--color-primary", themeSettings.primary_color);
    root.style.setProperty("--font-primary", themeSettings.font_family);
  }

  watch(
    themeSettings,
    () => {
      applyThemeLocally();
    },
    { deep: true },
  );

  onMounted(loadSettings);
</script>

<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
        Theme Settings
      </h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">
        Control platform colors, typography, and visual appearance.
      </p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div
        class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-8">
      <!-- Section 1: Colors -->
      <section
        class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          Colors
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2"
              >Primary Color</label
            >
            <div class="flex items-center gap-3">
              <input
                v-model="themeSettings.primary_color"
                type="color"
                class="w-14 h-14 rounded-xl cursor-pointer border-0 p-1 bg-gray-50" />
              <input
                v-model="themeSettings.primary_color"
                type="text"
                class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium" />
            </div>
            <p class="text-xs text-gray-400 mt-2 font-medium">
              This color is used for primary buttons, active links, and
              highlights.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: Typography -->
      <section
        class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3
          class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
          Typography
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2"
              >Font Family</label
            >
            <select
              v-model="themeSettings.font_family"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium appearance-none">
              <option
                v-for="font in fontOptions"
                :key="font.value"
                :value="font.value">
                {{ font.label }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- Submit Bar -->
      <div
        class="sticky bottom-6 flex items-center justify-between bg-white/90 backdrop-blur-xl border border-primary-100 p-4 rounded-3xl shadow-2xl shadow-primary-100/50 z-40">
        <p class="text-xs text-gray-400 font-bold ml-4">
          Unsaved changes will be lost on refresh.
        </p>
        <button
          type="submit"
          :disabled="saving"
          class="bg-[var(--color-primary)] text-white font-bold rounded-xl px-10 py-3 shadow-lg shadow-primary-200 transition-all disabled:opacity-70">
          {{ saving ? "Syncing..." : "Save Theme" }}
        </button>
      </div>
    </form>
  </div>
</template>
