<script setup>
  import { ref, computed, onMounted, watch } from "vue";
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
    isEnrolled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["review-submitted"]);

  const authStore = useAuthStore();
  const reviews = ref([]);
  const userReview = ref(null);
  const loading = ref(true);
  const submitting = ref(false);
  const showForm = ref(false);

  // Form Fields
  const rating = ref(5);
  const comment = ref("");
  const hoverRating = ref(0);

  // Pagination
  const currentPage = ref(1);
  const totalReviews = ref(0);
  const hasMore = ref(false);

  const isLoggedIn = computed(() => authStore.isLoggedIn);

  // Calculate Stats dynamically
  const stats = computed(() => {
    if (reviews.value.length === 0) {
      return {
        avg: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.value.length;
    let sum = 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.value.forEach((rev) => {
      sum += rev.rating;
      const r = Math.round(rev.rating);
      if (counts[r] !== undefined) {
        counts[r]++;
      }
    });

    const avg = (sum / total).toFixed(1);
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = Math.round((counts[i] / total) * 100);
    }

    return { avg, total, distribution };
  });

  async function fetchReviews(page = 1) {
    try {
      if (page === 1) loading.value = true;
      const res = await api.get(
        `/reviews?course_id=${props.courseId}&page=${page}&per_page=10`,
      );

      if (page === 1) {
        reviews.value = res.data.data;
      } else {
        reviews.value = [...reviews.value, ...res.data.data];
      }

      totalReviews.value = res.data.meta?.total || reviews.value.length;
      currentPage.value = page;
      hasMore.value = reviews.value.length < totalReviews.value;

      // Set user's own review if returned from API
      if (res.data.user_review) {
        userReview.value = res.data.user_review;
        rating.value = res.data.user_review.rating;
        comment.value = res.data.user_review.comment || "";
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      loading.value = false;
    }
  }

  async function submitReview() {
    try {
      submitting.value = true;
      const res = await api.post("/reviews", {
        course_id: props.courseId,
        rating: rating.value,
        comment: comment.value,
      });

      if (res.data.status === "success") {
        // Refresh reviews list
        await fetchReviews(1);
        showForm.value = false;
        emit("review-submitted");
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(
        err.response?.data?.message ||
          "Failed to post review. Please try again.",
      );
    } finally {
      submitting.value = false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  onMounted(() => {
    fetchReviews(1);
  });

  // Watch courseId to reload if route changes to another course
  watch(
    () => props.courseId,
    () => {
      fetchReviews(1);
    },
  );
</script>

<template>
  <section class="mt-16 border-t border-gray-100 pt-16">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <h2 class="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
        Student Feedback & Reviews
      </h2>

      <!-- Review Trigger Button for Enrolled Students -->
      <button
        v-if="isLoggedIn && isEnrolled"
        @click="showForm = !showForm"
        class="self-start md:self-auto px-6 py-3 bg-[#1DA1F2] hover:bg-primary-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center gap-2">
        <span class="text-base">★</span>
        <span>{{ userReview ? "Edit Your Review" : "Rate This Course" }}</span>
      </button>
    </div>

    <!-- Rating Form (Gorgeously animated stars) -->
    <Transition name="expand">
      <div
        v-if="showForm"
        class="mb-12 bg-gradient-to-br from-gray-50 to-indigo-50/30 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="font-extrabold text-gray-900 text-lg mb-2">
          {{
            userReview
              ? "Edit your rating and review"
              : "How would you rate this course?"
          }}
        </h3>
        <p class="text-xs text-gray-500 mb-6">
          Select a star rating and share your thoughts to help other students.
        </p>

        <div class="space-y-6">
          <!-- Star selection -->
          <div class="flex flex-col gap-2">
            <span
              class="text-xs font-bold uppercase tracking-wider text-gray-400"
              >Rating</span
            >
            <div class="flex items-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="rating = star"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="text-3xl transition-transform duration-100 hover:scale-125 focus:outline-none">
                <span
                  :class="
                    star <= (hoverRating || rating)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  "
                  class="transition-colors duration-150">
                  ★
                </span>
              </button>
              <span class="ml-3 text-sm font-extrabold text-amber-500">
                {{ rating }} / 5 ({{
                  rating === 5
                    ? "Excellent"
                    : rating === 4
                      ? "Very Good"
                      : rating === 3
                        ? "Good"
                        : rating === 2
                          ? "Fair"
                          : "Poor"
                }})
              </span>
            </div>
          </div>

          <!-- Comment Textarea -->
          <div class="flex flex-col gap-2">
            <span
              class="text-xs font-bold uppercase tracking-wider text-gray-400"
              >Your Review</span
            >
            <textarea
              v-model="comment"
              rows="4"
              maxlength="1000"
              class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none text-sm text-gray-800 placeholder-gray-400 bg-white"
              placeholder="What did you like or dislike about this course? What did you learn?"></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              @click="showForm = false"
              class="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
              Cancel
            </button>
            <button
              @click="submitReview"
              :disabled="submitting"
              class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 text-sm flex items-center gap-2">
              <span
                v-if="submitting"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{
                submitting
                  ? "Submitting..."
                  : userReview
                    ? "Update Review"
                    : "Submit Review"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Feedback Summary Stats Section (Udemy-like design) -->
    <div
      v-if="reviews.length > 0"
      class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100 mb-12">
      <!-- Big Average Card -->
      <div
        class="md:col-span-4 text-center md:border-r border-gray-150 py-4 md:pr-8 flex flex-col items-center justify-center">
        <span class="text-6xl font-black text-gray-900 leading-none mb-3">{{
          stats.avg
        }}</span>
        <div class="flex items-center gap-1 mb-2">
          <span
            v-for="star in 5"
            :key="star"
            :class="
              star <= Math.round(stats.avg) ? 'text-amber-400' : 'text-gray-200'
            "
            class="text-xl"
            >★</span
          >
        </div>
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest"
          >Course Rating</span
        >
        <span class="text-xs font-semibold text-primary-600 mt-1"
          >Based on {{ stats.total }} reviews</span
        >
      </div>

      <!-- Bars Distribution Column -->
      <div class="md:col-span-8 space-y-2.5">
        <div
          v-for="star in [5, 4, 3, 2, 1]"
          :key="star"
          class="flex items-center gap-4 text-sm">
          <!-- Star Label -->
          <div
            class="w-12 flex items-center gap-1 shrink-0 font-bold text-gray-700">
            <span>{{ star }}</span>
            <span class="text-amber-400">★</span>
          </div>

          <!-- Progress Bar -->
          <div class="flex-grow h-3 bg-gray-150 rounded-full overflow-hidden">
            <div
              class="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${stats.distribution[star]}%` }"></div>
          </div>

          <!-- Percentage Label -->
          <div class="w-10 text-right font-bold text-gray-500 shrink-0 text-xs">
            {{ stats.distribution[star] }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div v-if="loading" class="flex justify-center py-10">
      <div
        class="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="reviews.length > 0" class="space-y-6">
      <div v-for="review in reviews" :key="review.id" class="flex gap-4 group">
        <!-- User Avatar -->
        <div class="flex-shrink-0">
          <img
            v-if="review.user?.image"
            :src="review.user.image"
            class="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
            :alt="review.user.name" />
          <div
            v-else
            class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-primary-600 font-extrabold text-lg border border-indigo-100 shadow-sm">
            {{ review.user?.name?.charAt(0).toUpperCase() || "?" }}
          </div>
        </div>

        <!-- Review Body -->
        <div
          class="flex-grow bg-white p-6 rounded-2xl border border-gray-100 group-hover:border-primary-100 transition-all duration-300 shadow-sm hover:shadow">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 class="font-extrabold text-gray-900 leading-none mb-1.5">
                {{ review.user?.name || "Student" }}
              </h4>

              <!-- Stars display -->
              <div class="flex items-center gap-0.5">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="
                    star <= review.rating ? 'text-amber-400' : 'text-gray-200'
                  "
                  class="text-sm">
                  ★
                </span>
                <span class="text-[11px] font-extrabold text-gray-400 ml-1.5"
                  >({{ review.rating }}/5)</span
                >
              </div>
            </div>

            <!-- Date -->
            <span
              class="text-xs font-medium text-gray-400 sm:self-start mt-0.5">
              {{ formatDate(review.created_at) }}
            </span>
          </div>

          <!-- Review Comment -->
          <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {{ review.comment || "Rated only." }}
          </p>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="pt-6 flex justify-center">
        <button
          @click="fetchReviews(currentPage + 1)"
          class="px-6 py-3 border border-gray-200 hover:border-primary-600 hover:text-primary-600 text-gray-700 font-bold rounded-xl transition-all text-sm active:scale-95">
          Show More Reviews
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-2xl">★</span>
      </div>
      <p class="text-gray-500 font-medium mb-1">
        No reviews yet for this course.
      </p>
      <p class="text-xs text-gray-400 max-w-xs mx-auto">
        Be the first to share your experience with other students!
      </p>
    </div>
  </section>
</template>

<style scoped>
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease-out;
    max-height: 400px;
    opacity: 1;
    overflow: hidden;
  }

  .expand-enter-from,
  .expand-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    overflow: hidden;
  }
</style>
