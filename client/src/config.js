const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || 'https://seu-backend.onrender.com'
  : 'http://localhost:3001'

export { API_URL }