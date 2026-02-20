const API_BASE = import.meta.env.VITE_API_URL || ''

function getToken() {
  const user = localStorage.getItem('ronka_user')
  if (!user) return null
  try {
    const data = JSON.parse(user)
    return data.token || null
  } catch {
    return null
  }
}

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const token = getToken()
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

function parseErrorMessage(data, status) {
  if (data?.message) return data.message
  if (data?.errors) {
    const first = Object.values(data.errors)[0]
    return Array.isArray(first) ? first[0] : first
  }
  if (status === 401) return 'Session expirée. Veuillez vous reconnecter.'
  if (status === 403) return 'Accès refusé.'
  if (status === 404) return 'Ressource introuvable.'
  if (status >= 500) return 'Erreur serveur. Réessayez plus tard.'
  return `Erreur ${status}`
}

async function request(method, path, body = null, auth = true) {
  if (!API_BASE) throw new Error('API non configurée')
  const options = { method, headers: getHeaders(auth) }
  if (body && method !== 'GET') options.body = JSON.stringify(body)
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, options)
  } catch (e) {
    throw new Error('Impossible de joindre le backend. Vérifiez que le serveur API tourne (php artisan serve).')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(parseErrorMessage(data, res.status))
  return data
}

export const api = {
  get: (path, auth = true) => request('GET', path, null, auth),
  post: (path, body, auth = true) => request('POST', path, body, auth),
  put: (path, body, auth = true) => request('PUT', path, body, auth),
  delete: (path, auth = true) => request('DELETE', path, null, auth),
}

export const authApi = {
  login: (email, password) => api.post('/login', { email, password }, false),
  register: (data) => api.post('/register', data, false),
  logout: () => api.post('/logout', {}, true),
  me: () => api.get('/me'),
}

function toSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''), v])
  )
}

export function fromSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(fromSnake)
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      return [camel, typeof v === 'object' && v !== null ? fromSnake(v) : v]
    })
  )
}

export const bookingsApi = {
  list: () => api.get('/bookings'),
  create: (data) => api.post('/bookings', toSnake(data)),
}

export const donationsApi = {
  list: () => api.get('/donations'),
  create: (data) => api.post('/donations', toSnake({
    ...data,
    paymentDetails: data.paymentDetails ?? data.payment_details,
  })),
}

export const partnersApi = {
  list: () => api.get('/partners'),
  create: (data) => api.post('/partners', data),
  approve: (id) => api.post(`/partners/${id}/approve`),
}

export const feedbackApi = {
  list: () => api.get('/feedbacks'),
  create: (data) => api.post('/feedback', toSnake(data), !!getToken()),
}

export const membersApi = {
  list: () => api.get('/members'),
  create: (data) => api.post('/members', data),
  delete: (id) => api.delete(`/members/${id}`),
}

export const eventsApi = {
  list: () => api.get('/events'),
  create: (data) => api.post('/events', toSnake(data)),
  assignMember: (eventId, memberId) => api.post(`/events/${eventId}/assign`, { member_id: memberId }),
  addComment: (eventId, comment) => api.post(`/events/${eventId}/comment`, { comment }),
}

export const galleryApi = {
  list: () => api.get('/gallery', false),
  create: (data) => api.post('/gallery', toSnake(data)),
  delete: (id) => api.delete(`/gallery/${id}`),
}
