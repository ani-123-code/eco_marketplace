import axios from './axios';

export const industryAPI = {
  getAll: async () => {
    const { data } = await axios.get('/api/industries');
    return data;
  },

  getBySlug: async (slug) => {
    const { data } = await axios.get(`/api/industries/${slug}`);
    return data;
  },

  create: async (industryData) => {
    const { data } = await axios.post('/api/industries', industryData);
    return data;
  },

  update: async (id, industryData) => {
    const { data } = await axios.put(`/api/industries/${id}`, industryData);
    return data;
  },

  delete: async (id) => {
    const { data} = await axios.delete(`/api/industries/${id}`);
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await axios.patch(`/api/industries/${id}/toggle`);
    return data;
  }
};
