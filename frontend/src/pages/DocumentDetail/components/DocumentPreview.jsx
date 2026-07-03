import React from "react";
import { FileText, Lock, Download, Unlock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentPreview({
  documentData,
  handleDownload,
  hasUnlockedFull = false,
  onUnlockFull,
}) {
  const DEFAULT_FALLBACK_IMG =
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=60";

  const handleOpenInNewTab = () => {
    const isPdf = documentData?.type?.toLowerCase().includes("pdf");

    const viewUrl =
      documentData?.viewableUrl || (isPdf ? documentData?.fileLocation : null);

    if (viewUrl) {
      window.open(viewUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.error(
        "Định dạng file này chưa hỗ trợ xem trước online, vui lòng tải về máy để xem.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          Trình xem tài liệu ({documentData?.pageCount || 0} trang)
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] border ${
            hasUnlockedFull
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
          }`}
        >
          {hasUnlockedFull ? "Đã mở khóa vĩnh viễn" : "Bản đọc thử giới hạn"}
        </span>
      </div>

      <div className="bg-slate-100 flex-1 max-h-[650px] overflow-y-auto relative flex flex-col items-center custom-scrollbar">
        {documentData?.previewUrls && documentData.previewUrls.length > 0 ? (
          <div
            className={`p-4 md:p-6 space-y-4 w-full flex flex-col items-center ${!hasUnlockedFull ? "pb-44" : "pb-24"}`}
          >
            {(hasUnlockedFull
              ? documentData.previewUrls
              : documentData.previewUrls.slice(0, 2)
            ).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Trang tài liệu ${index + 1}`}
                className="w-full max-w-2xl bg-white shadow-sm rounded-lg border border-slate-200 object-contain"
                onError={(e) => {
                  e.target.src = DEFAULT_FALLBACK_IMG;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 md:p-6 w-full flex justify-center items-center h-[520px] bg-slate-100 relative overflow-hidden">
            <img
              src={documentData?.thumbnailUrl || DEFAULT_FALLBACK_IMG}
              alt={documentData?.title || "Thumbnail tài liệu"}
              className="h-full w-auto max-w-full bg-white shadow-md rounded-lg border border-slate-200 object-contain"
              onError={(e) => {
                e.target.src = DEFAULT_FALLBACK_IMG;
              }}
            />
          </div>
        )}

        {!hasUnlockedFull && (
          <div className="absolute inset-x-0 bottom-0 pt-36 pb-6 bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
            <div className="max-w-md space-y-3 pb-2 w-full">
              <Lock className="w-6 h-6 mx-auto mb-1 text-indigo-400 animate-pulse" />
              <h3 className="text-sm md:text-base font-extrabold tracking-tight text-slate-100">
                Mở khóa để xem và tải toàn bộ tài liệu
              </h3>
              <p className="text-[11px] text-slate-400 px-6 leading-normal">
                Sử dụng{" "}
                <span className="text-indigo-400 font-bold">
                  {documentData?.creditCost || 0} Xu
                </span>{" "}
                để mở khóa quyền sở hữu. Bạn sẽ không bị che mờ nội dung và được
                tải file gốc bất kỳ lúc nào.
              </p>

              <button
                onClick={onUnlockFull}
                className="w-full max-w-xs mx-auto mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-xs flex justify-center items-center gap-2 tracking-wide uppercase"
              >
                <Unlock className="w-4 h-4" /> Mở khóa ngay (
                {documentData?.creditCost || 0} Xu)
              </button>
            </div>
          </div>
        )}

        {hasUnlockedFull && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-800 p-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                Tài liệu này đã thuộc sở hữu của bạn!
              </p>
              <p className="text-[10px] text-slate-400">
                Bạn được chọn các hành động hoàn toàn miễn phí dưới đây.
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenInNewTab}
                className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-xl border border-slate-700 text-xs flex justify-center items-center gap-1.5 transition-all active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Xem toàn bộ
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Tải về máy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
