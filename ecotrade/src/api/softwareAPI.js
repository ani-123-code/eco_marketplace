import axios from './axios';

export const softwareAPI = {
  getAll: async (params = {}) => {
    const { data } = await axios.get('/api/software', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`/api/software/${id}`);
    return data;
  },

  create: async (softwareData) => {
    const { data } = await axios.post('/api/software', softwareData);
    return data;
  },

  update: async (id, softwareData) => {
    const { data } = await axios.put(`/api/software/${id}`, softwareData);
    return data;
  },

  delete: async (id) => {
    const { data } = await axios.delete(`/api/software/${id}`);
    return data;
  }
};

