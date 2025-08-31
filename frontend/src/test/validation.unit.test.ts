import { describe, it, expect } from 'vitest';
import { validateTask, sanitizeTaskData } from '@/utils/validation';

describe('Validation Utils Unit Tests', () => {
    describe('validateTask', () => {
        it('should validate required title field', () => {
            const result = validateTask({ title: '' });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'title',
                message: 'Task title is required'
            });
        });

        it('should validate minimum title length', () => {
            const result = validateTask({ title: 'Hi' });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'title',
                message: 'Task title must be at least 3 characters long'
            });
        });

        it('should validate assignee ID format', () => {
            const result = validateTask({
                title: 'Valid Title',
                assigneeId: 'user@domain.com'
            });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'assigneeId',
                message: 'Assignee ID can only contain letters, numbers, hyphens, and underscores'
            });
        });

        it('should validate due date is not in the past', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const result = validateTask({
                title: 'Valid Title',
                dueDate: yesterday.toISOString().split('T')[0]
            });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'dueDate',
                message: 'Due date cannot be in the past'
            });
        });

        it('should pass validation for valid task data', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 7);

            const result = validateTask({
                title: 'Valid Task Title',
                description: 'Valid description',
                assigneeId: 'user123',
                dueDate: futureDate.toISOString().split('T')[0]
            });

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('sanitizeTaskData', () => {
        it('should trim whitespace and normalize spaces', () => {
            const result = sanitizeTaskData({
                title: '  Multiple   spaces   task  ',
                description: ' \n Description with\n\n newlines   ',
                assigneeId: '  user123  ',
                dueDate: '  2025-09-01  '
            });

            expect(result.title).toBe('Multiple spaces task');
            expect(result.description).toBe('Description with newlines');
            expect(result.assigneeId).toBe('user123');
            expect(result.dueDate).toBe('2025-09-01');
        });

        it('should handle empty or undefined values', () => {
            const result = sanitizeTaskData({
                title: undefined,
                description: '',
                assigneeId: undefined,
                dueDate: ''
            });

            expect(result.title).toBe('');
            expect(result.description).toBe('');
            expect(result.assigneeId).toBe('');
            expect(result.dueDate).toBe('');
        });
    });
});