import useAxiosInstance from '@hooks/useAxiosInstance';
import { useCallback } from 'react';
import type { Units } from '@custom-types/weather';
import type { getCurrentWeatherReturn } from '@custom-types/brighsky';
import type { Exam } from '@custom-types/exam';

const useApi = () => {
  const axiosInstance = useAxiosInstance(import.meta.env.VITE_BACKEND_BASE_URL);

  const getCurrentWeather = useCallback(
    async (latitude: number, longitude: number, units: Units) => {
      const response = await axiosInstance.get('/current_weather', {
        params: { lat: latitude, lon: longitude, units },
      });
      return response.data as getCurrentWeatherReturn;
    },
    [axiosInstance]
  );

  const getExams = useCallback(async () => {
    const response = await axiosInstance.get('api/exams');
    return response.data as Exam[];
  }, [axiosInstance]);

  const addExam = useCallback(
    async (newExam: Exam) => {
      const response = await axiosInstance.post('api/exams', newExam);
      return response.data as Exam;
    },
    [axiosInstance]
  );

  const updateExam = useCallback(
    async (updatedExam: Exam) => {
      const response = await axiosInstance.put(
        `api/exams/${updatedExam.id}`,
        updatedExam
      );
      return response.data as Exam;
    },
    [axiosInstance]
  );

  const deleteExam = useCallback(
    async (examId: number) => {
      await axiosInstance.delete(`api/exams/${examId}`);
      return;
    },
    [axiosInstance]
  );

  return { getCurrentWeather, getExams, addExam, updateExam, deleteExam };
};

export default useApi;
