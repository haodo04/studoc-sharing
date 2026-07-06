import axios from 'axios' 
import apiEndpoints from './apiEndpoint'; 

export const documentApi = {
    // 1. Xem chi tiết tài liệu 
    fetchDocumentDetails: async (documentId, token = null) => {
        const response = await axios.get(
            apiEndpoints.PUBLIC_VIEW_FILE(documentId),
            token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );
        return { 
            data: response.data, 
            status: response.status 
        };
    },

    // 2. TÌM KIẾM VÀ LỌC TÀI LIỆU 
    searchDocuments: async (filters) => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1.0/documents/search', {
                params: filters
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm tài liệu:", error);
            throw error;
        }
    },

    reportDocument: async (id, reason, detail, token) => {
        try {
            const response = await axios.post(
                `${apiEndpoints.API_BASE_URL}/documents/${id}/report`,
                { reason, detail },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Lỗi khi report tài liệu:', error);
            throw error;
        }
    },

    // 3. LẤY DANH SÁCH NGÀNH HỌC 
    getCategories: async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1.0/documents/categories');
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gọi API lấy danh mục:", error);
            return []; 
        }
    },

    // 4. LẤY DANH SÁCH TRƯỜNG ĐẠI HỌC
    getUniversities: async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1.0/documents/universities');
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gọi API lấy danh sách trường:", error);
            return [];
        }
    },

    // 5. Gửi bình luận 
    submitComment: async (documentId, content) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(600); 
        
        const newComment = {
            id: Date.now(),
            user: "Hào Nguyễn", 
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
            content: content,
            date: "Vừa xong"
        };
        return { data: newComment, status: 201 };
    },

    // 6. Gửi đánh giá sao 
    submitRating: async (documentId, rating) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(500); 
        
        return { 
            data: {
                newRating: rating, 
                newReviewsCount: 1
            },
            status: 200 
        };
    }
};