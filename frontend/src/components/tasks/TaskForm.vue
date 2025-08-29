<template>
  <form @submit.prevent="submitTask" class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <label for="title" class="font-semibold text-sm text-white">Task Title *</label>
      <input
        id="title"
        v-model="form.title"
        placeholder="Enter task title"
        :class="[
          'px-3 py-3 border rounded-md text-base transition-colors w-full box-border focus:outline-none bg-white text-gray-900 placeholder-gray-500',
          getFieldError('title')
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500',
        ]"
        @blur="validateField('title')"
      />
      <span v-if="getFieldError('title')" class="text-red-400 text-xs mt-1 block">
        {{ getFieldError("title") }}
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <label for="description" class="font-semibold text-sm text-white">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Enter task description (optional)"
        rows="3"
        :class="[
          'px-3 py-3 border rounded-md text-base transition-colors w-full box-border resize-y min-h-[80px] font-inherit focus:outline-none bg-white text-gray-900 placeholder-gray-500',
          getFieldError('description')
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500',
        ]"
        @blur="validateField('description')"
        @keyup="validateField('description')"
        @keydown="validateField('description')"
      ></textarea>
      <span v-if="getFieldError('description')" class="text-red-400 text-xs mt-1 block">
        {{ getFieldError("description") }}
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <label for="assigneeId" class="font-semibold text-sm text-white">Assignee ID</label>
      <input
        id="assigneeId"
        v-model="form.assigneeId"
        placeholder="e.g., user123"
        :class="[
          'px-3 py-3 border rounded-md text-base transition-colors w-full box-border focus:outline-none bg-white text-gray-900 placeholder-gray-500',
          getFieldError('assigneeId')
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500',
        ]"
        @blur="validateField('assigneeId')"
        @keyup="validateField('assigneeId')"
        @keydown="validateField('assigneeId')"
      />
      <span v-if="getFieldError('assigneeId')" class="text-red-400 text-xs mt-1 block">
        {{ getFieldError("assigneeId") }}
      </span>
    </div>

    <div class="flex flex-col gap-1">
      <label for="dueDate" class="font-semibold text-sm text-white">Due Date</label>
      <input
        id="dueDate"
        v-model="form.dueDate"
        type="date"
        :min="minDate"
        :class="[
          'px-3 py-3 border rounded-md text-base transition-colors w-full box-border focus:outline-none bg-white text-gray-900',
          getFieldError('dueDate')
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500',
        ]"
        @blur="validateField('dueDate')"
        @keyup="validateField('dueDate')"
        @keydown="validateField('dueDate')"
      />
      <span v-if="getFieldError('dueDate')" class="text-red-400 text-xs mt-1 block">
        {{ getFieldError("dueDate") }}
      </span>
    </div>

    <button
      type="submit"
      :disabled="!isFormValid || loading"
      :class="[
        'px-6 py-3 border-0 rounded-md font-semibold cursor-pointer transition-all w-full text-base flex items-center justify-center gap-2',
        !isFormValid || loading
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg',
      ]"
    >
      <span>Create Task</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import type { TaskFormData } from "@/types/Task";
import { validateTask, sanitizeTaskData, type ValidationError } from "@/utils/validation";
import { useTaskStore } from "@/stores/taskStore";

const taskStore = useTaskStore();

const { loading } = storeToRefs(taskStore);
const form = reactive<TaskFormData>({
  title: "",
  description: "",
  assigneeId: "",
  dueDate: "",
  status: "todo",
});

const errors = ref<ValidationError[]>([]);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const isFormValid = computed(() => {
  const validation = validateTask(form);
  return validation.isValid && form.title.trim().length >= 3;
});

const emit = defineEmits<{
  submit: [task: TaskFormData];
  error: [message: string];
}>();

function getFieldError(fieldName: string): string | undefined {
  const error = errors.value.find((e) => e.field === fieldName);
  return error?.message;
}

function validateField(fieldName: string) {
  const validation = validateTask(form);
  errors.value = errors.value.filter((e) => e.field !== fieldName);
  const fieldErrors = validation.errors.filter((e) => e.field === fieldName);
  errors.value.push(...fieldErrors);
}

function validateForm(): boolean {
  const validation = validateTask(form);
  errors.value = validation.errors;
  return validation.isValid;
}

async function submitTask() {
  if (!validateForm()) {
    return;
  }

  try {
    const sanitizedData = sanitizeTaskData(form);
    emit("submit", sanitizedData);
    clearForm();
    errors.value = [];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    emit("error", message);
  }
}

function clearForm() {
  form.title = "";
  form.description = "";
  form.assigneeId = "";
  form.dueDate = "";
}
</script>

<style scoped>
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input.error:focus,
textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

@media (max-width: 640px) {
  input,
  textarea {
    font-size: 16px;
    padding: 0.875rem;
  }

  button {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
