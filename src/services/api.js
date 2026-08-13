import axios from 'axios';

// The base URL can be defined in .env as VITE_API_BASE_URL
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
