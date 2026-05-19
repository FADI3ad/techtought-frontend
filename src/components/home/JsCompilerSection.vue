<template>
  <section class="py-20 bg-[#f8fafc] border-y border-gray-100 overflow-hidden">
    <div class="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <!-- LEFT SECTION -->
      <div>
        <span
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-bold uppercase tracking-wider mb-5">
          ⚡ Live Code Playground
        </span>

        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
          Write, Compile & Execute
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            Instantly
          </span>
        </h2>

        <p class="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
          Our platform includes a powerful online compiler that lets you test, run, and explore JavaScript code in real time—directly in your browser with zero setup.
        </p>

        <button
          @click="runCode"
          :disabled="status === 'processing'"
          class="inline-flex items-center gap-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-75 disabled:pointer-events-none cursor-pointer">
          <!-- Animated Spinner SVG during compilation -->
          <svg v-if="status === 'processing'" class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <!-- Play Icon SVG -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ status === "processing" ? "Running..." : "Run Code" }}</span>
        </button>
      </div>

      <!-- RIGHT SECTION (PREMIUM MAC-OS CODE EDITOR & CONSOLE) -->
      <div class="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden flex flex-col">
        <!-- TOP BAR (MAC WINDOW CONTROLS) -->
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span class="text-xs font-bold text-gray-400 font-mono tracking-wider">
            main.js
          </span>
        </div>

        <!-- CODE EDITOR TEXTAREA -->
        <textarea
          v-model="userCode"
          spellcheck="false"
          class="w-full h-[230px] bg-white text-gray-800 p-6 font-mono text-sm leading-6 resize-none outline-none border-b border-gray-100 cursor-text transition-all duration-300 hover:bg-gray-50/20 focus:bg-gray-50/20 caret-primary-600"></textarea>

        <!-- OUTPUT CONSOLE CONTAINER -->
        <div class="bg-slate-950 flex flex-col">
          <!-- CONSOLE TOP HEADER -->
          <div class="px-6 py-3.5 border-b border-white/5 flex items-center justify-between">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Console Output
            </span>
            <span
              class="text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border"
              :class="{
                'bg-amber-500/10 text-amber-400 border-amber-500/20': status === 'processing',
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': status === 'success',
                'bg-rose-500/10 text-rose-400 border-rose-500/20': status === 'error',
                'bg-white/5 text-gray-400 border-white/10': status === 'idle',
              }">
              {{ status }}
            </span>
          </div>

          <!-- CONSOLE OUTPUT AREA -->
          <div
            class="p-6 h-[110px] overflow-y-auto font-mono text-sm whitespace-pre-wrap leading-relaxed select-text"
            :class="status === 'error' ? 'text-rose-400' : 'text-emerald-400'">
            {{ output || "Output will appear here..." }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref } from "vue";

  const initialCode = `function sum(a, b) {
  return a + b;
}

console.log(sum(2, 3));`;

  const userCode = ref(initialCode);
  const status = ref("idle");
  const output = ref("");

  const runCode = () => {
    status.value = "processing";
    output.value = "";

    setTimeout(() => {
      try {
        const originalLog = console.log;
        let logs = [];

        console.log = (...args) => {
          logs.push(args.join(" "));
        };

        const result = new Function(userCode.value);
        result();

        console.log = originalLog;

        output.value = logs.length
          ? logs.join("\n")
          : "Code executed successfully 🚀";

        status.value = "success";
      } catch (err) {
        output.value = err.message;
        status.value = "error";
      }
    }, 500);
  };
</script>

<style scoped>
  textarea {
    tab-size: 2;
  }

  /* Custom Webkit scrollbar styles for premium scroll experiences */
  textarea::-webkit-scrollbar,
  div::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  textarea::-webkit-scrollbar-track,
  div::-webkit-scrollbar-track {
    background: transparent;
  }

  textarea::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 10px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.15);
  }

  div::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }
  
  div::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
</style>
