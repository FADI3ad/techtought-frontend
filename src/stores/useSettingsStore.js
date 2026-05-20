import { defineStore } from 'pinia';
import api from '../services/axios';

function hexToRgb(hex) {
  if (!hex) return [79, 70, 229];
  let r = 0, g = 0, b = 0;
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

export function applyTheme(themeSettings) {
  if (!themeSettings) return;
  const root = document.documentElement;
  const primaryColor = themeSettings.primary_color || "#4f46e5";
  const fontFamily = themeSettings.font_family || "Poppins";
  
  // Dynamically load Google Font if not already loaded
  const fontId = 'dynamic-google-font';
  let link = document.getElementById(fontId);
  if (!link) {
    link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  const formattedFont = fontFamily.replace(/\s+/g, '+');
  link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800;900&display=swap`;
  
  const rgb = hexToRgb(primaryColor);
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

  root.style.setProperty("--color-primary", primaryColor);
  root.style.setProperty("--font-primary", fontFamily);
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const saved = localStorage.getItem('app_settings');
    const defaultSettings = {
      site_name: 'TechTought',
      logo: '',
      favicon: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      social_links: {},
      theme_settings: {
        primary_color: '#4f46e5',
        font_family: 'Poppins'
      }
    };

    const settings = saved ? JSON.parse(saved) : defaultSettings;
    
    if (settings.theme_settings) {
      applyTheme(settings.theme_settings);
    }

    return {
      settings,
      isLoaded: false
    };
  },
  actions: {
    async fetchSettings() {
      if (this.isLoaded) return;
      try {
        const response = await api.get('/settings');
        if (response.data.data) {
          this.settings = { ...this.settings, ...response.data.data };
          this.isLoaded = true;
          localStorage.setItem('app_settings', JSON.stringify(this.settings));
          
          if (this.settings.site_name) {
            document.title = this.settings.site_name;
          }

          if (this.settings.theme_settings) {
            applyTheme(this.settings.theme_settings);
          }
        }
      } catch (error) {
        console.error('Failed to load global settings:', error);
      }
    }
  }
});
