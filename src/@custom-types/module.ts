export type Module = {
  semester: number;
  exam_type: string;
  credit_points: number;
  total_units: number;
  template_id: number;
  id: number;
  template: {
    name: string;
    code: string;
    elective: boolean;
    planned_semester: number;
    id: number;
  };
  students: { external_id: string }[];
  teachers: { external_id: string }[];
};
