<template>
  <div class="task-list">
    <div v-if="tasks.length === 0" class="empty-state">
      <p>No tasks yet. Create your first task!</p>
    </div>

    <ul v-else class="tasks">
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
import type { Task } from "@/types/";

interface Props {
  tasks: Task[];
}

defineProps<Props>();

const emit = defineEmits<{
  taskUpdated: [task: Task];
}>();

function handleTaskUpdate(updatedTask: Task) {
  emit("taskUpdated", updatedTask);
}
</script>

<style scoped>
.task-list {
  width: 100%;
}

.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  font-style: italic;
}

.empty-state p {
  margin: 0;
  font-size: 1.125rem;
}
</style>
