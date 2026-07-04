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
    AI_ANALYZE_FILE: (id) => `${BASE_URL}/files/${id}/ai-analyze`,

    // AI Studio 
    GET_AI_SUMMARY: (fileId, lang = "vi", regenerate = false) =>
        `${BASE_URL}/files/${fileId}/ai-studio/summary?lang=${lang}&regenerate=${regenerate}`,
    GET_AI_CONCEPTS: (fileId) => `${BASE_URL}/files/${fileId}/ai-studio/concepts`,

    // AI Studio - Chat
    GET_AI_CHAT_SESSIONS: (fileId) => `${BASE_URL}/files/${fileId}/ai-studio/chat/sessions`,
    CREATE_AI_CHAT_SESSION: (fileId) => `${BASE_URL}/files/${fileId}/ai-studio/chat/sessions`,
    GET_AI_CHAT_SESSION_DETAIL: (fileId, sessionId) =>
        `${BASE_URL}/files/${fileId}/ai-studio/chat/sessions/${sessionId}`,
    SEND_AI_CHAT_MESSAGE: (fileId, sessionId) =>
        `${BASE_URL}/files/${fileId}/ai-studio/chat/sessions/${sessionId}/messages`,
    DELETE_AI_CHAT_SESSION: (fileId, sessionId) =>
        `${BASE_URL}/files/${fileId}/ai-studio/chat/sessions/${sessionId}`,

    // AI Studio - Flashcards
    GET_AI_FLASHCARD_SETS: (fileId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/sets`,
    GET_AI_FLASHCARD_SET_DETAIL: (fileId, setId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/sets/${setId}`,
    GENERATE_AI_FLASHCARD_SET: (fileId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/generate`,
    MARK_FLASHCARD_KNOWN: (fileId, setId, cardId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/sets/${setId}/cards/${cardId}`,
    RESET_FLASHCARD_PROGRESS: (fileId, setId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/sets/${setId}/reset`,
    DELETE_FLASHCARD_SET: (fileId, setId) => `${BASE_URL}/files/${fileId}/ai-studio/flashcards/sets/${setId}`,

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