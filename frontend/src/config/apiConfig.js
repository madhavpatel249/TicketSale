const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the Vercel URL
    return `https://${process.env.VERCEL_URL}/api`;
  }
  // In development, use localhost
  return 'http://localhost:5000/api';
};

export default getApiUrl();