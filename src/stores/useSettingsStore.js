import { defineStore } from 'pinia';
import api from '../services/axios';

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
      social_links: {}
    };

    return {
      settings: saved ? JSON.parse(saved) : defaultSettings,
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
        }
      } catch (error) {
        console.error('Failed to load global settings:', error);
      }
    }
  }
});
