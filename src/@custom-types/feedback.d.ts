export type FileReference = {
  fileUuid: string;
  filename: string;
  downloadLink: string | null;
};

export type Feedback = {
  gradedAt: string;
  examUuid: string;
  examState: ExamState;
  lecturerUuid: string;
  studentUuid: string;
  submissionUuid: string;
  comment: string;
  fileReference: FileReference[];
  points: number;
  grade: number;
};
