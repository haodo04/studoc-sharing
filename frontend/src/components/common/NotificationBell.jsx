import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import { notificationApi } from "../../api/notificationApi";

export default function NotificationBell() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const clientRef = useRef(null);
  const dropdownRef = useRef(null);

  // đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // load lịch sử + số chưa đọc khi vừa đăng nhập xong
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const loadInitial = async () => {
      try {
        const token = await getToken();
        const [history, count] = await Promise.all([
          notificationApi.getHistory(token, 20),
          notificationApi.getUnreadCount(token),
        ]);
        setNotifications(history || []);
        setUnreadCount(count || 0);
      } catch (err) {
        console.error("Lỗi tải thông báo:", err);
      }
    };
    loadInitial();
  }, [isLoaded, isSignedIn, getToken]);

  // kết nối real-time riêng cho thông báo
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    clientRef.current = notificationApi.connect({
      getToken,
      onNotification: (noti) => {
        setNotifications((prev) => [noti, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast(noti.message, { icon: "🔔" });
      },
      onError: (msg) => console.error("Lỗi WS thông báo:", msg),
    });

    return () => clientRef.current?.deactivate();
  }, [isLoaded, isSignedIn, getToken]);

  const handleOpen = () => setIsOpen((v) => !v);

  const handleClickNotification = async (noti) => {
    setIsOpen(false);
    if (!noti.isRead) {
      try {
        const token = await getToken();
        await notificationApi.markRead(token, noti.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    navigate(`/document/${noti.fileId}?highlight=${noti.discussionId}`);
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await getToken();
      await notificationApi.markAllRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      toast.error("Đánh dấu đã đọc thất bại.");
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-all"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-800 uppercase">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
              >
                Đánh dấu đã đọc hết
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-[11px] text-slate-400 py-8">
                Chưa có thông báo nào.
              </p>
            ) : (
              notifications.map((noti) => (
                <button
                  key={noti.id}
                  onClick={() => handleClickNotification(noti)}
                  className={`w-full flex items-start gap-2.5 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all ${
                    !noti.isRead ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <img
                    src={
                      noti.actorPhotoUrl ||
                      "https://images.clerk-static.com/preview-placeholder.png"
                    }
                    alt={noti.actorFullName}
                    className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
                    onError={(e) => {
                      e.target.src = "https://images.clerk-static.com/preview-placeholder.png";
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-700 leading-snug">{noti.message}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {noti.createdAt
                        ? new Date(noti.createdAt).toLocaleString("vi-VN")
                        : "Vừa xong"}
                    </p>
                  </div>
                  {!noti.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}