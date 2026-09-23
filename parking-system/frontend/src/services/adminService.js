import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAllBookings = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/admin/bookings${queryParams ? `?${queryParams}` : ''}`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`/admin/bookings/${id}/cancel`);
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/users${queryParams ? `?${queryParams}` : ''}`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const changeUserRole = async (id, roleData) => {
  const response = await api.patch(`/users/${id}/role`, roleData);
  return response.data;
};

export const changeUserStatus = async (id, statusData) => {
  const response = await api.patch(`/users/${id}/status`, statusData);
  return response.data;
};

export default {
  getDashboardStats,
  getAllBookings,
  cancelBooking,
  getAllUsers,
  getUser,
  changeUserRole,
  changeUserStatus
};
