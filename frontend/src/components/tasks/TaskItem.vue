<template>
  <li
    :class="[
      'flex justify-between items-start p-6 border border-gray-300 rounded-lg bg-white mb-4 transition-all hover:border-gray-400 hover:shadow-md',
      { 'opacity-70 bg-gray-100': isCompleted },
    ]"
  >
    <div class="flex-1">
      <h3 class="m-0 mb-2 text-gray-900 text-lg font-semibold">{{ task.title }}</h3>
      <p class="m-0 mb-4 text-gray-600 text-sm leading-6">
        {{ task.description || "No Description" }}
      </p>
      <div class="flex gap-4 flex-wrap text-xs">
        <span class="text-gray-600" v-if="task.assigneeId"> Assignee: {{ task.assigneeId }} </span>
        <span class="text-gray-600" v-if="task.dueDate"> Due: {{ formatDate(task.dueDate) }} </span>
        <span
          :class="[
            'px-2 py-1 rounded font-bold uppercase text-xs',
            {
              'bg-yellow-200 text-yellow-900': task.status === 'todo',
              'bg-blue-200 text-blue-900': task.status === 'in-progress',
              'bg-green-200 text-green-900': task.status === 'done',
            },
          ]"
        >
          {{ formatStatus(task.status) }}
        </span>
      </div>
    </div>

    <div class="ml-4 flex flex-col gap-2 items-end min-w-[100px]">
      <button
        v-if="task.status === 'todo'"
        @click="markInProgress"
        class="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded cursor-pointer transition-all text-sm min-w-[80px] font-medium hover:bg-blue-700 hover:border-blue-700"
      >
        Start
      </button>

      <button
        v-if="task.status === 'in-progress'"
        @click="markDone"
        class="px-4 py-2 border border-gray-400 rounded bg-white cursor-pointer transition-all text-sm min-w-[80px] font-medium text-gray-700 hover:bg-green-600 hover:text-white hover:border-green-600"
      >
        Complete
      </button>

      <span v-if="task.status === 'done'" class="text-green-600 font-semibold text-sm text-center">
        ✓ Completed
      </span>
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
@media (max-width: 640px) {
  li {
    flex-direction: column;
    padding: 1rem;
  }

  .task-actions {
    margin-left: 0;
    margin-top: 1rem;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }

  button {
    min-width: 70px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
