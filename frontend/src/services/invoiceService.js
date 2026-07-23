import api from './api';

export const clientService = {
  getAll: () => api.get('/clients'),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`)
};

export const productService = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const invoiceService = {
  getAll: () => api.get('/invoices'),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  updateStatus: (id, status) => api.put(`/invoices/${id}/status`, { status }),
  delete: (id) => api.delete(`/invoices/${id}`)
};