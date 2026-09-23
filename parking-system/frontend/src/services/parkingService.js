import api from './api';

export const getAllParking = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await api.get(`/parking${queryParams ? `?${queryParams}` : ''}`);
  return response.data;
};

export const getParkingById = async (id) => {
  const response = await api.get(`/parking/${id}`);
  return response.data;
};

export const getParkingSlots = async (parkingId) => {
  const response = await api.get(`/parking/${parkingId}/slots`);
  return response.data;
};

export const createParking = async (parkingData) => {
  const response = await api.post('/parking', parkingData);
  return response.data;
};

export const updateParking = async (id, parkingData) => {
  const response = await api.put(`/parking/${id}`, parkingData);
  return response.data;
};

export const deleteParking = async (id) => {
  const response = await api.delete(`/parking/${id}`);
  return response.data;
};

export const createSlot = async (slotData) => {
  const response = await api.post('/slots', slotData);
  return response.data;
};

export const updateSlot = async (id, slotData) => {
  const response = await api.put(`/slots/${id}`, slotData);
  return response.data;
};

export const deleteSlot = async (id) => {
  const response = await api.delete(`/slots/${id}`);
  return response.data;
};

export const updateSlotStatus = async (id, statusData) => {
  const response = await api.patch(`/slots/${id}/status`, statusData);
  return response.data;
};

export default {
  getAllParking,
  getParkingById,
  getParkingSlots,
  createParking,
  updateParking,
  deleteParking,
  createSlot,
  updateSlot,
  deleteSlot,
  updateSlotStatus
};
