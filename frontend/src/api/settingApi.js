import axios from 'axios';
import apiEndpoints from './apiEndpoint';

export const settingApi = {
  getSettings: async () => {
    try {
      const response = await axios.get(`${apiEndpoints.API_BASE_URL}/settings`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy cài đặt:', error);
      throw error;
    }
  },

  updateSettings: async (settings, token) => {
    try {
      const response = await axios.put(`${apiEndpoints.API_BASE_URL}/settings`, settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật cài đặt:', error);
      throw error;
    }
  }
};
