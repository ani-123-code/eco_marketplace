import axios from './axios';

export const uploadAPI = {
  // Upload single image file
  uploadImage: async (file, subfolder = 'materials') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('subfolder', subfolder);

    const { data } = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Upload multiple image files
  uploadImages: async (files, subfolder = 'materials') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('subfolder', subfolder);

    const { data } = await axios.post('/api/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Upload base64 image
  uploadBase64Image: async (base64String, subfolder = 'materials') => {
    const { data } = await axios.post('/api/upload/base64', {
      base64String,
      subfolder,
    });
    return data;
  },

  // Upload multiple base64 images
  uploadMultipleBase64Images: async (base64Strings, subfolder = 'materials') => {
    const { data } = await axios.post('/api/upload/base64/multiple', {
      base64Strings,
      subfolder,
    });
    return data;
  },
};

