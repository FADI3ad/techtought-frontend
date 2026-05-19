<script setup>
  import { ref, onMounted, computed } from "vue";
  import api from "../../../services/axios";

  const loading = ref(true);
  const reviews = ref([]);
  const comments = ref([]);
  const activeTab = ref('reviews'); // 'reviews' or 'comments'

  async function loadData() {
    loading.value = true;
    try {
      const response = await api.get("/instructor/reviews");
      if (response.data?.data) {
        reviews.value = response.data.data.reviews || [];
        comments.value = response.data.data.comments || [];
      }
    } catch (error) {
      console.error("Failed to load reviews and comments:", error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadData);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<template>
  <div class="animate-fade-in space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Reviews & Comments</h2>
        <p class="text-sm text-gray-500 mt-1">See what students are saying about your courses.</p>
      </div>
    </div>

    <div class="saas-card p-0 overflow-hidden flex flex-col min-h-[500px]">
      <!-- Tabs Header -->
      <div class="flex border-b border-gray-100 bg-gray-50/50">
        <button 
          @click="activeTab = 'reviews'" 
          class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors relative"
          :class="activeTab === 'reviews' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'">
          Course Reviews ({{ reviews.length }})
          <div v-if="activeTab === 'reviews'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]"></div>
        </button>
        <button 
          @click="activeTab = 'comments'" 
          class="flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors relative"
          :class="activeTab === 'comments' ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'">
          Course Comments ({{ comments.length }})
          <div v-if="activeTab === 'comments'" class="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]"></div>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center py-20">
        <div class="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Reviews Tab -->
      <div v-else-if="activeTab === 'reviews'" class="flex-1">
        <div v-if="reviews.length === 0" class="flex flex-col items-center justify-center py-20 px-6">
          <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
          <p class="text-sm text-gray-500 text-center max-w-sm">Students haven't reviewed any of your courses yet. Keep delivering great content!</p>
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div v-for="review in reviews" :key="review.id" class="p-6 hover:bg-gray-50/50 transition-colors">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="review.user?.image_path" :src="review.user.image_path" class="w-full h-full object-cover"/>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-4 mb-1">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ review.user?.name || 'Unknown User' }}</h4>
                  <span class="text-xs font-medium text-gray-400">{{ formatDate(review.created_at) }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex items-center text-amber-400">
                    <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= review.rating ? 'fill-current' : 'text-gray-200 fill-current'" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                  <span class="text-xs font-bold text-[var(--color-primary)] truncate">in {{ review.course?.title || 'Unknown Course' }}</span>
                </div>
                <p v-if="review.comment" class="text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
                <p v-else class="text-sm text-gray-400 italic">No text provided.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-else-if="activeTab === 'comments'" class="flex-1">
        <div v-if="comments.length === 0" class="flex flex-col items-center justify-center py-20 px-6">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">No comments yet</h3>
          <p class="text-sm text-gray-500 text-center max-w-sm">Students haven't asked any questions or left comments on your courses.</p>
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div v-for="comment in comments" :key="comment.id" class="p-6 hover:bg-gray-50/50 transition-colors">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="comment.user?.image_path" :src="comment.user.image_path" class="w-full h-full object-cover"/>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-4 mb-1">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ comment.user?.name || 'Unknown User' }}</h4>
                  <span class="text-xs font-medium text-gray-400">{{ formatDate(comment.created_at) }}</span>
                </div>
                <p class="text-xs font-bold text-[var(--color-primary)] mb-2 truncate">in {{ comment.course?.title || 'Unknown Course' }}</p>
                <p class="text-sm text-gray-600 leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
