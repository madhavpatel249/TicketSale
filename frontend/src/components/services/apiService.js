import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log the full request URL and headers
    console.log('API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      data: config.data,
      origin: window.location.origin
    });

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure CORS headers are set
    config.headers['Access-Control-Allow-Origin'] = window.location.origin;
    config.headers['Access-Control-Allow-Credentials'] = 'true';

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers,
      origin: window.location.origin
    });

    // Handle CORS errors specifically
    if (error.message === 'Network Error' && !error.response) {
      console.error('CORS Error: Request was blocked by CORS policy');
    }

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth
  signup: (userData) => apiClient.post('/users/signup', userData),
  login: (credentials) => apiClient.post('/users/login', credentials),
  logout: () => apiClient.post('/users/logout'),

  // Events
  getEvents: () => apiClient.get('/events'),
  getEvent: (id) => apiClient.get(`/events/${id}`),
  createEvent: (eventData) => apiClient.post('/events', eventData),
  updateEvent: (id, eventData) => apiClient.put(`/events/${id}`, eventData),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`),

  // Bookings
  getBookings: () => apiClient.get('/bookings'),
  getBooking: (id) => apiClient.get(`/bookings/${id}`),
  createBooking: (bookingData) => apiClient.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => apiClient.put(`/bookings/${id}`, bookingData),
  deleteBooking: (id) => apiClient.delete(`/bookings/${id}`),

  // Upload
  uploadImage: (formData) => apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;

