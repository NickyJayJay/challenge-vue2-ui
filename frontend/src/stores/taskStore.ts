import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '@/types/Task';
import { taskService } from '@/services/taskService';
import { useToast } from '@/composables/useToast';

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const { showSuccess, showNetworkError } = useToast();

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
            const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
            error.value = errorMessage;

            showNetworkError(errorMessage, () => {
                loadTasks();
            });
        } finally {
            loading.value = false;
        }
    }

    async function createTask(taskData: Omit<Task, 'id' | 'comments' | 'metadata'>) {
        error.value = null;

        try {
            const newTask = await taskService.createTask(taskData);
            tasks.value.push(newTask);
            showSuccess('Task created successfully!');
            return newTask;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
            error.value = errorMessage;

            showNetworkError(errorMessage);
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

            if (updates.status) {
                const statusMessages: Record<string, string> = {
                    'in-progress': 'Task started!',
                    'done': 'Task completed!',
                    'todo': 'Task moved to todo'
                };
                showSuccess(statusMessages[updates.status] || 'Task updated successfully!');
            }

            return updatedTask;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
            error.value = errorMessage;

            showNetworkError(errorMessage);
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

            showSuccess('Task deleted successfully!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
            error.value = errorMessage;

            showNetworkError(errorMessage);
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