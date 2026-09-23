import api from './api';

export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Admin functions
  getAll: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },
};
