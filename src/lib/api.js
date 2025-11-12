const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const data = await res.json()
      detail = data.detail || JSON.stringify(data)
    } catch (e) {}
    throw new Error(detail)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  baseUrl: BASE_URL,
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/me'),
  updateMe: (payload) => request('/me', { method: 'PUT', body: JSON.stringify(payload) }),
  domains: () => request('/domains'),
  selectDomain: (domain) => request(`/select-domain?domain=${encodeURIComponent(domain)}`, { method: 'POST' }),
  roadmap: (domain) => request(`/roadmap/${encodeURIComponent(domain)}`),
  progress: (domain) => request(`/progress/${encodeURIComponent(domain)}`),
  suggestVideo: (payload) => request('/suggest-video', { method: 'POST', body: JSON.stringify(payload) }),
  suggestions: (domain, step) => request(`/suggest-video/${encodeURIComponent(domain)}/${encodeURIComponent(step)}`),
  submitAssessment: (payload) => request('/assessment/submit', { method: 'POST', body: JSON.stringify(payload) }),
  dashboard: () => request('/dashboard/progress'),
  finalAssessment: (domain, score) => request(`/assessment/final/${encodeURIComponent(domain)}?score=${score}`, { method: 'POST' }),
  getResume: () => request('/resume'),
  saveResume: (payload) => request('/resume', { method: 'POST', body: JSON.stringify(payload) }),
  downloadResumeUrl: () => `${BASE_URL}/resume/download`,
}
