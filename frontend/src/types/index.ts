export type Task = {
  id: string | number;
  title: string;
  description?: string;
  assigneeId: string | number;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done' | string;
  comments?: any[];
  metadata?: any;
};

export interface Comment {
  id?: string | number;
  text: string;
  author?: string;
  createdAt?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
}