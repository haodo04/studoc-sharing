import React, { useState, useEffect } from "react";
import { FileText, Lock, Download } from "lucide-react";

export default function DocumentPreview({ documentData, handleDownload }) {
  const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          Trình xem trước tài liệu ({documentData.pageCount || 0} trang)
        </span>
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30">
          Đọc thử miễn phí
        </span>
      </div>

      {/* Khu vực chứa nội dung */}
      <div className="bg-slate-100 max-h-[620px] overflow-y-auto relative flex flex-col items-center">
        
        {documentData.previewUrls && documentData.previewUrls.length > 0 ? (
          <div className="p-4 md:p-6 space-y-4 w-full flex flex-col items-center pb-32">
            {documentData.previewUrls.slice(0, 2).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Trang đọc thử ${index + 1}`}
                className="w-full max-w-2xl bg-white shadow-sm rounded-lg border border-slate-200"
                onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMG; }}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 md:p-6 w-full flex justify-center items-center h-[520px] bg-slate-100 relative overflow-hidden">
            <img
              src={documentData.thumbnailUrl || DEFAULT_FALLBACK_IMG}
              alt={documentData.title || "Thumbnail tài liệu"}
              className="h-full w-auto max-w-full bg-white shadow-md rounded-lg border border-slate-200 object-contain"
              onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMG; }}
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 pt-32 pb-6 bg-gradient-to-t from-slate-900 via-slate-900/85 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
          <div className="max-w-md space-y-3 pb-2">
            <Lock className="w-7 h-7 mx-auto mb-1 text-slate-300" />
            <h3 className="text-sm md:text-base font-extrabold tracking-tight">
              Mở khóa để đọc toàn bộ tài liệu
            </h3>
            <p className="text-[11px] text-slate-400 px-4 leading-normal">
              Vui lòng sử dụng lượt tải tích lũy hoặc tiêu hao{" "}
              {documentData.creditCost || 0} Xu để tải xuống bản đầy đủ chất lượng cao.
            </p>

            <button
              onClick={handleDownload}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold tracking-tight py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs flex justify-center items-center gap-2 mt-2"
            >
              <Download className="w-3.5 h-3.5" /> Sử dụng{" "}
              {documentData.creditCost || 0} Xu để Tải xuống ngay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}