import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Layers,
  Sparkles,
  Loader2,
  History,
  Trash2,
  RefreshCw,
  Lock,
  Unlock,
} from "lucide-react";
import { aiStudioApi } from "../../../api/aiStudioApi";
import { toast } from "react-hot-toast";

const NUM_CARDS_OPTIONS = [5, 10, 15, 20, 30];
const LANG_OPTIONS = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export default function FlashcardTab({ fileId, hasUnlockedFull, onGoUnlock }) {
  const { getToken } = useAuth();

  const [allSets, setAllSets] = useState([]);
  const [activeSet, setActiveSet] = useState(null); // FlashcardSetDetailDTO
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [language, setLanguage] = useState("vi");
  const [numCards, setNumCards] = useState(15);

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState("all");

  const loadSets = useCallback(async () => {
    if (!hasUnlockedFull) return;
    setLoadingList(true);
    try {
      const token = await getToken();
      const res = await aiStudioApi.listFlashcardSets(fileId, token);
      setAllSets(res.data);
      if (res.data.length > 0 && !activeSet) {
        selectSet(res.data[0].id, token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  }, [fileId, hasUnlockedFull]);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const selectSet = async (setId, tokenParam) => {
    try {
      const token = tokenParam || (await getToken());
      const res = await aiStudioApi.getFlashcardSetDetail(fileId, setId, token);
      setActiveSet(res.data);
      setCardIndex(0);
      setFlipped(false);
      setReviewMode("all");
    } catch (err) {
      toast.error("Không thể tải bộ flashcard này!");
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = await getToken();
      const res = await aiStudioApi.generateFlashcardSet(
        fileId,
        { language, numCards },
        token,
      );
      setActiveSet(res.data);
      setCardIndex(0);
      setFlipped(false);
      await loadSets();
      toast.success("Đã tạo bộ flashcard mới!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Không thể tạo flashcard, vui lòng thử lại!",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteSet = async (setId) => {
    try {
      const token = await getToken();
      await aiStudioApi.deleteFlashcardSet(fileId, setId, token);
      const remaining = allSets.filter((s) => s.id !== setId);
      setAllSets(remaining);
      if (activeSet?.id === setId) {
        if (remaining.length > 0) selectSet(remaining[0].id);
        else setActiveSet(null);
      }
      toast.success("Đã xoá bộ flashcard!");
    } catch (err) {
      toast.error("Không thể xoá bộ flashcard!");
    }
  };

  const handleMarkKnown = async (known, cardId) => {
    const prevKnown = activeSet?.cards.find((c) => c.id === cardId)?.known;
    if (prevKnown === known) return;

    setActiveSet((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === cardId ? { ...c, known } : c)),
    }));

    try {
      const token = await getToken();
      await aiStudioApi.markCardKnown(
        fileId,
        activeSet.id,
        cardId,
        known,
        token,
      );
      setAllSets((prev) =>
        prev.map((s) =>
          s.id === activeSet.id
            ? { ...s, knownCount: s.knownCount + (known ? 1 : -1) }
            : s,
        ),
      );
    } catch (err) {
      toast.error("Không thể lưu tiến độ, thử lại sau!");
      setActiveSet((prev) => ({
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === cardId ? { ...c, known: prevKnown } : c,
        ),
      }));
    }
  };

  const handleResetProgress = async () => {
    try {
      const token = await getToken();
      await aiStudioApi.resetFlashcardProgress(fileId, activeSet.id, token);
      setActiveSet((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => ({ ...c, known: false })),
      }));
      setAllSets((prev) =>
        prev.map((s) => (s.id === activeSet.id ? { ...s, knownCount: 0 } : s)),
      );
      setReviewMode("all");
      setCardIndex(0);
      toast.success("Đã đặt lại tiến độ!");
    } catch (err) {
      toast.error("Không thể đặt lại tiến độ!");
    }
  };

  // ===== Trạng thái: chưa mở khóa =====
  if (!hasUnlockedFull) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="bg-slate-900 text-white p-3 rounded-full">
          <Lock className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-600 text-center max-w-[240px]">
          Mở khóa tài liệu để tạo và học flashcard do AI tạo
        </p>
        <button
          onClick={onGoUnlock}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all active:scale-95"
        >
          <Unlock className="w-3.5 h-3.5" /> Mở khóa ngay
        </button>
      </div>
    );
  }

  const createPanel = (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Tạo bộ thẻ mới
        </p>
        <div className="flex flex-col gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={generating}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white"
          >
            {LANG_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={numCards}
              onChange={(e) => setNumCards(Number(e.target.value))}
              disabled={generating}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white flex-1"
            >
              {NUM_CARDS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} thẻ
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2.5 rounded-xl disabled:opacity-60 text-xs transition-all active:scale-95"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generating ? "Đang tạo (có thể mất 10-30s)..." : "Tạo Flashcard"}
          </button>
        </div>
      </div>

      {allSets.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <History className="w-3.5 h-3.5" /> Lịch sử ({allSets.length})
          </p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
            {allSets.map((s) => {
              const isActive = activeSet?.id === s.id;
              const date = new Date(s.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={s.id}
                  onClick={() => selectSet(s.id)}
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer border transition-colors ${
                    isActive
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {s.numCards} thẻ
                      {s.status === "error" && (
                        <span className="ml-1 text-red-500">(lỗi)</span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">{date}</p>
                    {s.status === "ready" && s.numCards > 0 && (
                      <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{
                            width: `${Math.round((s.knownCount / s.numCards) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Xoá bộ flashcard này?"))
                        handleDeleteSet(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-opacity shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (loadingList) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {createPanel}
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 inline-flex items-center gap-2 justify-center w-full text-xs font-bold">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
        </div>
      </div>
    );
  }

  if (!activeSet || activeSet.status === "error") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {createPanel}
        <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center text-center">
          <Layers className="w-10 h-10 text-indigo-500 mb-3" />
          <p className="text-slate-700 font-bold mb-1 text-sm">
            Chưa có bộ flashcard nào
          </p>
          <p className="text-xs text-slate-500">
            Chọn số thẻ và ngôn ngữ rồi nhấn <strong>Tạo Flashcard</strong> để
            bắt đầu.
          </p>
        </div>
      </div>
    );
  }

  const cards = activeSet.cards;
  const visibleCards =
    reviewMode === "unknown" ? cards.filter((c) => !c.known) : cards;
  const knownCount = cards.filter((c) => c.known).length;
  const safeIndex = Math.min(cardIndex, Math.max(visibleCards.length - 1, 0));

  const switchReviewMode = (mode) => {
    setReviewMode(mode);
    setCardIndex(0);
    setFlipped(false);
  };

  const handleMark = (known) => {
    const current = visibleCards[safeIndex];
    if (!current) return;
    handleMarkKnown(known, current.id);
    setFlipped(false);
    if (reviewMode === "all")
      setCardIndex(Math.min(safeIndex + 1, cards.length - 1));
  };

  const studyHeader = (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-5 border-b border-slate-100 pb-3">
      <div className="flex-1 min-w-[160px]">
        <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-semibold">
          <span>
            {knownCount}/{cards.length} thẻ đã thuộc
          </span>
          <span>{Math.round((knownCount / cards.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${(knownCount / cards.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-[11px] font-bold">
        <button
          onClick={() => switchReviewMode("all")}
          className={`px-3 py-1.5 ${reviewMode === "all" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
        >
          Tất cả
        </button>
        <button
          onClick={() => switchReviewMode("unknown")}
          className={`px-3 py-1.5 ${reviewMode === "unknown" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
        >
          Chỉ chưa thuộc
        </button>
      </div>
    </div>
  );

  if (visibleCards.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {createPanel}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          {studyHeader}
          <div className="text-center py-10">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-slate-800 font-bold mb-1 text-sm">
              Bạn đã thuộc hết {cards.length} thẻ!
            </p>
            <div className="flex justify-center gap-2 flex-wrap mt-4">
              <button
                onClick={() => switchReviewMode("all")}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50"
              >
                Xem lại toàn bộ
              </button>
              <button
                onClick={handleResetProgress}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
              >
                Học lại từ đầu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const card = visibleCards[safeIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
      {createPanel}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        {studyHeader}
        <div className="max-w-xl mx-auto">
          <p className="text-xs text-slate-400 mb-3 text-center font-semibold">
            Thẻ {safeIndex + 1}/{visibleCards.length}
          </p>

          <div
            onClick={() => setFlipped(!flipped)}
            className={`cursor-pointer rounded-2xl shadow-sm min-h-[16rem] flex items-center justify-center p-6 text-center select-none border-2 transition-colors ${
              card.known
                ? "bg-emerald-50/40 border-emerald-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <p className="text-base font-bold text-slate-900 whitespace-pre-wrap">
              {flipped ? card.back : card.front}
            </p>
          </div>
          {!flipped && (
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Nhấn vào thẻ để lật
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <button
              onClick={() => {
                setCardIndex(Math.max(safeIndex - 1, 0));
                setFlipped(false);
              }}
              disabled={safeIndex === 0}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold"
            >
              ← Trước
            </button>
            <button
              onClick={() => setFlipped(!flipped)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Lật thẻ
            </button>
            <button
              onClick={() => handleMark(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border ${!card.known ? "bg-red-50 border-red-300 text-red-700" : "border-slate-300 text-slate-500 hover:bg-red-50"}`}
            >
              Chưa thuộc
            </button>
            <button
              onClick={() => handleMark(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border ${card.known ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "border-slate-300 text-slate-500 hover:bg-emerald-50"}`}
            >
              Đã thuộc
            </button>
            <button
              onClick={() => {
                setCardIndex(Math.min(safeIndex + 1, visibleCards.length - 1));
                setFlipped(false);
              }}
              disabled={safeIndex === visibleCards.length - 1}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
