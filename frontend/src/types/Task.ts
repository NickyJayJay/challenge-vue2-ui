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

export type Comment = {
  id?: string | number;
  text: string;
  author?: string;
  createdAt?: string;
};

export type TaskFormData = {
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  status?: string;
};