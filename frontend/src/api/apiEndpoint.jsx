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
    CHECK_FAVORITE: (fileId) => `${BASE_URL}/favorites/check/${fileId}`,

    // bộ sưu tập
    GET_COLLECTIONS: `${BASE_URL}/collections`,
    GET_COLLECTION_DETAIL: (collectionId) => `${BASE_URL}/collections/${collectionId}`,
    CREATE_COLLECTION: `${BASE_URL}/collections`,
    RENAME_COLLECTION: (collectionId) => `${BASE_URL}/collections/${collectionId}`,
    DELETE_COLLECTION: (collectionId) => `${BASE_URL}/collections/${collectionId}`,
    GET_COLLECTIONS_CONTAINING_FILE: (fileId) => `${BASE_URL}/collections/containing/${fileId}`,
    ADD_FILE_TO_COLLECTION: (collectionId, fileId) => `${BASE_URL}/collections/${collectionId}/files/${fileId}`,
    REMOVE_FILE_FROM_COLLECTION: (collectionId, fileId) => `${BASE_URL}/collections/${collectionId}/files/${fileId}`,

    // thảo luận / hỏi đáp 
    GET_DISCUSSIONS: (fileId) => `${BASE_URL}/discussions/file/${fileId}`,
    CREATE_DISCUSSION: (fileId) => `${BASE_URL}/discussions/file/${fileId}`,
    UPDATE_DISCUSSION: (id) => `${BASE_URL}/discussions/${id}`,
    DELETE_DISCUSSION: (id) => `${BASE_URL}/discussions/${id}`,

    // cộng đồng (chat real-time)
    GET_COMMUNITY_HISTORY: (roomId = "general", limit = 50) =>
    `${BASE_URL}/community/messages?roomId=${encodeURIComponent(roomId)}&limit=${limit}`,
    WS_ENDPOINT: `http://localhost:8080/api/v1.0/ws`, 

    // thông báo
    GET_NOTIFICATIONS: (limit = 20) => `${BASE_URL}/notifications?limit=${limit}`,
    GET_UNREAD_COUNT: `${BASE_URL}/notifications/unread-count`,
    MARK_NOTIFICATION_READ: (id) => `${BASE_URL}/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_READ: `${BASE_URL}/notifications/read-all`,
};

export default apiEndpoints;