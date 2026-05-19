<script setup>
  import { ref, onMounted, computed } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const subscriptions = ref([]);
  const loading = ref(false);
  const error = ref("");
  const searchQuery = ref("");

  async function loadSubscriptions() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/admin/subscriptions");
      subscriptions.value = response?.data?.data?.subscriptions || [];
    } catch (err) {
      console.error("Failed to load newsletter subscribers:", err);
      error.value = "Failed to load newsletter subscriptions.";
    } finally {
      loading.value = false;
    }
  }

  // Real-time email search filter
  const filteredSubscriptions = computed(() => {
    if (!searchQuery.value) return subscriptions.value;
    const query = searchQuery.value.toLowerCase().trim();
    return subscriptions.value.filter(sub => 
      sub.email && sub.email.toLowerCase().includes(query)
    );
  });

  // Export subscribers to CSV file
  function exportToCSV() {
    if (subscriptions.value.length === 0) {
      Swal.fire("Info", "No subscribers available to export.", "info");
      return;
    }

    const headers = ["ID", "Email Address", "Joined At"];
    const rows = subscriptions.value.map(sub => [
      sub.id,
      sub.email,
      new Date(sub.created_at).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: "Export Success",
      text: "Subscribers list exported successfully.",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000
    });
  }

  // Remove subscriber with SweetAlert2 confirmation
  async function removeSubscription(sub) {
    const result = await Swal.fire({
      title: "Remove Subscriber?",
      text: `Are you sure you want to remove "${sub.email}" from the newsletter list?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove email"
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/subscriptions/${sub.id}`);
      await loadSubscriptions();
      Swal.fire("Removed!", "The subscription has been removed.", "success");
    } catch (err) {
      console.error("Failed to delete subscription:", err);
      Swal.fire("Error", "Failed to remove subscription. Please try again.", "error");
    }
  }

  // Copy all emails to clipboard (Comma-separated)
  function copyAllEmails() {
    if (subscriptions.value.length === 0) return;
    const emailsList = subscriptions.value.map(sub => sub.email).join(", ");
    navigator.clipboard.writeText(emailsList).then(() => {
      Swal.fire({
        title: "Copied!",
        text: "All email addresses copied to clipboard.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000
      });
    }).catch(err => {
      console.error("Failed to copy emails:", err);
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  onMounted(loadSubscriptions);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Newsletter Subscribers</h1>
        <p class="text-[13px] text-gray-500 font-medium mt-1">Manage and export marketing list subscribers.</p>
      </div>

      <!-- Action Buttons -->
      <div v-if="!loading && subscriptions.length > 0" class="flex gap-2">
        <button 
          @click="copyAllEmails"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h5m-5 4h5m-5 4h5" />
          </svg>
          Copy All Emails
        </button>

        <button 
          @click="exportToCSV"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm transition-all cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>
    </header>

    <!-- Stats & Search Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Subscribers Card -->
      <div class="saas-card flex items-center justify-between p-6">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Subscribers</p>
          <h3 class="text-3xl font-extrabold text-gray-900 mt-2">{{ subscriptions.length }}</h3>
        </div>
        <div class="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      </div>

      <!-- Search Input Card -->
      <div class="saas-card md:col-span-2 flex items-center px-6 py-4">
        <div class="w-full flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search email list..." 
            class="w-full bg-transparent border-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium" />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="saas-card text-center py-12 text-red-500 font-medium">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredSubscriptions.length === 0" class="saas-card text-center py-16">
      <div class="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2h-2M4 13V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0h2" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-gray-900">No subscribers found</h3>
      <p class="text-xs text-gray-500 mt-1">
        {{ searchQuery ? "No email matched your search query." : "No one has subscribed to the newsletter yet." }}
      </p>
    </div>

    <!-- Table of Subscribers -->
    <div v-else class="saas-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">#</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
              <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest w-24">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr 
              v-for="(sub, idx) in filteredSubscriptions" 
              :key="sub.id" 
              class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-mono text-xs text-gray-400">{{ idx + 1 }}</td>
              <td class="px-6 py-4">
                <span class="font-semibold text-gray-900 text-sm">{{ sub.email }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs text-gray-500 font-medium">{{ formatDate(sub.created_at) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="removeSubscription(sub)"
                  class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Remove Subscriber">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
