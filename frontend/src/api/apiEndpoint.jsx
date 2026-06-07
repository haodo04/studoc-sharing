const BASE_URL = 'http://localhost:8080/api/v1.0';

const apiEndpoints = {
    FETCH_FILES: (clerkId) => `${BASE_URL}/files/manage/user/${clerkId}`,
    PUBLIC_VIEW_FILE: (fileId) => `${BASE_URL}/files/${fileId}`, 
    
    UPLOAD_FILE: `${BASE_URL}/files/manage/upload`,
    DELETE_FILE: (id) => `${BASE_URL}/files/manage/${id}`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/manage/${id}/toggle-public`,

    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/interaction/${id}/download`, 

    GET_CREDITS: `${BASE_URL}/users/credits`,

    GET_DOWNLOAD_HISTORY: (clerkId) => `${BASE_URL}/files/interaction/history/${clerkId}`,
    GET_PAYMENT_HISTORY: (clerkId) => `${BASE_URL}/payments/history/${clerkId}`
}

export default apiEndpoints;