import { useRef, useState } from "react";
import {
  Upload,
  X,
  FileIcon,
  FileText,
  Image,
  Music,
  Video,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const DashboardUpload = ({
  files = [],
  onFileChange,
  onUpload,
  uploading = false,
  onRemoveFile,
  remainingUploads = 5,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const syntheticEvent = {
      target: {
        files: e.dataTransfer.files,
      },
    };

    onFileChange?.(syntheticEvent);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={18} className="text-indigo-500" />;
    }
    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={18} className="text-sky-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={18} className="text-emerald-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={18} className="text-amber-500" />;
    }
    return <FileIcon size={18} className="text-indigo-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header Panel */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Tải tài liệu mới</h2>
          <p className="text-xs text-slate-500 mt-0.5">Chia sẻ kiến thức tới mọi người</p>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/80 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-medium text-indigo-700">Số dư: {remainingUploads} Cr</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/40 scale-[0.99]"
              : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50"
          }`}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={onFileChange}
            multiple
            className="hidden"
          />
          <div className={`p-3 rounded-xl mb-3 transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            <Upload size={24} className={uploading ? "animate-bounce text-indigo-500" : ""} />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Kéo thả tệp tin hoặc <span className="text-indigo-600 hover:underline font-semibold">Chọn từ thiết bị</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Hỗ trợ PDF, Word, PowerPoint, Hình ảnh... tối đa 20MB
          </p>
        </div>

        {/* Selected Files Preview Queue */}
        {files.length > 0 && (
          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-0.5">Hàng đợi tải lên ({files.length})</p>
            {files.map((file, index) => (
              <div
                key={`${file.name}_${index}`}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-sm flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile?.(index);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors ml-2"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <AlertCircle size={12} /> Tải lên tài liệu hữu ích để nhận thêm Credit.
          </div>
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading || files.length === 0}
            className={`rounded-lg px-5 py-2 text-xs font-medium text-white shadow-sm transition-all flex items-center gap-2 ${
              uploading || files.length === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100 font-semibold"
            }`}
          >
            {uploading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Đang xử lý...
              </>
            ) : (
              "Bắt đầu tải lên"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpload;