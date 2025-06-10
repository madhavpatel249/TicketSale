// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://ticket-sale-nc7e.vercel.app/api'  // Production API URL
  : 'http://localhost:5000/api';  // Development API URL

console.log('Current API Base URL:', API_BASE_URL);
console.log('Current Environment:', process.env.NODE_ENV);

export { API_BASE_URL };