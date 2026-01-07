import axios from './axios';

export const softwareRequestAPI = {
  create: async (requestData) => {
    const { data } = await axios.post('/api/software-requests', requestData);
    return data;
  },

  verify: async (requestId) => {
    const { data } = await axios.get(`/api/software-requests/verify/${requestId}`);
    return data;
  }
};

