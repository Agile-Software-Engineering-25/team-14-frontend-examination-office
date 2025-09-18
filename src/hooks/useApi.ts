import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Units } from '@custom-types/weather';
import type { getCurrentWeatherReturn } from '@custom-types/brighsky';
import type { Exam } from '@custom-types/exam';

const useApi = () => {
  // const axiosInstance = useAxiosInstance(BACKEND_BASE_URL);
  const axiosInstance = useAxiosInstance('http://localhost:8080/');

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

  const addExam = useCallback(async (newExam: Exam) => {
    try {
      const response = await axiosInstance.post('api/exams', newExam);
      return response.data as Exam;
    } catch (err: any) {
      throw err;
    }
  }, [axiosInstance]);

  const updateExam = useCallback(async (updatedExam: Exam) => {
    if (!updatedExam.id) {
      throw new Error('Exam ID is required for update');
    }
    try {
      const response = await axiosInstance.put(`api/exams/${updatedExam.id}`, updatedExam);
      return response.data as Exam;
    } catch (err: any) {
      throw err;
    }
  }, [axiosInstance]);

  return { getCurrentWeather, getExams, addExam, updateExam };
};

export default useApi;
