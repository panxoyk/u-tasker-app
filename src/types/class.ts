export type ClassData = {
  id: number;
  course_id: number;
  course: { name: string };
  day_of_the_week: number;
  start_time: string;
  end_time: string;
  classroom?: string;
  type: number;
};

export type GetClassesByDayOfTheWeek = {
  day_of_the_week: number;
  course_id?: number;
};

export type AddClassFormData = {
  course_id: number;
  day_of_the_week: number;
  start_time: string;
  end_time: string;
  classroom?: string;
  type: number;
};

export type UpdateClassClassroomFormData = {
  id: number;
  classroom: string;
};

export type UpdateClassTimeFormData = {
  id: number;
  start_time?: string;
  end_time?: string;
};

export type DeleteClassFormData = {
  id: number;
};
