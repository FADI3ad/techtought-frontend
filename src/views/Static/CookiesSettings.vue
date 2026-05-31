<template>
  <div class="min-h-[calc(100vh-85px)] bg-gray-50 pt-20 pb-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 animate-fade-in">
        <h1 class="text-3xl font-black text-gray-900 sm:text-4xl tracking-tight">
          Cookies <span class="text-[#1a365d]">Settings</span>
        </h1>
        <p class="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Manage your cookie preferences and learn how we use them.
        </p>
      </div>

      <div class="bg-white rounded-2xl p-8 md:p-12 shadow-md shadow-gray-200/40 border border-gray-100/80 animate-slide-in-up space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
          <p>
            We use cookies to understand how you use our site and to improve your experience. This includes personalizing content and advertising. By continuing to use our site, you accept our use of cookies, revised Privacy Policy and Terms of Service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Manage Your Preferences</h2>
          
          <div class="space-y-6">
            <!-- Essential Cookies -->
            <div class="flex items-start justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div class="pr-6">
                <h3 class="font-bold text-gray-900 text-lg mb-1">Essential Cookies</h3>
                <p class="text-sm text-gray-500">These cookies are required for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
              </div>
              <div class="mt-1 flex-shrink-0">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Always Active
                </span>
              </div>
            </div>

            <!-- Analytics Cookies -->
            <div class="flex items-start justify-between p-4 rounded-xl border border-gray-100">
              <div class="pr-6">
                <h3 class="font-bold text-gray-900 text-lg mb-1">Analytics Cookies</h3>
                <p class="text-sm text-gray-500">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              </div>
              <div class="mt-1 flex-shrink-0">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1a365d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a365d]"></div>
                </label>
              </div>
            </div>

            <!-- Marketing Cookies -->
            <div class="flex items-start justify-between p-4 rounded-xl border border-gray-100">
              <div class="pr-6">
                <h3 class="font-bold text-gray-900 text-lg mb-1">Marketing Cookies</h3>
                <p class="text-sm text-gray-500">Used to track visitors across websites to display relevant and engaging advertisements.</p>
              </div>
              <div class="mt-1 flex-shrink-0">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1a365d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a365d]"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <button class="px-6 py-3 bg-[#1a365d] text-white font-semibold rounded-xl hover:bg-[#11243f] transition-colors shadow-sm text-sm">
              Save Preferences
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
.animate-slide-in-up {
  animation: slideInUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
