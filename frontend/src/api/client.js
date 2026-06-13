import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const getAllSchemes = (skip = 0, limit = 100) =>
  api.get('/schemes', { params: { skip, limit } })

export const getSchemeById = (id) => api.get(`/schemes/${id}`)

export const getAllSituations = () => api.get('/situation-search/all')

export const searchBySituation = (situation) =>
  api.post('/situation-search', { situation })

export const checkEligibility = (data) => api.post('/check-eligibility', data)

export const submitProfile = (data) => api.post('/user-profile', data)
