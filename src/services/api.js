import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://lifeplanner.pythonanywhere.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (username, password) => api.post('/token/', { username, password }),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
};

export const habitsAPI = {
  getHabits: () => api.get('/habits/'),
  createHabit: (data) => api.post('/habits/', data),
  updateHabit: (id, data) => api.patch(`/habits/${id}/`, data),
  deleteHabit: (id) => api.delete(`/habits/${id}/`),
  getActiveHabits: () => api.get('/habits/active/'),
  getHabitStatistics: (id) => api.get(`/habits/${id}/statistics/`),
};

export const habitLogsAPI = {
  getHabitLogs: (params = {}) => api.get('/habit-logs/', { params }),
  createHabitLog: (data) => api.post('/habit-logs/', data),
  updateHabitLog: (id, data) => api.patch(`/habit-logs/${id}/`, data),
  deleteHabitLog: (id) => api.delete(`/habit-logs/${id}/`),
  getTodayLogs: () => api.get('/habit-logs/today/'),
  getWeeklyLogs: () => api.get('/habit-logs/weekly/'),
  getMonthlyLogs: () => api.get('/habit-logs/monthly/'),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard/'),
  createMissingLogs: () => api.post('/create-missing-logs/'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/update/', data),
  changePassword: (data) => api.put('/profile/change-password/', data),
  uploadBackgroundImage: (formData) => api.post('/profile/background-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteBackgroundImage: () => api.delete('/profile/background-image/delete/'),
};

export default api;
