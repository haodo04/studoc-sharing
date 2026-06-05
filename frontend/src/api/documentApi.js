import axios from 'axios';
import apiEndpoints from './apiEndpoint'; 

export const documentApi = {
    // 1. Xem chi tiết tài liệu (API thật)
    fetchDocumentDetails: async (documentId) => {
        const response = await axios.get(apiEndpoints.PUBLIC_VIEW_FILE(documentId));
        
        return { 
            data: response.data, 
            status: response.status 
        };
    },

    // 2. TÌM KIẾM VÀ LỌC TÀI LIỆU (API MỚI THÊM)
    searchDocuments: async (filters) => {
        try {
            // filters là một object chứa các query param như { keyword, categoryId, universityId... }
            const response = await axios.get('http://localhost:8080/api/v1.0/documents/search', {
                params: filters
            });
            // Spring Boot trả về đối tượng Page có chứa thuộc tính content và totalPages
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm tài liệu:", error);
            throw error;
        }
    },

    // 3. Gửi bình luận (Hiện tại đang là Mock Data giả lập)
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

    // 4. Gửi đánh giá sao (Hiện tại đang là Mock Data giả lập)
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