import React from "react";

export default function StudyStateWrapper({ loading, error, onRetry, loadingLabel, children }) {
  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-xs text-slate-500 font-medium">
          {loadingLabel || "AI đang phân tích tài liệu, việc này có thể mất khoảng 15-30 giây..."}
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