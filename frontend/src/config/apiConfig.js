const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the backend Vercel URL without duplicate /api
    return 'https://ticket-sale-nc7e.vercel.app';
  }
  // In development, use localhost
  return 'http://localhost:5000';
};

export default getApiUrl();