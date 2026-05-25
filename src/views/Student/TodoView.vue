<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import api from "../../services/axios";
  import Swal from "sweetalert2";
  import Footer from "../../components/layout/Footer.vue";

  // State
  const todos = ref([]);
  const loading = ref(true);
  const submitting = ref(false);
  
  // Filter & Sort State
  const search = ref("");
  const statusFilter = ref("all");
  const priorityFilter = ref("all");
  const sortBy = ref("created_at");
  const sortOrder = ref("desc");

  // Form Modal States
  const isEditModalOpen = ref(false);
  const isAddFormOpen = ref(false);
  
  const form = ref({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  });

  const editingTodoId = ref(null);
  const editForm = ref({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  });

  // Fetch Todos
  const fetchTodos = async () => {
    loading.value = true;
    try {
      const response = await api.get("/todos", {
        params: {
          search: search.value,
          status: statusFilter.value,
          priority: priorityFilter.value,
          sort_by: sortBy.value,
          sort_order: sortOrder.value,
        },
      });
      if (response.data.status === "success") {
        todos.value = response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load tasks. Please try again.",
        icon: "error",
        confirmButtonColor: "rgb(var(--color-primary-600))",
      });
    } finally {
      loading.value = false;
    }
  };

  // Watchers to trigger automatic fetch on filter/sort changes
  watch([statusFilter, priorityFilter, sortBy, sortOrder], () => {
    fetchTodos();
  });

  // Debounced Search Watcher
  let searchTimeout = null;
  watch(search, () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fetchTodos();
    }, 400);
  });

  // Create Todo
  const handleAddTodo = async () => {
    if (!form.value.title.trim()) return;
    submitting.value = true;
    try {
      const response = await api.post("/todos", form.value);
      if (response.data.status === "success") {
        todos.value.unshift(response.data.data);
        // Reset form
        form.value = {
          title: "",
          description: "",
          priority: "medium",
          status: "pending",
          due_date: "",
        };
        isAddFormOpen.value = false;
        
        Swal.fire({
          title: "Created!",
          text: "Task has been added successfully.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to create task. Please check your inputs.",
        icon: "error",
        confirmButtonColor: "rgb(var(--color-primary-600))",
      });
    } finally {
      submitting.value = false;
    }
  };

  // Toggle Todo Status Quick Action
  const toggleTodoStatus = async (todo) => {
    // Optimistic Update
    const oldStatus = todo.status;
    todo.status = todo.status === "completed" ? "pending" : "completed";
    
    try {
      const response = await api.patch(`/todos/${todo.id}/toggle`);
      if (response.data.status === "success") {
        todo.status = response.data.data.status;
        
        Swal.fire({
          title: todo.status === "completed" ? "Completed!" : "Reopened!",
          text: `Task marked as ${todo.status}.`,
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      // Revert on failure
      todo.status = oldStatus;
      console.error("Failed to toggle status:", error);
    }
  };

  // Open Edit Modal
  const openEditModal = (todo) => {
    editingTodoId.value = todo.id;
    editForm.value = {
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      status: todo.status,
      due_date: todo.due_date ? todo.due_date.substring(0, 16) : "",
    };
    isEditModalOpen.value = true;
  };

  // Update Todo
  const handleUpdateTodo = async () => {
    if (!editForm.value.title.trim()) return;
    submitting.value = true;
    try {
      const response = await api.put(`/todos/${editingTodoId.value}`, editForm.value);
      if (response.data.status === "success") {
        const index = todos.value.findIndex((t) => t.id === editingTodoId.value);
        if (index !== -1) {
          todos.value[index] = response.data.data;
        }
        isEditModalOpen.value = false;
        
        Swal.fire({
          title: "Updated!",
          text: "Task updated successfully.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update task.",
        icon: "error",
        confirmButtonColor: "rgb(var(--color-primary-600))",
      });
    } finally {
      submitting.value = false;
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (todoId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/todos/${todoId}`);
        if (response.data.status === "success") {
          todos.value = todos.value.filter((t) => t.id !== todoId);
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
      } catch (error) {
        console.error("Failed to delete todo:", error);
        Swal.fire("Error!", "Failed to delete task.", "error");
      }
    }
  };

  // Progress metrics
  const totalCount = computed(() => todos.value.length);
  const completedCount = computed(() => todos.value.filter((t) => t.status === "completed").length);
  const progressPercent = computed(() => {
    if (totalCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCount.value) * 100);
  });

  // Helpers
  const formatDueDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === "completed") return false;
    return new Date(dateStr) < new Date();
  };

  onMounted(() => {
    fetchTodos();
  });
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Header aligned with the website theme (bg-primary-900) -->
    <div class="bg-primary-900 text-white py-12">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-black mb-2">My Workspace Tasks</h1>
          <p class="text-primary-200">Organize, track, and complete your learning goals and assignments.</p>
        </div>
        
        <!-- Progress bar matching website styling -->
        <div class="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 min-w-[210px]">
          <div class="relative flex items-center justify-center">
            <svg class="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.15)" stroke-width="4" fill="transparent" />
              <circle cx="32" cy="32" r="26" stroke="currentColor" class="text-white transition-all duration-1000 ease-out" stroke-width="4" fill="transparent"
                :stroke-dasharray="163" :stroke-dashoffset="163 - (163 * progressPercent) / 100"
                stroke-linecap="round" />
            </svg>
            <span class="absolute text-sm font-bold text-white">{{ progressPercent }}%</span>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-primary-200 font-bold">Progress</p>
            <h3 class="text-xl font-bold text-white">{{ completedCount }} / {{ totalCount }} Done</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Container with correct max-width -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 py-12 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Controls & Filters (Left side) -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-6">
          <div class="flex items-center justify-between border-b pb-4">
            <h3 class="text-lg font-bold text-gray-900">Filters & Sorting</h3>
            <button 
              @click="isAddFormOpen = !isAddFormOpen" 
              class="lg:hidden bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Tasks</label>
            <div class="relative">
              <input 
                v-model="search"
                type="text" 
                placeholder="Find tasks..."
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
              />
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <div class="flex flex-col gap-1.5">
              <button 
                @click="statusFilter = 'all'" 
                :class="statusFilter === 'all' ? 'bg-primary-50 text-primary-700 border-primary-100 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'"
                class="w-full text-left px-4 py-2 rounded-lg border text-sm transition-all flex items-center justify-between"
              >
                <span>All Tasks</span>
                <span class="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">{{ totalCount }}</span>
              </button>
              <button 
                @click="statusFilter = 'pending'" 
                :class="statusFilter === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'"
                class="w-full text-left px-4 py-2 rounded-lg border text-sm transition-all flex items-center justify-between"
              >
                <span>Pending</span>
                <span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {{ todos.filter(t => t.status === 'pending').length }}
                </span>
              </button>
              <button 
                @click="statusFilter = 'in_progress'" 
                :class="statusFilter === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'"
                class="w-full text-left px-4 py-2 rounded-lg border text-sm transition-all flex items-center justify-between"
              >
                <span>In Progress</span>
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {{ todos.filter(t => t.status === 'in_progress').length }}
                </span>
              </button>
              <button 
                @click="statusFilter = 'completed'" 
                :class="statusFilter === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 font-bold' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'"
                class="w-full text-left px-4 py-2 rounded-lg border text-sm transition-all flex items-center justify-between"
              >
                <span>Completed</span>
                <span class="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">{{ completedCount }}</span>
              </button>
            </div>
          </div>

          <!-- Priority Filter -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
            <select 
              v-model="priorityFilter"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <!-- Sorting -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
            <div class="grid grid-cols-2 gap-2">
              <select 
                v-model="sortBy"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
              >
                <option value="created_at">Date Created</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <select 
                v-model="sortOrder"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Task List Area (Right/Center) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Quick Add Task Collapse Header -->
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <button 
              @click="isAddFormOpen = !isAddFormOpen"
              class="w-full flex items-center justify-between font-bold text-gray-700 hover:text-primary-600 transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="bg-primary-50 text-primary-700 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                </span>
                Create A New Workspace Task
              </span>
              <span class="text-xs text-primary-600 underline font-semibold">{{ isAddFormOpen ? 'Hide Form' : 'Show Form' }}</span>
            </button>

            <!-- Inline Form collapse -->
            <div v-show="isAddFormOpen" class="mt-5 border-t pt-5 space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title*</label>
                <input 
                  v-model="form.title"
                  type="text" 
                  placeholder="E.g., Finish Module 3 Assignment"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea 
                  v-model="form.description"
                  placeholder="Details about task goals..."
                  rows="3"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    v-model="form.priority"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    v-model="form.status"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                  <input 
                    v-model="form.due_date"
                    type="datetime-local"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                  />
                </div>
              </div>

              <div class="flex justify-end pt-3">
                <button 
                  @click="handleAddTodo"
                  :disabled="submitting || !form.title.trim()"
                  class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Save Task
                </button>
              </div>
            </div>
          </div>

          <!-- Loading skeletons -->
          <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="bg-white rounded-xl p-5 border border-gray-200 animate-pulse flex items-center justify-between">
              <div class="flex items-center gap-4 w-2/3">
                <div class="w-6 h-6 bg-gray-100 rounded-full"></div>
                <div class="space-y-2 w-full">
                  <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div class="w-12 h-6 bg-gray-100 rounded-full"></div>
            </div>
          </div>

          <!-- Todo list -->
          <div v-else-if="todos.length > 0" class="space-y-4">
            <TransitionGroup name="list" tag="div" class="space-y-4">
              <div 
                v-for="todo in todos" 
                :key="todo.id"
                :class="[
                  todo.status === 'completed' ? 'border-emerald-100 bg-emerald-50/10 opacity-75' : 'border-gray-200 bg-white',
                  isOverdue(todo.due_date, todo.status) ? 'border-l-4 border-l-red-500' : ''
                ]"
                class="rounded-xl p-5 border shadow-sm transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <!-- Left Details -->
                <div class="flex items-start gap-4">
                  <!-- Checkbox -->
                  <button 
                    @click="toggleTodoStatus(todo)"
                    class="mt-1 focus:outline-none flex-shrink-0"
                  >
                    <div 
                      :class="todo.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent hover:border-primary-500 hover:bg-primary-50/40'"
                      class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>

                  <div class="space-y-1">
                    <h3 
                      :class="todo.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'"
                      class="font-bold text-base leading-snug"
                    >
                      {{ todo.title }}
                    </h3>
                    
                    <p 
                      v-if="todo.description"
                      :class="todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'"
                      class="text-sm line-clamp-2 max-w-xl"
                    >
                      {{ todo.description }}
                    </p>

                    <!-- Badges row -->
                    <div class="flex flex-wrap items-center gap-3 pt-2">
                      <!-- Due date -->
                      <span 
                        :class="[
                          isOverdue(todo.due_date, todo.status) ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200',
                          todo.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 line-through' : ''
                        ]"
                        class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{{ formatDueDate(todo.due_date) }}</span>
                        <span v-if="isOverdue(todo.due_date, todo.status)" class="text-[10px] uppercase font-bold text-red-500">(Overdue)</span>
                      </span>

                      <!-- Priority -->
                      <span 
                        :class="{
                          'bg-red-50 text-red-700 border-red-100': todo.priority === 'high',
                          'bg-amber-50 text-amber-700 border-amber-100': todo.priority === 'medium',
                          'bg-blue-50 text-blue-700 border-blue-100': todo.priority === 'low'
                        }"
                        class="inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider"
                      >
                        {{ todo.priority }}
                      </span>
                      
                      <!-- Status (if All) -->
                      <span 
                        v-if="statusFilter === 'all'"
                        :class="{
                          'bg-amber-50 text-amber-700 border-amber-100': todo.status === 'pending',
                          'bg-blue-50 text-blue-700 border-blue-100': todo.status === 'in_progress',
                          'bg-emerald-50 text-emerald-700 border-emerald-100': todo.status === 'completed'
                        }"
                        class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border capitalize"
                      >
                        {{ todo.status.replace('_', ' ') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-1 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="openEditModal(todo)"
                    class="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Edit Task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDeleteTodo(todo.id)"
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <div class="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
            <p class="text-gray-500 max-w-sm mx-auto mb-6">Create a new workspace task to start tracking your progress.</p>
            <button 
              @click="isAddFormOpen = true"
              class="px-8 py-3 btn-global shadow-lg shadow-primary-100"
            >
              Add Your First Task
            </button>
          </div>

        </div>

      </div>

      <!-- Edit Task Modal -->
      <div 
        v-if="isEditModalOpen"
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
      >
        <div class="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <h3 class="text-xl font-bold text-gray-900">Edit Task Details</h3>
            <button 
              @click="isEditModalOpen = false"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title*</label>
              <input 
                v-model="editForm.title"
                type="text" 
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description (Optional)</label>
              <textarea 
                v-model="editForm.description"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                <select 
                  v-model="editForm.priority"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select 
                  v-model="editForm.status"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                <input 
                  v-model="editForm.due_date"
                  type="datetime-local"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-gray-800"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t mt-6">
            <button 
              @click="isEditModalOpen = false"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-5 rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
            <button 
              @click="handleUpdateTodo"
              :disabled="submitting || !editForm.title.trim()"
              class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Save Changes
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer matching website footer style -->
    <Footer />
  </div>
</template>

<style scoped>
  /* Transition animations */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .list-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  .list-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
</style>
