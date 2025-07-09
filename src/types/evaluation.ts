export type EvaluationData = {
  id: number;
  course_id: number;
  course: { name: string }[] | { name: string };
  title: string;
  start_date?: string;
  end_date?: string;
};

export type AddEvaluationFormData = {
  course_id: number;
  title: string;
  start_date?: string;
  end_date?: string;
};

export type UpdateEvaluationDateFormData = {
  id: number;
  start_date?: string;
  end_date?: string;
};
