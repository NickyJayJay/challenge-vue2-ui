import type { Task } from '@/types/Task';

// Mock data based on the provided CSV
const mockTasks: Task[] = [
    {
        id: "1",
        title: "Train support staff",
        description: "Comprehensive training program for customer support team",
        assigneeId: "1001",
        dueDate: "2025-08-09",
        status: "todo",
        comments: [{ text: "Initial spec done" }],
        metadata: { priority: "medium", tags: ["frontend"] }
    },
    {
        id: "2",
        title: "Migrate database schema",
        description: "Update database structure for new features",
        assigneeId: "1002",
        dueDate: "2025-08-27",
        status: "done",
        comments: [{ text: "Debugged last night" }],
        metadata: { priority: "high" }
    },
    {
        id: "3",
        title: "Write unit tests",
        description: "Create comprehensive test coverage for core components",
        assigneeId: "1003",
        dueDate: "2025-08-03",
        status: "todo",
        comments: [],
        metadata: {}
    },
    {
        id: "4",
        title: "Benchmark database queries",
        description: "Analyze and optimize slow database operations",
        assigneeId: "1003",
        dueDate: "2025-09-14",
        status: "in-progress",
        comments: [],
        metadata: { priority: "low" }
    },
    {
        id: "5",
        title: "Resolve customer complaints",
        description: "Address high-priority customer issues",
        assigneeId: "1002",
        dueDate: "2025-08-10",
        status: "todo",
        comments: [{ text: "Fixed edge case" }],
        metadata: {}
    }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional failures for testing error handling
const shouldFail = () => Math.random() < 0.5; // 10% failure rate

export const taskService = {
    async getAllTasks(): Promise<Task[]> {
        await delay(500);

        if (shouldFail()) {
            throw new Error('Network error: Failed to fetch tasks');
        }

        return JSON.parse(JSON.stringify(mockTasks));
    },

    async getTaskById(id: string | number): Promise<Task | null> {
        await delay(200);

        if (shouldFail()) {
            throw new Error(`Network error: Failed to fetch task ${id}`);
        }

        const task = mockTasks.find(t => t.id.toString() === id.toString());
        return task ? JSON.parse(JSON.stringify(task)) : null;
    },

    async createTask(taskData: Omit<Task, 'id' | 'comments' | 'metadata'>): Promise<Task> {
        await delay(300);

        if (shouldFail()) {
            throw new Error('Network error: Failed to create task');
        }

        const newTask: Task = {
            id: Date.now().toString(),
            ...taskData,
            comments: [],
            metadata: {}
        };

        mockTasks.push(newTask);
        return JSON.parse(JSON.stringify(newTask));
    },

    async updateTask(id: string | number, updates: Partial<Task>): Promise<Task> {
        await delay(250);

        if (shouldFail()) {
            throw new Error(`Network error: Failed to update task ${id}`);
        }

        const index = mockTasks.findIndex(t => t.id.toString() === id.toString());
        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }

        mockTasks[index] = { ...mockTasks[index], ...updates };
        return JSON.parse(JSON.stringify(mockTasks[index]));
    },

    async deleteTask(id: string | number): Promise<void> {
        await delay(200);

        if (shouldFail()) {
            throw new Error(`Network error: Failed to delete task ${id}`);
        }

        const index = mockTasks.findIndex(t => t.id.toString() === id.toString());
        if (index === -1) {
            throw new Error(`Task with id ${id} not found`);
        }

        mockTasks.splice(index, 1);
    },

    async addComment(taskId: string | number, comment: string): Promise<Task> {
        await delay(200);

        if (shouldFail()) {
            throw new Error('Network error: Failed to add comment');
        }

        const task = mockTasks.find(t => t.id.toString() === taskId.toString());
        if (!task) {
            throw new Error(`Task with id ${taskId} not found`);
        }

        const newComment = {
            id: Date.now(),
            text: comment,
            author: 'Current User',
            createdAt: new Date().toISOString()
        };

        task.comments = task.comments || [];
        task.comments.push(newComment);

        return JSON.parse(JSON.stringify(task));
    }
};