<script setup>
  import { ref, onMounted, computed } from "vue";
  import api from "../../../services/axios";
  import { useAuthStore } from "../../../stores/useAuthStore";

  const props = defineProps({
    courseId: {
      type: Number,
      required: true,
    },
    courseSlug: {
      type: String,
      required: true,
    },
  });

  const authStore = useAuthStore();
  const comments = ref([]);
  const loading = ref(true);
  const submitting = ref(false);
  const newComment = ref("");
  const error = ref(null);

  const isLoggedIn = computed(() => authStore.isLoggedIn);

  async function fetchComments() {
    try {
      loading.value = true;
      const response = await api.get(`/courses/${props.courseSlug}/comments`);
      comments.value = response.data.data;
    } catch (err) {
      console.error("Error fetching comments:", err);
      error.value = "Failed to load comments.";
    } finally {
      loading.value = false;
    }
  }

  async function submitComment() {
    if (!newComment.value.trim()) return;

    try {
      submitting.value = true;
      const response = await api.post("/comments", {
        course_id: props.courseId,
        comment: newComment.value,
      });

      // Add the new comment to the list
      comments.value.unshift(response.data.data);
      newComment.value = "";
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      submitting.value = false;
    }
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  onMounted(() => {
    fetchComments();
  });
</script>

<template>
  <section class="mt-16 border-t border-gray-100 pt-16">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
        Comments ({{ comments.length }})
      </h2>
    </div>

    <!-- Comment Form -->
    <div class="mb-12">
      <div v-if="isLoggedIn">
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
              {{ authStore.user?.name?.charAt(0).toUpperCase() || "U" }}
            </div>
          </div>
          <div class="flex-grow">
            <textarea
              v-model="newComment"
              rows="3"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Write your comment here..."></textarea>
            <div class="mt-3 flex justify-end">
              <button
                @click="submitComment"
                :disabled="submitting || !newComment.trim()"
                class="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span
                  v-if="submitting"
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ submitting ? "Posting..." : "Post Comment" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
        <p class="text-gray-600 mb-4 font-medium">
          Want to join the discussion? Log in to post a comment.
        </p>
        <router-link
          to="/login"
          class="inline-flex px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
          Login Now
        </router-link>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="loading" class="flex justify-center py-10">
      <div
        class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="comments.length > 0" class="space-y-8">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-4 group">
        <div class="flex-shrink-0">
          <!-- User Image or Default Avatar -->
          <img
            v-if="comment.image"
            :src="comment.image"
            class="w-12 h-12 rounded-full object-cover border border-gray-100"
            :alt="comment.name" />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg border border-primary-100">
            {{ comment.name?.charAt(0).toUpperCase() || "?" }}
          </div>
        </div>
        <div
          class="flex-grow bg-white p-6 rounded-2xl border border-gray-100 group-hover:border-primary-100 transition-colors shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="font-bold text-gray-900 leading-none mb-1">
                {{ comment.name }}
              </h4>
              <span class="text-xs text-gray-400">Student</span>
            </div>
            <span class="text-sm text-gray-400">{{
              formatDate(comment.created_at)
            }}</span>
          </div>
          <p class="text-gray-700 leading-relaxed">{{ comment.comment }}</p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">
        No comments yet. Be the first to comment!
      </p>
    </div>
  </section>
</template>
