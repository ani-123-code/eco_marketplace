import axios from './axios';

export const buyerRequestAPI = {
  create: async (requestData) => {
    const { data } = await axios.post('/api/buyer-requests', requestData);
    return data;
  },

  verify: async (requestId) => {
    const { data } = await axios.get(`/api/buyer-requests/verify/${requestId}`);
    return data;
  },

  getAll: async (params = {}) => {
    const { data } = await axios.get('/api/buyer-requests', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`/api/buyer-requests/${id}`);
    return data;
  },

  updateStatus: async (id, status, adminNote) => {
    const { data } = await axios.patch(`/api/buyer-requests/${id}/status`, {
      status,
      adminNote
    });
    return data;
  },

  addNote: async (id, note) => {
    const { data } = await axios.post(`/api/buyer-requests/${id}/notes`, { note });
    return data;
  },

  export: async (params = {}) => {
    const response = await axios.get('/api/buyer-requests/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};
