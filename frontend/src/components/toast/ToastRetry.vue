<template>
  <div class="flex items-center justify-between gap-3 min-w-0" role="alert" aria-live="assertive">
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <span class="text-white leading-5 min-w-0 flex-1">{{ message }}</span>
    </div>

    <button
      @click="handleRetry"
      :disabled="isRetrying"
      class="flex-shrink-0 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium px-3 py-1.5 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      :class="{ 'cursor-not-allowed': isRetrying }"
      :aria-label="isRetrying ? 'Retrying operation' : 'Retry failed operation'"
      :aria-disabled="isRetrying"
    >
      <span v-if="!isRetrying" class="flex items-center gap-1"> Retry </span>
      <span v-else class="flex items-center gap-1">
        <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="sr-only">Loading...</span>
        Retrying...
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  message: string;
  onRetry: () => void | Promise<void>;
  closeToast?: () => void;
}

const props = defineProps<Props>();
const isRetrying = ref(false);

async function handleRetry() {
  if (isRetrying.value) return;

  try {
    isRetrying.value = true;
    await props.onRetry();

    if (props.closeToast) {
      props.closeToast();
    }
  } catch (error) {
    console.error("Retry failed:", error);
  } finally {
    isRetrying.value = false;
  }
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
