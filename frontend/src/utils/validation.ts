export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export const validateTask = (taskData: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
}): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!taskData.title || taskData.title.trim().length === 0) {
        errors.push({
            field: 'title',
            message: 'Task title is required'
        });
    } else if (taskData.title.trim().length < 3) {
        errors.push({
            field: 'title',
            message: 'Task title must be at least 3 characters long'
        });
    } else if (taskData.title.length > 100) {
        errors.push({
            field: 'title',
            message: 'Task title cannot exceed 100 characters'
        });
    }

    if (taskData.description && taskData.description.length > 500) {
        errors.push({
            field: 'description',
            message: 'Description cannot exceed 500 characters'
        });
    }

    if (taskData.assigneeId && taskData.assigneeId.trim()) {
        const assigneePattern = /^[a-zA-Z0-9_-]+$/;
        if (!assigneePattern.test(taskData.assigneeId.trim())) {
            errors.push({
                field: 'assigneeId',
                message: 'Assignee ID can only contain letters, numbers, hyphens, and underscores'
            });
        }
    }

    if (taskData.dueDate && taskData.dueDate.trim()) {
        const dueDate = new Date(taskData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(dueDate.getTime())) {
            errors.push({
                field: 'dueDate',
                message: 'Please enter a valid date'
            });
        } else if (dueDate < today) {
            errors.push({
                field: 'dueDate',
                message: 'Due date cannot be in the past'
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/\s+/g, ' ');
};

export const sanitizeTaskData = (taskData: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
}) => {
    return {
        title: taskData.title ? sanitizeInput(taskData.title) : '',
        description: taskData.description ? sanitizeInput(taskData.description) : '',
        assigneeId: taskData.assigneeId ? sanitizeInput(taskData.assigneeId) : '',
        dueDate: taskData.dueDate ? taskData.dueDate.trim() : ''
    };
};