import axios from "axios";
import apiEndpoints from "./apiEndpoint";

const authHeaders = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {});

export const aiStudioApi = {
  getSummary: (fileId, token, lang = "vi", regenerate = false) =>
    axios.get(apiEndpoints.GET_AI_SUMMARY(fileId, lang, regenerate), authHeaders(token)),

  getConcepts: (fileId, token) =>
    axios.get(apiEndpoints.GET_AI_CONCEPTS(fileId), authHeaders(token)),

  listFlashcardSets: (fileId, token) =>
    axios.get(apiEndpoints.GET_AI_FLASHCARD_SETS(fileId), authHeaders(token)),

  getFlashcardSetDetail: (fileId, setId, token) =>
    axios.get(apiEndpoints.GET_AI_FLASHCARD_SET_DETAIL(fileId, setId), authHeaders(token)),

  generateFlashcardSet: (fileId, { language, numCards }, token) =>
    axios.post(apiEndpoints.GENERATE_AI_FLASHCARD_SET(fileId), { language, numCards }, authHeaders(token)),

  markCardKnown: (fileId, setId, cardId, known, token) =>
    axios.patch(apiEndpoints.MARK_FLASHCARD_KNOWN(fileId, setId, cardId), { known }, authHeaders(token)),

  resetFlashcardProgress: (fileId, setId, token) =>
    axios.patch(apiEndpoints.RESET_FLASHCARD_PROGRESS(fileId, setId), {}, authHeaders(token)),

  deleteFlashcardSet: (fileId, setId, token) =>
    axios.delete(apiEndpoints.DELETE_FLASHCARD_SET(fileId, setId), authHeaders(token)),

  listChatSessions: (fileId, token) =>
    axios.get(apiEndpoints.GET_AI_CHAT_SESSIONS(fileId), authHeaders(token)),

  createChatSession: (fileId, token) =>
    axios.post(apiEndpoints.CREATE_AI_CHAT_SESSION(fileId), {}, authHeaders(token)),

  getChatSessionDetail: (fileId, sessionId, token) =>
    axios.get(apiEndpoints.GET_AI_CHAT_SESSION_DETAIL(fileId, sessionId), authHeaders(token)),

  sendChatMessage: (fileId, sessionId, message, token) =>
    axios.post(apiEndpoints.SEND_AI_CHAT_MESSAGE(fileId, sessionId), { message }, authHeaders(token)),

  deleteChatSession: (fileId, sessionId, token) =>
    axios.delete(apiEndpoints.DELETE_AI_CHAT_SESSION(fileId, sessionId), authHeaders(token)),
};