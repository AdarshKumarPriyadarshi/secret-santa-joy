const API_BASE = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
};

export const authApi = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  loginWithOtp: (data: { phone: string; otp: string }) =>
    request('/auth/login-otp', { method: 'POST', body: JSON.stringify(data) }),
};

export const orgApi = {
  getAll: () => request('/orgs'),
  
  getById: (id: string) => request(`/orgs/${id}`),
  
  create: (data: { name: string; photo?: string; budget?: number; description?: string }) =>
    request('/orgs', { method: 'POST', body: JSON.stringify(data) }),
  
  addMember: (orgId: string, userId: string) =>
    request(`/orgs/${orgId}/add-member`, { method: 'POST', body: JSON.stringify({ userId }) }),
};

export const eventApi = {
  create: (data: {
    name: string;
    orgId: string;
    budget: number;
    eventDate: string;
    participants: Array<{ name: string; phone?: string; email?: string; userId?: string }>;
  }) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  
  getById: (id: string) => request(`/events/${id}`),
  
  addParticipants: (eventId: string, participants: Array<{ name: string; phone?: string; email?: string }>) =>
    request(`/events/${eventId}/participants`, { method: 'POST', body: JSON.stringify({ participants }) }),
  
  draw: (eventId: string) =>
    request(`/events/${eventId}/draw`, { method: 'POST' }),
  
  getNotifications: (eventId: string) =>
    request(`/events/${eventId}/notifications`),
  
  getMyAssignment: (eventId: string) =>
    request(`/events/${eventId}/my-assignment`),
};

export const userApi = {
  getProfile: () => request('/user/profile'),
  
  updateProfile: (data: { name?: string; phone?: string; email?: string }) =>
    request('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request('/user/password', { method: 'PUT', body: JSON.stringify(data) }),
};
