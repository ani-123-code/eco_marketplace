import axios from './axios';

export const analyticsAPI = {
  getDashboard: async () => {
    const { data } = await axios.get('/api/analytics/dashboard');
    return data;
  },

  getRequestsByIndustry: async (params = {}) => {
    const { data } = await axios.get('/api/analytics/requests-by-industry', { params });
    return data;
  },

  getTopMaterials: async (params = {}) => {
    const { data } = await axios.get('/api/analytics/top-materials', { params });
    return data;
  },

  getStockReport: async () => {
    const { data } = await axios.get('/api/analytics/stock-report');
    return data;
  },

  getBuyerInsights: async (params = {}) => {
    const { data } = await axios.get('/api/analytics/buyer-insights', { params });
    return data;
  },

  getTimeline: async (params = {}) => {
    const { data } = await axios.get('/api/analytics/timeline', { params });
    return data;
  }
};
