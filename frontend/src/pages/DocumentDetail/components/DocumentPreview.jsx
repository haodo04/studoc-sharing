import React from "react";
import { FileText, Lock, Download } from "lucide-react";

export default function DocumentPreview({ documentData, handleDownload }) {
  const BASE_URL = "http://localhost:8080/api/v1.0";

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

      {/* Khu vực hiển thị nội dung trang đọc thử */}
      <div className="p-4 md:p-6 bg-slate-100 space-y-4 max-h-[620px] overflow-y-auto relative flex flex-col items-center">
        {documentData.previewUrls && documentData.previewUrls.length > 0 ? (
          documentData.previewUrls
            .slice(0, 2)
            .map((url, index) => (
              <img
                key={index}
                src={url.startsWith("http") ? url : `${BASE_URL}${url}`}
                alt={`Trang đọc thử ${index + 1}`}
                className="w-full max-w-2xl bg-white shadow-sm rounded-lg border border-slate-200"
              />
            ))
        ) : (
          <img
            src={
              documentData.thumbnailUrl
                ? documentData.thumbnailUrl.startsWith("http")
                  ? documentData.thumbnailUrl
                  : `${BASE_URL}${documentData.thumbnailUrl}`
                : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"
            }
            alt="Thumbnail tài liệu"
            className="w-full max-w-md bg-white shadow-sm rounded-lg border border-slate-200 object-contain"
          />
        )}

        {/* Khối mờ Lock mờ (Blur) báo hiệu khóa */}
        <div className="absolute inset-x-0 bottom-0 top-[350px] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
          <div className="max-w-md space-y-3 pb-2">
            <Lock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
            <h3 className="text-sm md:text-base font-extrabold tracking-tight">
              Mở khóa để đọc toàn bộ {documentData.pageCount || 0} trang
            </h3>
            <p className="text-[11px] text-slate-400 px-4 leading-normal">
              Vui lòng sử dụng lượt tải tích lũy hoặc tiêu hao{" "}
              {documentData.creditCost || 0} Xu để tải xuống bản đầy đủ chất
              lượng cao.
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
