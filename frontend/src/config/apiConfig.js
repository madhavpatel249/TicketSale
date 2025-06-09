const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the backend Vercel URL
    return 'https://ticket-sale-nc7e.vercel.app/api';
  }
  // In development, use localhost
  return 'http://localhost:5000/api';
};

export default getApiUrl();