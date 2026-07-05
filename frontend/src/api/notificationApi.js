import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import apiEndpoints from "./apiEndpoint";

const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const notificationApi = {
  getHistory: async (token, limit = 20) => {
    const res = await axios.get(apiEndpoints.GET_NOTIFICATIONS(limit), authHeaders(token));
    return res.data;
  },

  getUnreadCount: async (token) => {
    const res = await axios.get(apiEndpoints.GET_UNREAD_COUNT, authHeaders(token));
    return res.data.count;
  },

  markRead: async (token, id) => {
    await axios.put(apiEndpoints.MARK_NOTIFICATION_READ(id), {}, authHeaders(token));
  },

  markAllRead: async (token) => {
    await axios.put(apiEndpoints.MARK_ALL_NOTIFICATIONS_READ, {}, authHeaders(token));
  },

  // kết nối riêng cho thông báo - độc lập với connection của Cộng đồng
  connect: ({ getToken, onNotification, onError }) => {
    const client = new Client({
      webSocketFactory: () => new SockJS(apiEndpoints.WS_ENDPOINT),
      reconnectDelay: 4000,
      beforeConnect: async () => {
        const token = await getToken();
        client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      },
      onConnect: () => {
        client.subscribe("/user/queue/notifications", (frame) => {
          onNotification(JSON.parse(frame.body));
        });
      },
      onStompError: (frame) => {
        onError?.(frame.headers?.message || "Lỗi kết nối thông báo");
      },
    });
    client.activate();
    return client;
  },
};