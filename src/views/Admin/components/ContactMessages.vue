<script setup>
  import { ref, onMounted, inject } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const messages = ref([]);
  const loading = ref(false);
  const error = ref("");
  const expandedMessageId = ref(null);

  const updateContactCount = inject('updateContactCount');

  async function loadMessages() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/admin/contacts");
      messages.value = response?.data?.data?.data || [];
      updateContactCount();
    } catch (err) {
      error.value = "Failed to load contact messages.";
    } finally {
      loading.value = false;
    }
  }

  async function toggleExpand(msg) {
    if (expandedMessageId.value === msg.id) {
      expandedMessageId.value = null;
    } else {
      expandedMessageId.value = msg.id;
      if (!msg.is_read) {
        await markAsRead(msg);
      }
    }
  }

  async function markAsRead(msg) {
    try {
      await api.patch(`/admin/contacts/${msg.id}/read`);
      msg.is_read = true;
      updateContactCount();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  async function removeMessage(id) {
    const result = await Swal.fire({
      title: 'Delete Message?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/contacts/${id}`);
      messages.value = messages.value.filter(m => m.id !== id);
      updateContactCount();
      Swal.fire('Deleted!', 'Message removed.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to delete message.', 'error');
    }
  }

  onMounted(loadMessages);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Communication Inbox</h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">Review user inquiries and support requests.</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
      <p class="text-gray-500 font-bold text-sm">Inbox is empty.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="msg in messages" :key="msg.id" class="saas-card !p-0 overflow-hidden transition-all duration-300" :class="[expandedMessageId === msg.id ? 'ring-2 ring-primary-500 shadow-xl' : 'hover:border-primary-100']">
        <div @click="toggleExpand(msg)" class="flex items-center gap-4 px-6 py-4 cursor-pointer select-none">
          <div class="relative shrink-0">
            <div class="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs border border-primary-100">
              {{ msg.name.charAt(0) }}
            </div>
            <span v-if="!msg.is_read" class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-600 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900 truncate" :class="{'text-primary-600': !msg.is_read}">{{ msg.name }}</span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {{ new Date(msg.created_at).toLocaleDateString() }}</span>
            </div>
            <p class="text-xs text-gray-500 font-medium truncate mt-0.5">{{ msg.subject }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button @click.stop="removeMessage(msg.id)" class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <svg class="w-5 h-5 text-gray-300 transition-transform duration-300" :class="{'rotate-180': expandedMessageId === msg.id}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>

        <div v-if="expandedMessageId === msg.id" class="px-6 pb-6 pt-2 border-t border-gray-50 animate-fade-in">
           <div class="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div>
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                 <a :href="'mailto:'+msg.email" class="text-sm font-bold text-primary-600 hover:underline">{{ msg.email }}</a>
               </div>
               <div>
                 <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Received At</p>
                 <p class="text-sm font-bold text-gray-900">{{ new Date(msg.created_at).toLocaleString() }}</p>
               </div>
             </div>
             <div>
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message Content</p>
               <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ msg.message }}</p>
             </div>
             <div class="mt-8 flex gap-3">
               <a :href="'mailto:'+msg.email" class="btn-primary text-xs py-2 px-4 flex items-center gap-2">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                 Reply via Email
               </a>
               <button @click="removeMessage(msg.id)" class="btn-secondary text-xs py-2 px-4 text-red-500 hover:bg-red-50 border-red-100">Delete Permanently</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
