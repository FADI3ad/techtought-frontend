<script setup>
  import { ref } from "vue";

  const props = defineProps({
    modelValue: [String, Number],
    label: String,
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    error: String,
    required: {
      type: Boolean,
      default: false,
    },
    id: String,
  });

  const emit = defineEmits(["update:modelValue"]);

  const showPassword = ref(false);

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const inputType = (type) => {
    if (type === "password") {
      return showPassword.value ? "text" : "password";
    }
    return type;
  };
</script>

<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}{{ required ? "*" : "" }}</label>
    <div class="input-wrapper">
      <input
        :id="id"
        :value="modelValue"
        :type="inputType(type)"
        :placeholder="placeholder"
        :class="{ 'input-error': error }"
        @input="emit('update:modelValue', $event.target.value)" />
      
      <button
        v-if="type === 'password'"
        type="button"
        class="toggle-password"
        @click="togglePassword"
        tabindex="-1">
        <span v-if="showPassword">👁️‍🗨️</span>
        <span v-else>👁️</span>
      </button>
    </div>
    <Transition name="fade">
      <span v-if="error" class="error-msg">{{ error }}</span>
    </Transition>
  </div>
</template>

<style scoped>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2328;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-group input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 6px;
    border: 1px solid #d0d7de;
    font-size: 14px;
    background-color: white;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .form-group input:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
  }

  .input-error {
    border-color: #cf222e !important;
  }

  .input-error:focus {
    box-shadow: 0 0 0 3px rgba(207, 34, 46, 0.1) !important;
  }

  .error-msg {
    font-size: 12px;
    color: #cf222e;
    margin-top: -2px;
    font-weight: 500;
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #6e7781;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color 0.2s;
  }

  .toggle-password:hover {
    color: #1f2328;
  }

  /* Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
</style>
