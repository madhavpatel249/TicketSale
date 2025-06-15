const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     (process.env.NODE_ENV === 'production' 
                     ? 'https://ticket-sale-nc7e.vercel.app'  // Production backend URL (no trailing slash)
                     : 'http://localhost:5000');

if (!API_BASE_URL || API_BASE_URL === 'http://localhost:5000' && process.env.NODE_ENV === 'production') {
  
  console.error("CRITICAL: API_BASE_URL is not properly configured for production. Falling back to localhost is not intended for deployed versions.");
  
} else if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined. Please ensure environment variables are set. Falling back to http://localhost:5000 for local development.");
}

export default API_BASE_URL;