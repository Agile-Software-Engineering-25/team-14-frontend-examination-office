export type Exam = {
  id: string;
  title: string;
  moduleCode: string;
  examDate: string;
  room: string;
  examType: ExamType;
  semester: string;
  ects: number;
  maxPoints: number;
  duration: number;
  attemptNumber: number;
  fileUploadRequired: boolean;
  tools: string[];
  submissions: number;
};

export enum ExamType {
  KLAUSUR = 'KLAUSUR',
  MUENDLICH = 'MUENDLICH',
  PROJEKT = 'PROJEKT',
  PRAESENTATION = 'PRAESENTATION',
  ANDERES = 'ANDERES',
}

export enum ExamState {
  EXAM_OPEN = 'EXAM_OPEN',
  EXAM_PENDING = 'EXAM_PENDING',
  EXAM_GRADED = 'EXAM_GRADED',
  EXAM_ACCEPTED = 'EXAM_ACCEPTED',
  EXAM_REJECTED = 'EXAM_REJECTED',
  EXAM_EXPIRED = 'EXAM_EXPIRED',
}
