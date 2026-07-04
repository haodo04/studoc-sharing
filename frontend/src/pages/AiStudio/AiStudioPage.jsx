import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ChevronLeft, Sparkles, BookOpen, Layers, MessageSquare, Lock } from "lucide-react";
import NavbarPage from "../../components/common/NavbarPage";
import { documentApi } from "../../api/documentApi";
import SummaryTab from "./components/SummaryTab";
import ConceptsTab from "./components/ConceptsTab";
import FlashcardTab from "./components/FlashcardTab";
import ChatTab from "./components/ChatTab";

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
          setIsLocked(!(res.data.unlocked || res.data.purchased || false));
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

  const isChatTab = activeTab === "chat";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-slate-500 font-medium text-sm">Đang tải dữ liệu tài liệu...</p>
      </div>
    );
  }

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

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavbarPage />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Tài liệu chưa được mở khóa</h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            Bạn cần dùng xu để mở khóa quyền xem toàn bộ & tải xuống tài liệu này trước khi có thể sử dụng Trợ lý học tập AI.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors active:scale-95"
          >
            Quay lại trang tài liệu để mở khóa
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Trợ lý AI</h1>
            <p className="text-xs text-slate-500 font-medium truncate">
              {documentData?.title || "Đang tải..."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  active ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${
            isChatTab ? "flex-1 flex flex-col overflow-hidden" : "p-6 min-h-[400px]"
          }`}
        >
          {activeTab === "summary" && <SummaryTab fileId={id} getToken={getToken} />}
          {activeTab === "concepts" && <ConceptsTab fileId={id} getToken={getToken} />}
          {activeTab === "flashcards" && (
            <FlashcardTab fileId={id} hasUnlockedFull={true} onGoUnlock={() => navigate(-1)} />
          )}
          {activeTab === "chat" && <ChatTab fileId={id} getToken={getToken} />}
        </div>
      </div>
    </div>
  );
}