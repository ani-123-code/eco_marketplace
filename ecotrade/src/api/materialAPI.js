import axios from './axios';

export const materialAPI = {
  getAll: async (params = {}) => {
    const { data } = await axios.get('/api/materials', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await axios.get(`/api/materials/${id}`);
    return data;
  },

  getFilters: async (industrySlug) => {
    const { data } = await axios.get(`/api/materials/filters/${industrySlug}`);
    return data;
  },

  create: async (materialData) => {
    const { data } = await axios.post('/api/materials', materialData);
    return data;
  },

  update: async (id, materialData) => {
    const { data } = await axios.put(`/api/materials/${id}`, materialData);
    return data;
  },

  delete: async (id) => {
    const { data } = await axios.delete(`/api/materials/${id}`);
    return data;
  },

  adjustStock: async (id, operation, quantity) => {
    const { data } = await axios.patch(`/api/materials/${id}/stock`, {
      operation,
      quantity
    });
    return data;
  },

  updateAttribute: async (id, attributeData) => {
    const { data } = await axios.post(`/api/materials/${id}/attributes`, attributeData);
    return data;
  }
};
