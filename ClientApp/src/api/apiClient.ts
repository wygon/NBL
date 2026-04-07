import axios from 'axios';
import { ApiRoutes } from '../constants/apiRoutes';

export const apiClient = axios.create({
  baseURL: ApiRoutes.BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
