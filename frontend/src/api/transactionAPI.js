import axiosInstance from './axiosInstance';

export const transactionAPI = {
  list:         (params)     => axiosInstance.get('/transactions/', { params }),
  create:       (data)       => axiosInstance.post('/transactions/', data),
  get:          (id)         => axiosInstance.get(`/transactions/${id}/`),
  update:       (id, data)   => axiosInstance.put(`/transactions/${id}/`, data),
  patch:        (id, data)   => axiosInstance.patch(`/transactions/${id}/`, data),
  remove:       (id)         => axiosInstance.delete(`/transactions/${id}/`),
  summary:      ()           => axiosInstance.get('/transactions/summary/'),
  monthlyTrend: ()           => axiosInstance.get('/transactions/monthly-trend/'),
};

export const categoryAPI = {
  list:   ()       => axiosInstance.get('/categories/'),
  create: (data)   => axiosInstance.post('/categories/', data),
  remove: (id)     => axiosInstance.delete(`/categories/${id}/`),
};
