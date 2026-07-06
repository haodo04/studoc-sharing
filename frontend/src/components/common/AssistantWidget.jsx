import React, { useState, useRef, useEffect } from "react";
import { MessageCircleQuestion, X, Send, Bot, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { assistantApi } from "../../api/assistantApi";

export default function AssistantWidget() {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen || hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        setIsLoading(true);
        const token = isSignedIn ? await getToken() : null;
        const sessions = await assistantApi.listSessions(token);
        if (sessions.length > 0) {
          setSessionId(sessions[0].id);
          setMessages(sessions[0].messages || []);
        }
      } catch (err) {
        console.error("Lỗi tải lịch sử trợ lý:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [isOpen, isSignedIn, getToken]);

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const token = isSignedIn ? await getToken() : null;
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        const created = await assistantApi.createSession(token);
        currentSessionId = created.id;
        setSessionId(currentSessionId);
      }

      const updatedSession = await assistantApi.sendMessage(currentSessionId, text, token);
      setMessages(updatedSession.messages);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Xin lỗi, mình đang gặp sự cố. Thử lại sau nhé." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircleQuestion className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-80 h-[480px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4" /> Trợ lý StudocShare
            </span>
            <button onClick={handleNewChat} title="Cuộc trò chuyện mới" className="hover:bg-indigo-500 p-1 rounded">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {isLoading ? (
              <p className="text-[11px] text-slate-400 text-center py-6">Đang tải...</p>
            ) : messages.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-6">
                Chào bạn! Hỏi mình về tài liệu hoặc cách dùng StudocShare nhé.
              </p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-700 rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {msg.documents && msg.documents.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => navigate(`/document/${doc.id}`)}
                            className="w-full flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1.5 hover:border-indigo-300 transition-all text-left"
                          >
                            <img
                              src={doc.thumbnailUrl}
                              alt={doc.title}
                              className="w-8 h-8 rounded object-cover bg-slate-100 shrink-0"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-800 truncate">{doc.title}</p>
                              <p className="text-[10px] text-amber-600 font-semibold">{doc.creditCost || 0} xu</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isSending && <p className="text-[10px] text-slate-400 italic">Đang trả lời...</p>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-1.5 p-2.5 border-t border-slate-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi mình bất cứ điều gì..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}