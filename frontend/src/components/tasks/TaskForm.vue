<template>
  <form @submit.prevent="submitTask" class="task-form">
    <div class="form-group">
      <label for="title">Task Title *</label>
      <input id="title" v-model="title" placeholder="Enter task title" required />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        placeholder="Enter task description (optional)"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="assigneeId">Assignee ID</label>
      <input id="assigneeId" v-model="assigneeId" placeholder="Enter assignee ID" />
    </div>

    <div class="form-group">
      <label for="dueDate">Due Date</label>
      <input id="dueDate" v-model="dueDate" placeholder="YYYY-MM-DD" type="date" />
    </div>

    <button type="submit" :disabled="!title.trim()">Create Task</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Task } from "@/types/";

const title = ref("");
const description = ref("");
const assigneeId = ref("");
const dueDate = ref("");

const emit = defineEmits<{
  submit: [task: Partial<Task>];
}>();

function submitTask() {
  if (!title.value.trim()) return;

  emit("submit", {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    assigneeId: assigneeId.value.trim() || "",
    dueDate: dueDate.value || "",
  });

  clearForm();
}

function clearForm() {
  title.value = "";
  description.value = "";
  assigneeId.value = "";
  dueDate.value = "";
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
  color: #fff;
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

button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  font-size: 1rem;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
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

  button {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
