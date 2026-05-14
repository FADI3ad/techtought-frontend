<script setup>
import { ref } from "vue";

const initialCode = `
// Write JS code here
function sum(a, b) {
  return a + b;
}

console.log(sum(2, 3));
`;

const userCode = ref(initialCode);
const status = ref("idle");
const output = ref("");

const runCode = () => {
  status.value = "processing";
  output.value = "";

  setTimeout(() => {
    try {
      // نخزن console الأصلي
      const originalLog = console.log;

      let logs = [];

      // override console.log
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      // تشغيل الكود
      const result = new Function(userCode.value);
      result();

      // رجع console زي ما كان
      console.log = originalLog;

      output.value = logs.length ? logs.join("\n") : "Code executed successfully (no output)";
      status.value = "success";

    } catch (err) {
      output.value = err.message;
      status.value = "error";
    }
  }, 500);
};
</script>

<template>
  <section class="py-24 bg-[#f4f7f9] text-[#1a1a1a]">
    <div class="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-16">

      <!-- LEFT -->
      <div class="w-full lg:w-5/12">
        <h2 class="text-4xl font-bold mb-6">
          Live <span class="text-blue-600">JS Compiler</span>
        </h2>

        <button
          @click="runCode"
          :disabled="status === 'processing'"
          class="bg-black text-white px-8 py-4 rounded-xl font-bold"
        >
          {{ status === 'processing' ? 'Running...' : 'Run Code' }}
        </button>

        <!-- OUTPUT -->
        <div class="mt-6 p-4 rounded-xl bg-black text-green-400 font-mono min-h-[100px] whitespace-pre-wrap">
          {{ output || "Output will appear here..." }}
        </div>
      </div>

      <!-- EDITOR -->
      <div class="w-full lg:w-7/12">
        <div class="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">

          <div class="px-4 py-3 bg-[#252526] text-xs text-gray-400">
            main.js — Live Compiler
          </div>

          <textarea
            v-model="userCode"
            class="w-full h-[400px] bg-transparent text-green-300 p-6 font-mono text-sm outline-none resize-none"
            spellcheck="false"
          ></textarea>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
textarea {
  tab-size: 2;
}
</style>