import axiosInstance from './axiosInstance';

export const budgetAPI = {
  list:   (params)     => axiosInstance.get('/budgets/', { params }),
  create: (data)       => axiosInstance.post('/budgets/', data),
  get:    (id)         => axiosInstance.get(`/budgets/${id}/`),
  update: (id, data)   => axiosInstance.put(`/budgets/${id}/`, data),
  remove: (id)         => axiosInstance.delete(`/budgets/${id}/`),
};
