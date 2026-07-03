import React from "react";
import { Sparkles, Lightbulb, Tags, HelpCircle, RefreshCw, Lock } from "lucide-react";

export default function AiAnalysisCard({
  aiData,          
  isAnalyzing,      
  hasUnlockedFull,
  onGenerateAnalysis,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase flex items-center gap-1.5 text-indigo-600">
          <Sparkles className="w-4 h-4" /> Phân tích tài liệu bằng AI
        </h3>
        <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
          Gemini AI
        </span>
      </div>

      {!aiData && !isAnalyzing && (
        <button
          onClick={onGenerateAnalysis}
          className="w-full bg-slate-50 hover:bg-indigo-50 border border-dashed border-slate-300 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 font-bold py-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 text-xs"
        >
          <Sparkles className="w-5 h-5" />
          Tạo tóm tắt & phân tích nội dung bằng AI
        </button>
      )}

      {isAnalyzing && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-slate-100 rounded-full w-full" />
          <div className="h-3 bg-slate-100 rounded-full w-5/6" />
          <div className="h-3 bg-slate-100 rounded-full w-2/3" />
          <p className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> AI đang đọc và phân tích tài liệu...
          </p>
        </div>
      )}

      {aiData && !isAnalyzing && (
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
            {aiData.summary}
          </p>

          {hasUnlockedFull ? (
            <>
              {aiData.keywords?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Tags className="w-3.5 h-3.5" /> Chủ đề chính
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {aiData.keywords.map((kw, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {aiData.studyQuestions?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Câu hỏi ôn tập gợi ý
                  </h4>
                  <ul className="space-y-1.5">
                    {aiData.studyQuestions.map((q, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              Mở khóa tài liệu để xem từ khóa chính và câu hỏi ôn tập do AI gợi ý.
            </div>
          )}

          <p className="text-[10px] text-slate-400 italic">
            Nội dung do AI tạo tự động, chỉ mang tính tham khảo và có thể chưa chính xác hoàn toàn.
          </p>
        </div>
      )}
    </div>
  );
}