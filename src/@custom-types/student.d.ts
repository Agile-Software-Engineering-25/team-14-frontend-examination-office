export enum StudyStatus {
  ENROLLED,
}

export type Student = {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  matriculationNumber: string;
  degreeProgram: string;
  semester: number;
  studyStatus: StudyStatus;
  cohort: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: string;

  enlisted?: boolean;
};
