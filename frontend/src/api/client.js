import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export const getAllSchemes = (skip = 0, limit = 100) =>
  api.get('/schemes', { params: { skip, limit } })

export const getSchemeById = (id) => api.get(`/schemes/${id}`)

export const getAllSituations = () => api.get('/situation-search/all')

export const searchBySituation = (situation) =>
  api.post('/situation-search', { situation })

export const checkEligibility = (data) => api.post('/check-eligibility', data)

export const submitProfile = (data) => api.post('/user-profile', data)
