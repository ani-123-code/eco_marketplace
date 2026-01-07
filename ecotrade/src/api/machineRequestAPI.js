import axios from './axios';

export const machineRequestAPI = {
  create: async (requestData) => {
    const { data } = await axios.post('/api/machine-requests', requestData);
    return data;
  },

  verify: async (requestId) => {
    const { data } = await axios.get(`/api/machine-requests/verify/${requestId}`);
    return data;
  }
};

