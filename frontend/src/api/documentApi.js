// dùng mock_data làm db giả
const MOCK_DB = {
    id: "doc-1",
    title: "Bộ đề thi cuối kỳ môn Giải tích 1 - Viện Toán ứng dụng HUST (Có đáp án giải chi tiết từng bước)",
    school: "HUST",
    schoolFull: "Đại học Bách Khoa Hà Nội",
    subject: "Giải tích 1",
    subjectCode: "MI1110",
    category: "Toán & Khoa Học Cơ Bản",
    type: "Đề thi",
    author: "Nguyễn Văn Hùng",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
    uploadDate: "12/05/2024",
    downloads: 2420,
    views: 5890,
    rating: 4.9,
    reviewsCount: 48,
    creditsCost: 1,
    size: "3.4 MB",
    pagesCount: 15,
    description: "Tài liệu tổng hợp ngân hàng câu hỏi đề thi cuối kỳ môn Giải tích 1...",
    comments: [
    { id: 1, user: "minh_duc_k66", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60", content: "Đề trúng tủ câu tích phân suy rộng kỳ vừa rồi luôn mọi người ơi! Đánh giá 5 sao uy tín.", date: "2 ngày trước" },
    { id: 2, user: "thao_phuong_neu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60", content: "Tài liệu trình bày rất sạch sẽ, dễ hiểu kể cả cho đứa mất gốc như mình.", date: "5 ngày trước" }
    ]
};

// Hàm delay để giả lập tốc độ mạng (500ms - 1000ms)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const documentApi = {
    // 1. Lấy chi tiết tài liệu
    fetchDocumentDetails: async (documentId) => {
        await delay(800); // Giả lập mạng load mất 0.8s
        // Thực tế: return axios.get(`/api/documents/${documentId}`)
        return { data: MOCK_DB, status: 200 };
    },

    // 2. Gửi bình luận
    submitComment: async (documentId, content) => {
        await delay(600); // Giả lập chờ server xử lý 0.6s
        // Giả lập Backend tạo bình luận mới trả về
        const newComment = {
            id: Date.now(),
            user: "Hào Nguyễn", // Tạm hardcode tên user hiện tại
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
            content: content,
            date: "Vừa xong"
        };
        // Thực tế: return axios.post(`/api/documents/${documentId}/comments`, { content })
        return { data: newComment, status: 201 };
    },

    // 3. Gửi đánh giá sao
    submitRating: async (documentId, rating) => {
        await delay(500); 
        // Giả lập Backend tính toán lại điểm trung bình
        const mockNewAvgRating = ((MOCK_DB.rating * MOCK_DB.reviewsCount) + rating) / (MOCK_DB.reviewsCount + 1);
        
        return { 
            data: {
                newRating: Number(mockNewAvgRating.toFixed(1)),
                newReviewsCount: MOCK_DB.reviewsCount + 1
            },
            status: 200 
        };
    }
};