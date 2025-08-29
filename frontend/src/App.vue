<template>
  <div id="app" class="font-sans max-w-7xl mx-auto p-4 min-h-screen bg-slate-800 text-white">
    <h1 class="text-center text-white mb-8 text-4xl font-bold text-shadow">TaskM8 Pro</h1>

    <div
      class="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[400px_1fr] gap-8 mt-8 items-start"
    >
      <section class="p-8 border border-slate-600 rounded-xl bg-slate-700 shadow-lg sticky top-4">
        <h2 class="text-white mb-6 text-xl font-semibold border-b-2 border-slate-500 pb-2">
          Create New Task
        </h2>
        <TaskForm @submit="addTask" />
      </section>

      <section class="p-8 border border-slate-600 rounded-xl bg-slate-700 shadow-lg min-h-[400px]">
        <h2 class="text-white mb-6 text-xl font-semibold border-b-2 border-slate-500 pb-2">
          Tasks
        </h2>
        <div v-if="loading" class="text-center py-12 px-4 text-slate-400">
          <p class="text-lg italic">Loading tasks...</p>
        </div>
        <TaskList v-else :tasks="tasks" @task-updated="handleTaskUpdate" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import TaskForm from "./components/tasks/TaskForm.vue";
import TaskList from "./components/tasks/TaskList.vue";
import { useTaskStore } from "./stores/taskStore";
import type { Task, TaskFormData } from "./types/Task";

const taskStore = useTaskStore();

const { tasks, loading } = storeToRefs(taskStore);

async function addTask(taskData: TaskFormData) {
  try {
    await taskStore.createTask({
      title: taskData.title,
      description: taskData.description || "",
      assigneeId: taskData.assigneeId || "",
      dueDate: taskData.dueDate || "",
      status: "todo",
    });
  } catch (err) {
    console.error("Failed to create task:", err);
  }
}

async function handleTaskUpdate(updatedTask: Task) {
  try {
    await taskStore.updateTask(updatedTask.id, updatedTask);
  } catch (err) {
    console.error("Failed to update task:", err);
  }
}

onMounted(() => {
  taskStore.loadTasks();
});
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
  }

  section {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  #app {
    padding: 0.5rem;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .sticky {
    position: static;
  }

  section {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 0.25rem;
  }

  .grid {
    gap: 1rem;
  }

  section {
    padding: 1rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
