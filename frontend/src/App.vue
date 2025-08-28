<template>
  <div id="app">
    <h1>TaskM8 Pro</h1>

    <div class="container">
      <section class="task-form-section">
        <h2>Create New Task</h2>
        <TaskForm @submit="addTask" />
      </section>

      <section class="task-list-section">
        <h2>Tasks</h2>
        <div v-if="loading" class="loading-state">
          <p>Loading tasks...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <p>Error loading tasks: {{ error }}</p>
          <button @click="loadTasks" class="retry-btn">Retry</button>
        </div>
        <TaskList v-else :tasks="tasks" @task-updated="handleTaskUpdate" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TaskForm from "./components/tasks/TaskForm.vue";
import TaskList from "./components/tasks/TaskList.vue";
import { taskService } from "./services/taskService";
import type { Task } from "./types";

const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

function addTask(taskData: Partial<Task>) {
  const newTask: Task = {
    id: Date.now().toString(), // Convert to string to match taskService expectation
    title: taskData.title || "",
    description: taskData.description,
    assigneeId: taskData.assigneeId || "",
    dueDate: taskData.dueDate || "",
    status: "todo",
    comments: [],
    metadata: {},
  };

  tasks.value.push(newTask);
}

function handleTaskUpdate(updatedTask: Task) {
  const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
}

async function loadTasks() {
  loading.value = true;
  error.value = null;

  try {
    console.log("Loading tasks...");
    const fetchedTasks = await taskService.getAllTasks();
    tasks.value = fetchedTasks;
    console.log(`Successfully loaded ${fetchedTasks.length} tasks`);
  } catch (err) {
    console.error("Failed to load tasks:", err);
    error.value = err instanceof Error ? err.message : "Unknown error occurred";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTasks();
});
</script>

<style>
#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background-color: #f8fafc;
}

.container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  margin-top: 2rem;
  align-items: start;
}

.task-form-section,
.task-list-section {
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-form-section {
  position: sticky;
  top: 1rem;
}

.task-list-section {
  min-height: 400px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.loading-state p {
  font-size: 1.125rem;
  font-style: italic;
}

.error-state p {
  color: #dc2626;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #2563eb;
}

h1 {
  text-align: center;
  color: #1e293b;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #334155;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
  }

  .task-form-section,
  .task-list-section {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  #app {
    padding: 0.5rem;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .task-form-section {
    position: static;
  }

  .task-form-section,
  .task-list-section {
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

  .container {
    gap: 1rem;
  }

  .task-form-section,
  .task-list-section {
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

/* Dark mode support for modern devices */
@media (prefers-color-scheme: dark) {
  #app {
    background-color: #0f172a;
    color: #e2e8f0;
  }

  .task-form-section,
  .task-list-section {
    background-color: #1e293b;
    border-color: #334155;
  }

  h1,
  h2 {
    color: #f1f5f9;
  }

  h2 {
    border-bottom-color: #475569;
  }

  .loading-state,
  .error-state {
    color: #94a3b8;
  }

  .error-state p {
    color: #f87171;
  }
}
</style>
