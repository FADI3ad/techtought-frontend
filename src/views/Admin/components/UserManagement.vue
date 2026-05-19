<script setup>
  import { ref, onMounted } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const users = ref([]);
  const loading = ref(false);
  const error = ref("");

  async function loadUsers() {
    loading.value = true;
    error.value = "";
    try {
      const response = await api.get("/admin/users");
      users.value = response?.data?.data?.users || [];
    } catch (err) {
      error.value = "Failed to load users.";
    } finally {
      loading.value = false;
    }
  }

  async function toggleUserBlock(user) {
    const action = user.is_blocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} User?`,
      text: `Are you sure you want to ${action} ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'block' ? '#ef4444' : '#10b981',
      confirmButtonText: `Yes, ${action}!`
    });
    
    if (!result.isConfirmed) return;

    try {
      await api.patch(`/admin/users/${user.id}/toggle-block`);
      await loadUsers();
      Swal.fire('Success', `User has been ${action}ed.`, 'success');
    } catch (err) {
      Swal.fire('Error', `Failed to ${action} user.`, 'error');
    }
  }

  onMounted(loadUsers);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header>
      <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Access Control</h1>
      <p class="text-[13px] text-gray-500 font-medium mt-1">Manage platform members, students, and account statuses.</p>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="saas-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100">
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Role</th>
              <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</th>
              <th class="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs border border-primary-100">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-gray-900">{{ user.name }}</span>
                    <span class="text-xs text-gray-400 font-medium">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" 
                  :class="user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-primary-50 text-primary-600'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span v-if="user.is_blocked" class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Blocked</span>
                <span v-else class="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Active</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="toggleUserBlock(user)" :class="user.is_blocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-500 hover:bg-red-50'" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                  {{ user.is_blocked ? 'Unblock' : 'Block Access' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
