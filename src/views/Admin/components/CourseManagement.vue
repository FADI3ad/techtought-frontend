<script setup>
  import { ref, reactive, onMounted, inject } from "vue";
  import api from "../../../services/axios";
  import Swal from "sweetalert2";

  const categories = inject('categories', []);

  const courses = ref([]);
  const loading = ref(false);
  const error = ref("");
  const filters = reactive({
    search: "",
    categoryId: "",
    subCategoryId: "",
    isFree: "",
    rating: ""
  });

  const selectedCourse = ref(null);
  const showModal = ref(false);
  const comments = ref([]);
  const commentsLoading = ref(false);

  async function loadCourses() {
    loading.value = true;
    error.value = "";
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.category_id = filters.categoryId;
      if (filters.subCategoryId) params.sub_category_id = filters.subCategoryId;
      if (filters.isFree !== "") params.is_free = filters.isFree;
      if (filters.rating) params.min_rating = filters.rating;

      const response = await api.get("/admin/courses", { params });
      courses.value = response?.data?.data?.courses?.data || [];
    } catch (err) {
      error.value = "Failed to load courses.";
    } finally {
      loading.value = false;
    }
  }

  async function removeCourse(course) {
    const result = await Swal.fire({
      title: 'Delete Course?',
      text: `Are you sure you want to delete "${course.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/admin/courses/${course.slug}`);
      await loadCourses();
      Swal.fire('Deleted!', 'Course has been removed.', 'success');
    } catch (err) {
      Swal.fire('Error', "Failed to delete course.", 'error');
    }
  }

  async function viewDetails(course) {
    selectedCourse.value = course;
    showModal.value = true;
    await loadComments(course.slug);
  }

  async function loadComments(slug) {
    commentsLoading.value = true;
    try {
      const response = await api.get(`/courses/${slug}/comments`);
      comments.value = response?.data?.data || [];
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      commentsLoading.value = false;
    }
  }

  async function removeComment(id) {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "Are you sure?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/comments/${id}`);
      comments.value = comments.value.filter(c => c.id !== id);
      Swal.fire('Deleted!', 'Comment removed.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to delete comment.', 'error');
    }
  }

  onMounted(loadCourses);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Curriculum Moderation</h1>
        <p class="text-[13px] text-gray-500 font-medium mt-1">Audit and manage all platform educational content.</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="loadCourses" class="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
           Sync Data
        </button>
      </div>
    </header>

    <!-- Filter Bar -->
    <div class="saas-card bg-white/80 backdrop-blur-md border-primary-50 shadow-sm flex flex-wrap items-center gap-4 py-4 px-6">
      <div class="flex-grow min-w-[200px] relative">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="filters.search" @input="loadCourses" type="text" placeholder="Search by title..." class="w-full pl-9 pr-4 py-2 bg-gray-50 border-gray-100 rounded-xl text-sm focus:bg-white focus:border-primary-500 outline-none transition-all" />
      </div>
      
      <select v-model="filters.categoryId" @change="loadCourses" class="bg-gray-50 border-gray-100 rounded-xl text-xs font-bold text-gray-600 px-4 py-2.5 outline-none focus:border-primary-500">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <select v-model="filters.isFree" @change="loadCourses" class="bg-gray-50 border-gray-100 rounded-xl text-xs font-bold text-gray-600 px-4 py-2.5 outline-none focus:border-primary-500">
        <option value="">All Prices</option>
        <option value="1">Free Only</option>
        <option value="0">Paid Only</option>
      </select>

      <select v-model="filters.rating" @change="loadCourses" class="bg-gray-50 border-gray-100 rounded-xl text-xs font-bold text-gray-600 px-4 py-2.5 outline-none focus:border-primary-500">
        <option value="">All Ratings</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
      </select>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="courses.length === 0" class="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
      <p class="text-gray-500 font-bold text-sm">No courses match your criteria.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="saas-card group hover:border-primary-200 hover:shadow-xl transition-all flex flex-col h-full">
        <div class="relative h-44 rounded-2xl overflow-hidden mb-4 shrink-0">
          <img :src="course.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-3 left-3 flex gap-2">
            <span v-if="course.is_free" class="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg">FREE</span>
            <span v-else class="px-2 py-1 bg-primary-600 text-white text-[10px] font-bold rounded-lg shadow-lg">${{ course.price }}</span>
          </div>
        </div>

        <div class="flex-grow">
          <h3 class="font-bold text-gray-900 line-clamp-2 leading-snug h-12 mb-2">{{ course.title }}</h3>
          <div class="flex items-center gap-2 mb-4">
             <div class="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                <img src="../../../assets/images/user.png" class="w-full h-full object-cover" />
             </div>
             <span class="text-xs font-bold text-gray-500">{{ course.instructor?.name || 'Unknown' }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div class="flex items-center gap-1.5 text-amber-500">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="text-xs font-bold text-gray-900">{{ course.rating || '0.0' }}</span>
          </div>
          <div class="flex items-center gap-1">
             <button @click="viewDetails(course)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
             </button>
             <button @click="removeCourse(course)" class="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
       <div class="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up">
          <div class="p-8 border-b border-gray-100 flex items-start justify-between bg-primary-50/30">
             <div class="flex gap-6">
                <div class="w-32 h-32 rounded-3xl overflow-hidden shadow-lg shrink-0 border-4 border-white">
                   <img :src="selectedCourse.image_url" class="w-full h-full object-cover" />
                </div>
                <div class="space-y-3">
                   <h2 class="text-2xl font-extrabold text-gray-900 leading-tight">{{ selectedCourse.title }}</h2>
                   <div class="flex flex-wrap gap-2">
                      <span class="px-3 py-1 bg-white/80 border border-primary-100 rounded-full text-[10px] font-bold text-primary-600 uppercase">{{ selectedCourse.category?.name }}</span>
                      <span class="px-3 py-1 bg-white/80 border border-primary-100 rounded-full text-[10px] font-bold text-primary-600 uppercase">{{ selectedCourse.sub_category?.name }}</span>
                      <span class="px-3 py-1 bg-amber-100/50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-700 flex items-center gap-1">
                         ★ {{ selectedCourse.rating || '0.0' }}
                      </span>
                   </div>
                </div>
             </div>
             <button @click="showModal = false" class="p-2 bg-white/80 hover:bg-white rounded-2xl border border-gray-100 transition-all text-gray-400 hover:text-gray-900">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
          </div>

          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div class="lg:col-span-2 space-y-8">
                <section>
                   <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Course Description</h3>
                   <p class="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{{ selectedCourse.description }}</p>
                </section>

                <section>
                   <div class="flex items-center justify-between mb-6">
                      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Public Discussions</h3>
                      <span class="px-2.5 py-0.5 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500">{{ comments.length }} Comments</span>
                   </div>
                   
                   <div v-if="commentsLoading" class="flex justify-center py-8">
                      <div class="w-8 h-8 border-3 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                   </div>
                   <div v-else-if="comments.length === 0" class="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p class="text-xs font-bold text-gray-400">No comments found for this course.</p>
                   </div>
                   <div v-else class="space-y-4">
                      <div v-for="comment in comments" :key="comment.id" class="p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                         <div class="flex items-start justify-between mb-2">
                            <div class="flex items-center gap-3">
                               <div class="w-8 h-8 rounded-full bg-white border border-gray-100 overflow-hidden">
                                  <img src="../../../assets/images/user.png" class="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p class="text-xs font-bold text-gray-900">{{ comment.user?.name }}</p>
                                  <p class="text-[10px] font-medium text-gray-400">{{ new Date(comment.created_at).toLocaleDateString() }}</p>
                               </div>
                            </div>
                            <button @click="removeComment(comment.id)" class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                         </div>
                         <p class="text-sm text-gray-600 pl-11">{{ comment.comment }}</p>
                      </div>
                   </div>
                </section>
             </div>

             <div class="space-y-6">
                <div class="saas-card bg-primary-600 text-white border-0">
                   <p class="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Total Enrolled</p>
                   <h4 class="text-3xl font-extrabold">{{ selectedCourse.students_count || '0' }}</h4>
                   <p class="text-[10px] font-medium mt-1 opacity-80">Students learning this</p>
                </div>

                <div class="saas-card">
                   <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Instructor</h4>
                   <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100">
                         <img src="../../../assets/images/user.png" class="w-full h-full object-cover" />
                      </div>
                      <div>
                         <p class="text-sm font-bold text-gray-900">{{ selectedCourse.instructor?.name }}</p>
                         <p class="text-[11px] font-medium text-gray-500">{{ selectedCourse.instructor?.email }}</p>
                      </div>
                   </div>
                   <button class="w-full mt-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all">View Full Instructor Profile</button>
                </div>

                <div class="saas-card border-red-50 bg-red-50/20">
                   <h4 class="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Destructive Action</h4>
                   <p class="text-[11px] text-red-400 font-medium leading-relaxed mb-4">Permanent deletion will remove all sections, lessons, and student progress data.</p>
                   <button @click="removeCourse(selectedCourse); showModal = false" class="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-200 transition-all">Delete Course</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>
