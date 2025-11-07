import { useMemo } from 'react';
import axios from 'axios';

const useAxiosInstance = (baseUrl: string) => {
  return useMemo(() => {
    const instance = axios.create({ baseURL: baseUrl });
    return instance;
  }, [baseUrl]);
};

export default useAxiosInstance;
