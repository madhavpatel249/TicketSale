import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig.js'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    // Don't add any stored tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

