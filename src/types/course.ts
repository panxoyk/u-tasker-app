export type AddCourseFormData = {
  course: string;
  code?: string;
  credits?: number | string;
};

export type CourseData = {
  id: number;
  period_id: number;
  name: string;
  code?: string;
  credits?: number;
};
