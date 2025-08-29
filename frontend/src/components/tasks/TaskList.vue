<template>
  <div class="w-full">
    <div v-if="tasks.length === 0" class="text-center py-12 px-4 text-slate-500 italic">
      <p class="m-0 text-lg">No tasks yet. Create your first task!</p>
    </div>

    <ul v-else class="list-none p-0 m-0">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-updated="handleTaskUpdate"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import TaskItem from "./TaskItem.vue";
import type { Task } from "@/types/Task";

type Props = {
  tasks: Task[];
};

defineProps<Props>();

const emit = defineEmits<{
  taskUpdated: [task: Task];
}>();

function handleTaskUpdate(updatedTask: Task) {
  emit("taskUpdated", updatedTask);
}
</script>
