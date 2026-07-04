import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { MessageSquare, Send, Bot, User, Plus, Loader2, Trash2 } from "lucide-react";
import { aiStudioApi } from "../../../api/aiStudioApi";

function formatRelativeTime(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export default function ChatTab({ fileId, getToken }) {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(null); 
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const hasFetchedSessions = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, sending]);

  const fetchSessions = async (selectFirst = false) => {
    try {
      setLoadingSessions(true);
      const token = await getToken();
      const res = await aiStudioApi.listChatSessions(fileId, token);
      setSessions(res.data);
      if (selectFirst && res.data.length > 0) {
        handleSelectSession(res.data[0].id);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử trò chuyện:", err);
      toast.error("Không thể tải lịch sử trò chuyện.");
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    if (hasFetchedSessions.current) return;
    hasFetchedSessions.current = true;
    fetchSessions(true);
  }, []);

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      setLoadingDetail(true);
      const token = await getToken();
      const res = await aiStudioApi.getChatSessionDetail(fileId, sessionId, token);
      setActiveSession(res.data);
    } catch (err) {
      console.error("Lỗi khi tải cuộc trò chuyện:", err);
      toast.error("Không thể tải cuộc trò chuyện này.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveSession({ id: null, title: "Cuộc trò chuyện mới", messages: [] });
    setInput("");
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Xoá cuộc trò chuyện này?")) return;

    try {
      const token = await getToken();
      await aiStudioApi.deleteChatSession(fileId, sessionId, token);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setSessions(remaining);

      if (activeSessionId === sessionId) {
        if (remaining.length > 0) handleSelectSession(remaining[0].id);
        else handleNewChat();
      }
      toast.success("Đã xoá cuộc trò chuyện.");
    } catch (err) {
      console.error("Lỗi khi xoá cuộc trò chuyện:", err);
      toast.error("Không thể xoá cuộc trò chuyện này.");
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    setActiveSession((prev) => ({
      ...(prev || { id: null, title: "Cuộc trò chuyện mới", messages: [] }),
      messages: [...(prev?.messages || []), { role: "user", content: text }],
    }));

    try {
      const token = await getToken();
      let sessionId = activeSessionId;

      if (!sessionId) {
        const createRes = await aiStudioApi.createChatSession(fileId, token);
        sessionId = createRes.data.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [
          { id: sessionId, title: createRes.data.title, updatedAt: new Date().toISOString(), messageCount: 0 },
          ...prev,
        ]);
      }

      const res = await aiStudioApi.sendChatMessage(fileId, sessionId, text, token);
      setActiveSession(res.data);

      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                title: res.data.title,
                updatedAt: new Date().toISOString(),
                messageCount: res.data.messages.length,
              }
            : s,
        );
        const target = updated.find((s) => s.id === sessionId);
        const rest = updated.filter((s) => s.id !== sessionId);
        return target ? [target, ...rest] : updated;
      });
    } catch (err) {
      console.error("Lỗi khi chat với AI:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
      setInput(text);
      setActiveSession((prev) => (prev ? { ...prev, messages: prev.messages.slice(0, -1) } : prev));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = activeSession?.messages || [];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ===== Sidebar lịch sử trò chuyện ===== */}
      <div className="w-60 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/60">
        <div className="p-3 border-b border-slate-200">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Cuộc trò chuyện mới
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingSessions ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center px-3 py-6 leading-relaxed">
              Chưa có cuộc trò chuyện nào.
              <br />
              Gõ câu hỏi bên phải để bắt đầu.
            </p>
          ) : (
            sessions.map((s) => {
              const isActive = activeSessionId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
                    isActive ? "bg-indigo-100" : "hover:bg-slate-100"
                  }`}
                >
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs truncate ${
                        isActive ? "text-indigo-700 font-bold" : "text-slate-700 font-medium"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{formatRelativeTime(s.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-opacity shrink-0"
                    title="Xoá cuộc trò chuyện"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== Khu vực trò chuyện ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loadingDetail ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center text-slate-400">
              <MessageSquare className="w-8 h-8" />
              <p className="text-xs font-medium max-w-xs">
                Đặt câu hỏi bất kỳ về nội dung tài liệu này, AI sẽ trả lời dựa trên chính tài liệu
                của bạn.
              </p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-indigo-600"
                  }`}
                >
                  {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-700 rounded-tl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 w-7 h-7 rounded-full bg-slate-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-400 italic">
                AI đang trả lời...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 p-3 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Hỏi AI về tài liệu này..."
            className="flex-1 resize-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 max-h-28"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}