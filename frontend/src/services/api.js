import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
  return config;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth
export const authRegister = async (data) => {
  const response = await api.post('/auth/register', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const authLogin = async (data) => {
  const response = await api.post('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true, message: 'Logged out successfully' };
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

// Artworks
export const fetchAllArtworks = async (params = {}) => {
  const response = await api.get('/artworks', { params });
  return response.data;
};

export const fetchArtworks = fetchAllArtworks;

export const fetchLatestArtworks = async (limit = 6) => {
  const response = await api.get('/artworks/latest', { params: { limit } });
  return response.data;
};

export const fetchArtworkById = async (id) => {
  const response = await api.get(`/artworks/${id}`);
  return response.data;
};

export const createArtwork = async (data) => {
  const response = await api.post('/artworks', data);
  return response.data;
};

export const updateArtwork = async (id, data) => {
  const response = await api.put(`/artworks/${id}`, data);
  return response.data;
};

export const deleteArtwork = async (id) => {
  const response = await api.delete(`/artworks/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/artworks/categories/all');
  return response.data;
};

// Shop
export const fetchShopItems = async () => {
  const response = await api.get('/shop');
  return response.data;
};

export const createShopItem = async (data) => {
  const response = await api.post('/shop', data);
  return response.data;
};

export const updateShopItem = async (id, data) => {
  const response = await api.put(`/shop/${id}`, data);
  return response.data;
};

export const deleteShopItem = async (id) => {
  const response = await api.delete(`/shop/${id}`);
  return response.data;
};

// Courses
export const fetchCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const createCourse = async (data) => {
  const response = await api.post('/courses', data);
  return response.data;
};

export const updateCourse = async (id, data) => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

// Blogs
export const fetchBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

export const fetchBlogById = async (id) => {
  const response = await api.get(`/blogs/${id}`);
  return response.data;
};

export const createBlog = async (data) => {
  const response = await api.post('/blogs', data);
  return response.data;
};

export const updateBlog = async (id, data) => {
  const response = await api.put(`/blogs/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

// Contact
export const submitContactForm = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Admin - Dashboard
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};

// Admin - Users
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Admin - Contacts
export const getAllContacts = async () => {
  const response = await api.get('/admin/contacts');
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/admin/contacts/${id}`);
  return response.data;
};

// Admin - Bulk operations
export const bulkDelete = async (model, ids) => {
  const response = await api.post('/admin/bulk-delete', { model, ids });
  return response.data;
};

export default api;