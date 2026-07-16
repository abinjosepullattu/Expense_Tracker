import axiosInstance from './axiosInstance';

export const authAPI = {
  register:       (data)   => axiosInstance.post('/auth/register', data),
  login:          (data)   => axiosInstance.post('/auth/login', data),
  logout:         (data)   => axiosInstance.post('/auth/logout', data),
  getProfile:     ()       => axiosInstance.get('/auth/profile'),
  updateProfile:  (data)   => axiosInstance.put('/auth/profile', data),
  changePassword: (data)   => axiosInstance.post('/auth/change-password', data),
};
