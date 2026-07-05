import React, { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Send, Share2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { communityApi } from "../../api/communityApi";
import ShareDocumentModal from "./components/ShareDocumentModal";
import DocumentCardMessage from "./components/DocumentCardMessage";
import RoomSelector from "./components/RoomSelector";
import NavbarPage from "../../components/common/NavbarPage";

export default function CommunityPage() {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [activeRoomId, setActiveRoomId] = useState("general");
  const [activeRoomLabel, setActiveRoomLabel] = useState("Sảnh chung");

  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  // load lịch sử mỗi khi đổi phòng
  useEffect(() => {
    communityApi
      .getHistory(activeRoomId, 50)
      .then((data) => setMessages(data || []))
      .catch((err) => console.error("Lỗi tải lịch sử phòng:", err));
  }, [activeRoomId]);

  // kết nối WebSocket 1 lần duy nhất - không phụ thuộc activeRoomId để tránh reconnect khi đổi phòng
  useEffect(() => {
    if (!isLoaded) return;
    let isMounted = true;

    clientRef.current = communityApi.connect({
      getToken: isSignedIn ? getToken : null,
      onConnected: () => isMounted && setIsConnected(true),
      onError: (msg) => {
        console.error("Lỗi STOMP:", msg);
        toast.error("Mất kết nối tới sảnh cộng đồng, đang thử lại...");
      },
    });

    return () => {
      isMounted = false;
      clientRef.current?.deactivate();
    };
  }, [isLoaded, isSignedIn, getToken]);

  // subscribe lại đúng phòng mỗi khi activeRoomId đổi HOẶC vừa connect xong
  useEffect(() => {
    if (!isConnected || !clientRef.current) return;

    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = communityApi.subscribeToRoom(
      clientRef.current,
      activeRoomId,
      (msg) => {
        // phòng ngừa race condition khi vừa đổi phòng, tin cũ vẫn còn bay tới
        if (msg.roomId && msg.roomId !== activeRoomId) return;
        setMessages((prev) => [...prev, msg]);
      }
    );

    return () => subscriptionRef.current?.unsubscribe();
  }, [isConnected, activeRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectRoom = (roomId, label) => {
    setActiveRoomId(roomId);
    setActiveRoomLabel(label);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn.");
      return;
    }
    if (!text.trim()) return;

    try {
      communityApi.send(clientRef.current, activeRoomId, {
        type: "TEXT",
        content: text.trim(),
        sharedFileId: null,
        senderFullName: user?.fullName || "Người dùng",
        senderPhotoUrl: user?.imageUrl || "",
      });
      setText("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePickDocument = (doc) => {
    setShowShareModal(false);
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để chia sẻ tài liệu.");
      return;
    }
    try {
      communityApi.send(clientRef.current, activeRoomId, {
        type: "DOCUMENT_CARD",
        content: null,
        sharedFileId: doc.id,
        senderFullName: user?.fullName || "Người dùng",
        senderPhotoUrl: user?.imageUrl || "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarPage />

      <div className="max-w-5xl mx-auto w-full flex-1 flex gap-4 p-4">
        <RoomSelector activeRoomId={activeRoomId} onSelectRoom={handleSelectRoom} />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 truncate">
              <Users className="w-5 h-5 text-indigo-600 shrink-0" /> {activeRoomLabel}
            </h1>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                isConnected
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}
            >
              {isConnected ? "● Đang kết nối" : "○ Đang kết nối lại..."}
            </span>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-y-auto space-y-3 min-h-[400px] max-h-[560px]">
            {messages.length === 0 ? (
              <p className="text-center text-[11px] text-slate-400 py-10">
                Chưa có tin nhắn nào trong phòng này. Hãy là người mở đầu cuộc trò chuyện!
              </p>
            ) : (
              messages.map((msg, i) => {
                const isOwn = msg.senderClerkId === userId;
                return (
                  <div
                    key={msg.id || i}
                    className={`flex items-start gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <img
                      src={
                        msg.senderPhotoUrl ||
                        "https://images.clerk-static.com/preview-placeholder.png"
                      }
                      alt={msg.senderFullName}
                      className="w-7 h-7 rounded-full object-cover bg-slate-100 shrink-0"
                      onError={(e) => {
                        e.target.src =
                          "https://images.clerk-static.com/preview-placeholder.png";
                      }}
                    />
                    <div
                      className={`min-w-0 max-w-[75%] flex flex-col ${
                        isOwn ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 ${
                          isOwn ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {msg.senderFullName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString("vi-VN")
                            : ""}
                        </span>
                      </div>

                      {msg.type === "DOCUMENT_CARD" ? (
                        <div className="mt-1">
                          <DocumentCardMessage fileId={msg.sharedFileId} />
                        </div>
                      ) : (
                        <p
                          className={`text-xs mt-0.5 px-3 py-2 rounded-2xl whitespace-pre-line ${
                            isOwn
                              ? "bg-indigo-600 text-white rounded-tr-sm"
                              : "bg-slate-100 text-slate-700 rounded-tl-sm"
                          }`}
                        >
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSendText} className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              disabled={!isSignedIn}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-40 transition-all shrink-0"
              title="Chia sẻ tài liệu"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isSignedIn ? "Nhắn gì đó..." : "Đăng nhập để chat..."}
              disabled={!isSignedIn}
              className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!isSignedIn || !text.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {showShareModal && (
        <ShareDocumentModal
          onClose={() => setShowShareModal(false)}
          onPick={handlePickDocument}
        />
      )}
    </div>
  );
}