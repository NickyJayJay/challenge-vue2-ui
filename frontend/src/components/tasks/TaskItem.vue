<template>
  <li class="task-item" :class="{ completed: isCompleted }">
    <div class="task-content">
      <h3>{{ task.title }}</h3>
      <p class="description">
        {{ task.description || "No Description" }}
      </p>
      <div class="task-meta">
        <span class="assignee" v-if="task.assigneeId"> Assignee: {{ task.assigneeId }} </span>
        <span class="due-date" v-if="task.dueDate"> Due: {{ formatDate(task.dueDate) }} </span>
        <span class="status" :class="`status-${task.status}`">
          {{ formatStatus(task.status) }}
        </span>
      </div>
    </div>

    <div class="task-actions">
      <button v-if="task.status === 'todo'" @click="markInProgress" class="in-progress-btn">
        Start
      </button>

      <button v-if="task.status === 'in-progress'" @click="markDone" class="complete-btn">
        Complete
      </button>

      <span v-if="task.status === 'done'" class="completed-label"> ✓ Completed </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "@/types/Task";

type Props = {
  task: Task;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  taskUpdated: [task: Task];
}>();

const isCompleted = computed(() => props.task.status === "done");

async function markInProgress() {
  if (props.task.status !== "todo") return;

  const updatedTask = {
    ...props.task,
    status: "in-progress" as const,
  };

  emit("taskUpdated", updatedTask);
}

async function markDone() {
  if (isCompleted.value) return;

  const updatedTask = {
    ...props.task,
    status: "done" as const,
  };

  emit("taskUpdated", updatedTask);
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.task-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.7;
  background-color: #f9fafb;
}

@media (max-width: 640px) {
  .task-item {
    flex-direction: column;
    padding: 1rem;
  }
}

.task-content {
  flex: 1;
}

.task-content h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.125rem;
}

.description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
}

.assignee,
.due-date {
  color: #6b7280;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-todo {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-done {
  background-color: #dcfce7;
  color: #166534;
}

.task-actions {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  min-width: 100px;
}

.complete-btn,
.in-progress-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  min-width: 80px;
}

.in-progress-btn {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.in-progress-btn:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.complete-btn:hover {
  background-color: #16a34a;
  color: white;
  border-color: #16a34a;
}

.completed-label {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .task-actions {
    margin-left: 0;
    margin-top: 1rem;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }

  .complete-btn,
  .in-progress-btn {
    min-width: 70px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
