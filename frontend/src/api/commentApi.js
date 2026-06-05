import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1.0/comments';


export const getCommentsByFileId = async (fileId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/file/${fileId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bình luận:", error);
        throw error;
    }
};

export const addOrUpdateComment = async (fileId, commentData, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/file/${fileId}`,
            commentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        throw error;
    }
};