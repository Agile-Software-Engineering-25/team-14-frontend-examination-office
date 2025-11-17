import { useMemo } from 'react';
import axios from 'axios';
import useUser from './useUser';
import { BACKEND_BASE_URL } from '@/config';

const useAxiosInstance = (baseUrl: string = BACKEND_BASE_URL) => {
  const user = useUser();
  const token = user.getAccessToken();

  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [baseUrl, token]);
};

export default useAxiosInstance;
