<script setup></script>

<template>
  <section class="bg-white overflow-hidden">
    <div
      class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
      <div
        class="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
        <h2
          class="text-3xl lg:text-5xl font-black text-black mb-6 tracking-tight leading-[1.2]">
          Web Development
        </h2>
        <p class="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl">
          TOTC is one powerful online software suite that combines all the tools
          needed.
        </p>
      </div>

      <div
        class="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
        <div class="relative w-full aspect-[4/3]">
          <img
            src="../assets/images/iPhone 15 Pro.jpg"
            alt="Web Development Device Preview"
            class="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  </section>






  
  <section class="py-16 bg-white">
    <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
      <div class="mb-10 border-b border-gray-100 pb-6">
        <h2 class="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-2">
          All Web Development
        </h2>
        <p class="text-gray-500 text-lg">
          We know the best things for You. Top picks for You.
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <aside class="w-full lg:w-1/4 space-y-8">
          <div class="border-b border-gray-100 pb-6">
            <h4
              class="font-bold text-lg mb-4 text-[#0f172a] flex items-center justify-between">
              Category
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"></path>
              </svg>
            </h4>
            <div class="space-y-3">
              <label
                v-for="cat in [
                  'Design',
                  'Development',
                  'Marketing',
                  'Business',
                ]"
                :key="cat"
                class="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  class="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500 transition-all" />
                <span
                  class="text-gray-600 group-hover:text-black transition-colors"
                  >{{ cat }}</span
                >
              </label>
            </div>
          </div>

          <div class="border-b border-gray-100 pb-6">
            <h4 class="font-bold text-lg mb-4 text-[#0f172a]">Price</h4>
            <div class="space-y-3">
              <label
                v-for="price in ['All Prices', 'Free', 'Paid']"
                :key="price"
                class="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  class="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span
                  class="text-gray-600 group-hover:text-black transition-colors"
                  >{{ price }}</span
                >
              </label>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-4 text-[#0f172a]">Rating</h4>
            <div class="space-y-3">
              <div
                v-for="star in [5, 4, 3]"
                :key="star"
                class="flex items-center gap-2 cursor-pointer group">
                <div class="flex text-yellow-400">
                  <span
                    v-for="s in 5"
                    :key="s"
                    :class="s <= star ? 'fill-current' : 'text-gray-200'"
                    >★</span
                  >
                </div>
                <span class="text-sm text-gray-500 group-hover:text-black"
                  >& Up</span
                >
              </div>
            </div>
          </div>
        </aside>

        <div class="w-full lg:w-3/4 space-y-6">
          <div
            v-for="i in 4"
            :key="i"
            class="flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div
              class="w-full md:w-80 h-52 flex-shrink-0 relative overflow-hidden">
              <img
                src="../assets/images/cont1.png"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div
                class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] px-3 py-1 rounded-full font-extrabold uppercase shadow-sm">
                Bestseller
              </div>
            </div>

            <div class="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div class="flex justify-between items-start gap-4 mb-2">
                  <h3
                    class="font-bold text-xl text-[#0f172a] leading-snug group-hover:text-blue-600 transition-colors">
                    Beginner's Guide To Becoming A Professional Frontend
                    Developer
                  </h3>
                  <div class="text-right">
                    <span
                      class="block font-black text-xl text-black leading-none"
                      >{{ i % 2 === 0 ? "Free" : "E£519.99" }}</span
                    >
                    <span
                      v-if="i % 2 !== 0"
                      class="text-xs text-gray-400 line-through"
                      >E£1,200</span
                    >
                  </div>
                </div>
                <p
                  class="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  Think Like A Senior Dev: Draft With AI Prompt & Then Refine
                  Code | Next.js 15, React 19, Typescript, Prisma, Zod,
                  Tailwind4
                </p>
              </div>

              <div
                class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white shadow-sm overflow-hidden">
                    <img
                      src=""
                      alt="Author"
                      class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-semibold text-gray-700"
                    >Robert Martinez</span
                  >
                </div>
                <div
                  class="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <span class="text-sm font-bold text-yellow-700">4.8</span>
                  <div class="flex text-yellow-400 text-xs">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
