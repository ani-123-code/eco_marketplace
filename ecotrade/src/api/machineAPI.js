import axios from './axios';

export const machineAPI = {
  getAll: async (params = {}) => {
    const { data } = await axios.get('/api/machines', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`/api/machines/${id}`);
    return data;
  },

  create: async (machineData) => {
    const { data } = await axios.post('/api/machines', machineData);
    return data;
  },

  update: async (id, machineData) => {
    const { data } = await axios.put(`/api/machines/${id}`, machineData);
    return data;
  },

  delete: async (id) => {
    const { data } = await axios.delete(`/api/machines/${id}`);
    return data;
  }
};

