import axios from 'axios';
import apiEndpoints from './apiEndpoint';

export const getAiStats = async (token) => {
  try {
    const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/ai/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê AI:', error);
    throw error;
  }
};

export const getAiLogs = async (token, page = 0, size = 50) => {
  try {
    const response = await axios.get(`${apiEndpoints.API_BASE_URL}/admin/ai/logs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách log AI:', error);
    throw error;
  }
};
