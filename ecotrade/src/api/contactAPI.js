import axios from './axios';

export const contactAPI = {
  create: async (payload) => {
    const { data } = await axios.post('/api/contact', payload);
    return data;
  },
  getAll: async () => {
    const { data } = await axios.get('/api/contact');
    return data;
  },
  updateStatus: async (id, updates) => {
    const { data } = await axios.patch(`/api/contact/${id}`, updates);
    return data;
  }
};

