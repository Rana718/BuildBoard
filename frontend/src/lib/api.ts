import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Projects API
export const projectsAPI = {
  create: (data: any) => api.post('/projects/create', data),
  getAll: (params?: any) => api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/projects/status/${id}`, { status }),
  selectSeller: (id: string, sellerId: string) => api.post(`/projects/select-seller/${id}`, { sellerId }),
  complete: (id: string) => api.post(`/projects/complete/${id}`),
  uploadDeliverable: (id: string, fileUrl: string) => api.post(`/projects/deliver/${id}`, { fileUrl }),
};

// Bids API
export const bidsAPI = {
  place: (data: any) => api.post('/bids/place', data),
  getByProject: (projectId: string) => api.get(`/bids/${projectId}`),
  update: (bidId: string, data: any) => api.put(`/bids/${bidId}`, data),
  delete: (bidId: string) => api.delete(`/bids/${bidId}`),
};

// Reviews API
export const reviewsAPI = {
  create: (projectId: string, data: any) => api.post(`/reviews/${projectId}`, data),
  getByProject: (projectId: string) => api.get(`/reviews/${projectId}`),
  getBySeller: (sellerId: string, params?: any) => api.get(`/reviews/seller/${sellerId}`, { params }),
  update: (projectId: string, data: any) => api.put(`/reviews/${projectId}`, data),
};

// Profile API
export const profileAPI = {
  getProfile: (userId: string) => api.get(`/profile/${userId}`),
  updateProfile: (userId: string, data: any) => api.put(`/profile/${userId}`, data),
  getStatsStream: (userId: string) => `/profile/${userId}/stats-stream`,
};

// Payments API
export const paymentsAPI = {
  create: (data: any) => api.post('/payments/create', data),
  process: (paymentId: string, data: any) => api.post(`/payments/${paymentId}/process`, data),
  getPayment: (paymentId: string) => api.get(`/payments/${paymentId}`),
  getProjectPayments: (projectId: string) => api.get(`/payments/project/${projectId}`),
  getPaymentHistory: (params?: any) => api.get('/payments/user/history', { params }),
};

export default api;
