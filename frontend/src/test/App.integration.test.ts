import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { createPinia, setActivePinia } from 'pinia';
import App from '@/App.vue';

vi.mock('@/services/taskService', () => ({
    taskService: {
        getAllTasks: vi.fn().mockResolvedValue([
            {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                assigneeId: '1001',
                dueDate: '2025-09-01',
                status: 'todo',
                comments: [],
                metadata: {}
            }
        ]),
        createTask: vi.fn().mockImplementation((taskData) =>
            Promise.resolve({
                id: Date.now().toString(),
                ...taskData,
                comments: [],
                metadata: {}
            })
        ),
        updateTask: vi.fn().mockImplementation((id, updates) =>
            Promise.resolve({ id, ...updates })
        )
    }
}));

describe('App Integration Tests', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should load and display tasks on mount', async () => {
        render(App);

        // Wait for tasks to load (skip loading state check since mocks resolve immediately)
        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });

        // Should display task details
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Assignee: 1001')).toBeInTheDocument();
        expect(screen.getByText(/Due: \d{1,2}\/\d{1,2}\/\d{4}/)).toBeInTheDocument();
        expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('should create a new task through the form', async () => {
        const user = userEvent.setup();
        render(App);

        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });

        // Fill out the form
        const titleInput = screen.getByLabelText(/task title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const assigneeInput = screen.getByLabelText(/assignee id/i);
        const dueDateInput = screen.getByLabelText(/due date/i);

        await user.type(titleInput, 'New Integration Test Task');
        await user.type(descriptionInput, 'This task was created through integration testing');
        await user.type(assigneeInput, 'test-user');
        await user.type(dueDateInput, '2025-12-01');

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        // Wait for the new task to appear
        await waitFor(() => {
            expect(screen.getByText('New Integration Test Task')).toBeInTheDocument();
        });

        expect(screen.getByText('This task was created through integration testing')).toBeInTheDocument();
    });

    it('should update task status through task interactions', async () => {
        const user = userEvent.setup();
        render(App);

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });

        // Find the first "Start" button (use getAllByRole and select the first one)
        const startButtons = screen.getAllByRole('button', { name: /start/i });
        await user.click(startButtons[0]);

        // Should update task status
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
        });
    });
});