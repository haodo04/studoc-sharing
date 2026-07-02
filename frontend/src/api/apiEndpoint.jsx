const BASE_URL = 'http://localhost:8080/api/v1.0';

const apiEndpoints = {
    // quản lý file
    FETCH_FILES: (clerkId) => `${BASE_URL}/files/manage/user/${clerkId}`,
    PUBLIC_VIEW_FILE: (fileId) => `${BASE_URL}/files/${fileId}`, 
    UPLOAD_FILE: `${BASE_URL}/files/manage/upload`,
    DELETE_FILE: (id) => `${BASE_URL}/files/manage/${id}`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/manage/${id}/toggle-public`,

    // tương tác tài liệu
    UNLOCK_FILE: (id) => `${BASE_URL}/files/interaction/${id}/unlock`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/interaction/${id}/download`, 
    GET_DOWNLOAD_HISTORY: (clerkId) => `${BASE_URL}/files/interaction/history/${clerkId}`,

    // metadata hệ thống
    GET_UNIVERSITIES: `${BASE_URL}/metadata/universities`,
    GET_CATEGORIES: `${BASE_URL}/metadata/categories`,

    // tài khoản và ví xu
    GET_CREDITS: `${BASE_URL}/users/credits`,
    GET_PAYMENT_HISTORY: (clerkId) => `${BASE_URL}/payments/history/${clerkId}`,

    // yêu thích
    GET_FAVORITES: `${BASE_URL}/favorites`,
    TOGGLE_FAVORITE: (fileId) => `${BASE_URL}/favorites/${fileId}/toggle`,
    CHECK_FAVORITE: (fileId) => `${BASE_URL}/favorites/check/${fileId}`
};

export default apiEndpoints;