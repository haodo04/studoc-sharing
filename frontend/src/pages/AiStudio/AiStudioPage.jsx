import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Layers,
  MessageSquare,
  Lock,
  RotateCw,
  Send,
  Bot,
  User,
} from "lucide-react";
import NavbarPage from "../../components/common/NavbarPage";
import { documentApi } from "../../api/documentApi";
import apiEndpoints from "../../api/apiEndpoint";

const TABS = [
  { key: "summary", label: "Tóm tắt", icon: Sparkles },
  { key: "concepts", label: "Khái niệm chính", icon: BookOpen },
  { key: "flashcards", label: "Flashcard", icon: Layers },
  { key: "chat", label: "Trò chuyện", icon: MessageSquare },
];

export default function AiStudioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [activeTab, setActiveTab] = useState("summary");
  const [documentData, setDocumentData] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [studyContent, setStudyContent] = useState(null);
  const [studyLoading, setStudyLoading] = useState(false);
  const [studyError, setStudyError] = useState(null);
  const hasFetchedStudyContent = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    const load = async () => {
      if (!id || id === "undefined") {
        setLoadError("Mã tài liệu không hợp lệ.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const token = isSignedIn ? await getToken() : null;
        const res = await documentApi.fetchDocumentDetails(id, token);

        if (res.status === 200 && res.data) {
          setDocumentData(res.data);
          const unlocked = res.data.unlocked || res.data.purchased || false;
          setIsLocked(!unlocked);
        } else {
          setLoadError("Không tìm thấy thông tin tài liệu.");
        }
      } catch (err) {
        console.error("Lỗi khi tải tài liệu:", err);
        setLoadError("Không thể kết nối tới máy chủ hoặc tài liệu không tồn tại.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, isSignedIn, isLoaded, getToken]);

  const fetchStudyContent = useCallback(async () => {
    if (!id || isLocked) return;
    try {
      setStudyLoading(true);
      setStudyError(null);
      const token = await getToken();
      const res = await axios.get(apiEndpoints.GET_AI_STUDY_CONTENT(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudyContent(res.data);
    } catch (err) {
      console.error("Lỗi khi tải nội dung AI:", err);
      const msg =
        err.response?.data?.message ||
        "Không thể tạo nội dung AI cho tài liệu này. Vui lòng thử lại sau.";
      setStudyError(msg);
    } finally {
      setStudyLoading(false);
    }
  }, [id, isLocked, getToken]);

  useEffect(() => {
    if (!isLoading && !isLocked && !loadError && !hasFetchedStudyContent.current) {
      fetchStudyContent();
    }
  }, [isLoading, isLocked, loadError]);

  const isChatTab = activeTab === "chat";

  //  Trạng thái: đang tải 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-slate-500 font-medium text-sm">
          Đang tải dữ liệu tài liệu...
        </p>
      </div>
    );
  }

  // Trạng thái: lỗi tải dữ liệu 
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavbarPage />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  // Trạng thái: tài liệu chưa được mở khóa
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavbarPage />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Tài liệu chưa được mở khóa
          </h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            Bạn cần dùng xu để mở khóa quyền xem toàn bộ & tải xuống tài liệu
            này trước khi có thể sử dụng Trợ lý học tập AI.
          </p>
          <button
            onClick={() => navigate(`/documents/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors active:scale-95"
          >
            Quay lại trang tài liệu để mở khóa
          </button>
        </div>
      </div>
    );
  }

  // Trạng thái: đã mở khóa, hiển thị AI Studio 
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarPage />
      <div className="max-w-5xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-4 w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại tài liệu
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Trợ lý AI
            </h1>
            <p className="text-xs text-slate-500 font-medium truncate">
              {documentData?.title || "Đang tải..."}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Nội dung theo tab — chat cần full-height, các tab khác chỉ cần min-height */}
        <div
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${
            isChatTab ? "flex-1 flex flex-col overflow-hidden" : "p-6 min-h-[400px]"
          }`}
        >
          {activeTab === "summary" && (
            <SummaryTab
              content={studyContent}
              loading={studyLoading}
              error={studyError}
              onRetry={fetchStudyContent}
            />
          )}
          {activeTab === "concepts" && (
            <ConceptsTab
              content={studyContent}
              loading={studyLoading}
              error={studyError}
              onRetry={fetchStudyContent}
            />
          )}
          {activeTab === "flashcards" && (
            <FlashcardsTab
              content={studyContent}
              loading={studyLoading}
              error={studyError}
              onRetry={fetchStudyContent}
            />
          )}
          {activeTab === "chat" && <ChatTab fileId={id} getToken={getToken} />}
        </div>
      </div>
    </div>
  );
}

// Component dùng chung: trạng thái loading / lỗi cho 3 tab đầu
function StudyStateWrapper({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-xs text-slate-500 font-medium">
          AI đang phân tích tài liệu, việc này có thể mất khoảng 15-30 giây...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-rose-500 font-bold">{error}</p>
        <button
          onClick={onRetry}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return children;
}

// Tab Tóm tắt
function SummaryTab({ content, loading, error, onRetry }) {
  return (
    <div className="p-6">
      <StudyStateWrapper loading={loading} error={error} onRetry={onRetry}>
        {content?.summary ? (
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
            {content.summary}
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">Chưa có dữ liệu tóm tắt.</p>
        )}
      </StudyStateWrapper>
    </div>
  );
}

// Tab Khái niệm chính
function ConceptsTab({ content, loading, error, onRetry }) {
  return (
    <div className="p-6">
      <StudyStateWrapper loading={loading} error={error} onRetry={onRetry}>
        {content?.concepts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.concepts.map((c, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <h4 className="text-sm font-extrabold text-indigo-600 mb-1">
                  {c.term}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">Chưa có khái niệm nào.</p>
        )}
      </StudyStateWrapper>
    </div>
  );
}

// Tab Flashcard
function FlashcardsTab({ content, loading, error, onRetry }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = content?.flashcards || [];

  const goTo = (newIndex) => {
    setFlipped(false);
    setIndex(newIndex);
  };

  return (
    <div className="p-6">
      <StudyStateWrapper loading={loading} error={error} onRetry={onRetry}>
        {cards.length > 0 ? (
          <div className="flex flex-col items-center gap-5">
            <p className="text-xs font-bold text-slate-400">
              Thẻ {index + 1}/{cards.length}
            </p>

            <div
              onClick={() => setFlipped((f) => !f)}
              className="w-full max-w-lg h-56 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 cursor-pointer flex items-center justify-center p-6 text-center transition-colors select-none"
            >
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  {flipped ? "Đáp án" : "Câu hỏi"}
                </p>
                <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
                  {flipped ? cards[index].answer : cards[index].question}
                </p>
              </div>
            </div>

            <button
              onClick={() => setFlipped((f) => !f)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <RotateCw className="w-3.5 h-3.5" /> Lật thẻ
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo(Math.max(0, index - 1))}
                disabled={index === 0}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goTo(Math.min(cards.length - 1, index + 1))}
                disabled={index === cards.length - 1}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic text-center">
            Chưa có flashcard nào.
          </p>
        )}
      </StudyStateWrapper>
    </div>
  );
}

/* ============================================================
   TAB: Chat với tài liệu
   ============================================================ */
function ChatTab({ fileId, getToken }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    try {
      const token = await getToken();
      const res = await axios.post(
        apiEndpoints.POST_AI_CHAT(fileId),
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, { role: "model", content: res.data.reply }]);
    } catch (err) {
      console.error("Lỗi khi chat với AI:", err);
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(msg);
      // rollback tin nhắn user nếu gửi thất bại
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
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

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center text-slate-400">
            <MessageSquare className="w-8 h-8" />
            <p className="text-xs font-medium max-w-xs">
              Đặt câu hỏi bất kỳ về nội dung tài liệu này, AI sẽ trả lời dựa
              trên chính tài liệu của bạn.
            </p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-indigo-600"
              }`}
            >
              {m.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
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
        ))}

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

      {/* Ô nhập tin nhắn */}
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
  );
}