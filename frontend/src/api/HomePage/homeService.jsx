import axios from "axios";
import apiEndpoints from "./homeEndpoints";

const homeService = {
  getPublicDocuments: async () => {
    try {
      const response = await axios.get(apiEndpoints.FETCH_PUBLIC_FILES);
      return response.data;
    } catch (error) {
      console.error("Lỗi tại homeService.getPublicDocuments:", error);
      throw error;
    }
  },
};

export default homeService;
