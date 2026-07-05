import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import apiEndpoints from "./apiEndpoint";

export const communityApi = {
  getHistory: async (roomId = "general", limit = 50) => {
    const res = await axios.get(apiEndpoints.GET_COMMUNITY_HISTORY(roomId, limit));
    return res.data;
  },

  connect: ({ getToken, onConnected, onError }) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(apiEndpoints.WS_ENDPOINT),
      reconnectDelay: 4000,
      beforeConnect: async () => {
        const token = getToken ? await getToken() : null;
        client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      },
      onConnect: () => onConnected?.(),
      onStompError: (frame) => {
        onError?.(frame.headers?.message || "Lỗi kết nối STOMP");
      },
    });
    client.activate();
    return client;
  },

  subscribeToRoom: (client, roomId, onMessage) => {
    if (!client || !client.connected) return null;
    return client.subscribe(`/topic/community.${roomId}`, (frame) => {
      onMessage(JSON.parse(frame.body));
    });
  },

  send: (client, roomId, payload) => {
    if (!client || !client.connected) {
      throw new Error("Chưa kết nối tới máy chủ chat");
    }
    client.publish({
      destination: "/app/community.send",
      body: JSON.stringify({ ...payload, roomId }),
    });
  },
};