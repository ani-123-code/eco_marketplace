import axios from './axios';

export const sellerRequestAPI = {
  create: async (data) => {
    try {
      const response = await axios.post('/seller-requests', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAll: async (params = {}) => {
    try {
      const response = await axios.get('/seller-requests', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`/seller-requests/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`/seller-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
