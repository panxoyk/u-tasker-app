import { ClassData } from './class';
import { CourseData } from './course';
import { EvaluationData } from './evaluation';
import { PeriodData } from './period';
import { ProfileData } from './profile';
import { TaskData } from './task';

export interface GenericAPIResponse {
  success: boolean;
  error?: string;
}

export interface ClassArrayAPIResponse extends GenericAPIResponse {
  data?: ClassData[];
}

export interface TaskArrayAPIResponse extends GenericAPIResponse {
  data?: TaskData[];
}

export interface ProfileAPIResponse extends GenericAPIResponse {
  data?: ProfileData;
}

export interface PeriodArrayAPIResponse extends GenericAPIResponse {
  data?: PeriodData[];
}

export interface CourseArrayAPIResponse extends GenericAPIResponse {
  data?: CourseData[];
}

export interface EvaluationArrayAPIResponse extends GenericAPIResponse {
  data?: EvaluationData[];
}
