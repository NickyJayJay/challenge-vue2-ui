import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '@/types/Task';
import { taskService } from '@/services/taskService';

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const todoTasks = computed(() =>
        tasks.value.filter(task => task.status === 'todo')
    );

    const inProgressTasks = computed(() =>
        tasks.value.filter(task => task.status === 'in-progress')
    );

    const completedTasks = computed(() =>
        tasks.value.filter(task => task.status === 'done')
    );

    const taskStats = computed(() => ({
        total: tasks.value.length,
        todo: todoTasks.value.length,
        inProgress: inProgressTasks.value.length,
        completed: completedTasks.value.length
    }));

    async function loadTasks() {
        loading.value = true;
        error.value = null;

        try {
            const data = await taskService.getAllTasks();
            tasks.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load tasks';
        } finally {
            loading.value = false;
        }
    }

    async function createTask(taskData: Omit<Task, 'id' | 'comments' | 'metadata'>) {
        error.value = null;

        try {
            const newTask = await taskService.createTask(taskData);
            tasks.value.push(newTask);
            return newTask;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create task';
            throw err;
        }
    }

    async function updateTask(id: string | number, updates: Partial<Task>) {
        error.value = null;

        try {
            const updatedTask = await taskService.updateTask(id, updates);
            const index = tasks.value.findIndex(task => task.id === id);

            if (index !== -1) {
                tasks.value[index] = updatedTask;
            }

            return updatedTask;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update task';
            throw err;
        }
    }

    async function deleteTask(id: string | number) {
        error.value = null;

        try {
            await taskService.deleteTask(id);
            const index = tasks.value.findIndex(task => task.id === id);

            if (index !== -1) {
                tasks.value.splice(index, 1);
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete task';
            throw err;
        }
    }

    function clearError() {
        error.value = null;
    }

    return {
        tasks,
        loading,
        error,
        todoTasks,
        inProgressTasks,
        completedTasks,
        taskStats,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        clearError,
    };
});