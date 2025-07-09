export type PeriodData = {
  id: number;
  label: string;
  status: number;
  start_date?: string;
  end_date?: string;
};

export type CreatePeriodFormData = {
  period: string;
};
