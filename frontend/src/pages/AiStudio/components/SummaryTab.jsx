import React, { useState, useEffect } from "react";
import axios from "axios";
import { Languages, RefreshCw } from "lucide-react";
import apiEndpoints from "../../../api/apiEndpoint";
import StudyStateWrapper from "./StudyStateWrapper";

export default function SummaryTab({ fileId, getToken }) {
  const [language, setLanguage] = useState("vi");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async (lang, regenerate = false) => {
    try {
      if (regenerate) setRegenerating(true);
      else setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await axios.get(
        apiEndpoints.GET_AI_SUMMARY(fileId, lang, regenerate),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Lỗi khi tải tóm tắt AI:", err);
      setError(
        err.response?.data?.message ||
          "Không thể tạo tóm tắt cho tài liệu này. Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchSummary(language, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {[
            { code: "vi", label: "Tiếng Việt" },
            { code: "en", label: "English" },
          ].map((opt) => (
            <button
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              disabled={loading || regenerating}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                language === opt.code
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchSummary(language, true)}
          disabled={loading || regenerating}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
          {regenerating ? "Đang tạo lại..." : "Tạo lại tóm tắt"}
        </button>
      </div>

      <StudyStateWrapper loading={loading} error={error} onRetry={() => fetchSummary(language, false)}>
        {summary?.content ? (
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
            {summary.content}
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">Chưa có dữ liệu tóm tắt.</p>
        )}
      </StudyStateWrapper>
    </div>
  );
}