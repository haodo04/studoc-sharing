import axios from "axios";
import apiEndpoints from "./apiEndpoint";

const getDeviceId = () => {
  let id = localStorage.getItem("studoc_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("studoc_device_id", id);
  }
  return id;
};

const buildHeaders = (token) => ({
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Device-Id": getDeviceId(), 
  },
});

export const assistantApi = {
  listSessions: async (token) => {
    const res = await axios.get(apiEndpoints.GET_ASSISTANT_SESSIONS, buildHeaders(token));
    return res.data;
  },
  createSession: async (token) => {
    const res = await axios.post(apiEndpoints.CREATE_ASSISTANT_SESSION, {}, buildHeaders(token));
    return res.data;
  },
  getSessionDetail: async (sessionId, token) => {
    const res = await axios.get(apiEndpoints.GET_ASSISTANT_SESSION_DETAIL(sessionId), buildHeaders(token));
    return res.data;
  },
  sendMessage: async (sessionId, message, token) => {
    const res = await axios.post(
      apiEndpoints.SEND_ASSISTANT_MESSAGE(sessionId),
      { message },
      buildHeaders(token)
    );
    return res.data;
  },
  deleteSession: async (sessionId, token) => {
    await axios.delete(apiEndpoints.DELETE_ASSISTANT_SESSION(sessionId), buildHeaders(token));
  },
};