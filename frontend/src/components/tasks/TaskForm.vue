<template>
  <form @submit.prevent="submitTask" class="task-form">
    <div class="form-group">
      <label for="title">Task Title *</label>
      <input
        id="title"
        v-model="form.title"
        placeholder="Enter task title"
        :class="{ error: getFieldError('title') }"
        @blur="validateField('title')"
      />
      <span v-if="getFieldError('title')" class="error-message">
        {{ getFieldError("title") }}
      </span>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Enter task description (optional)"
        rows="3"
        :class="{ error: getFieldError('description') }"
        @blur="validateField('description')"
      ></textarea>
      <span v-if="getFieldError('description')" class="error-message">
        {{ getFieldError("description") }}
      </span>
    </div>

    <div class="form-group">
      <label for="assigneeId">Assignee ID</label>
      <input
        id="assigneeId"
        v-model="form.assigneeId"
        placeholder="e.g., user123"
        :class="{ error: getFieldError('assigneeId') }"
        @blur="validateField('assigneeId')"
      />
      <span v-if="getFieldError('assigneeId')" class="error-message">
        {{ getFieldError("assigneeId") }}
      </span>
    </div>

    <div class="form-group">
      <label for="dueDate">Due Date</label>
      <input
        id="dueDate"
        v-model="form.dueDate"
        type="date"
        :min="minDate"
        :class="{ error: getFieldError('dueDate') }"
        @blur="validateField('dueDate')"
      />
      <span v-if="getFieldError('dueDate')" class="error-message">
        {{ getFieldError("dueDate") }}
      </span>
    </div>

    <button type="submit" :disabled="!isFormValid || loading" class="submit-btn">
      <span v-if="loading">Creating...</span>
      <span v-else>Create Task</span>
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
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: 600;
  font-size: 0.875rem;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input.error,
textarea.error {
  border-color: #ef4444;
}

input.error:focus,
textarea.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.submit-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

@media (max-width: 640px) {
  input,
  textarea {
    font-size: 16px;
    padding: 0.875rem;
  }

  .submit-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
