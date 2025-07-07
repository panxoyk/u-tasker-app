export type AddTaskFormData = {
  course_id: number;
  title: string;
  description?: string;
  due_date?: string;
};

export type TaskData = {
  id: number;
  course_id: number;
  course: { name: string };
  title: string;
  description?: string;
  due_date?: string;
};
