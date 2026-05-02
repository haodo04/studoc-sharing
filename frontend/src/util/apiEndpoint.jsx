const BASE_URL = 'http://localhost:8080/api/v1.0';

const apiEndpoints = {
    FETCH_FILES: `${BASE_URL}/files/my`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
}

export default apiEndpoints;