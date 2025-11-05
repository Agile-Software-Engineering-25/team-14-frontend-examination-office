import type { Student } from "./student";

export type StudentGroup = {
    name: string;
    students_count: number;
    students: Student[]
};