import { useRef, useState } from "react";
import {
  Upload,
  X,
  FileIcon,
  FileText,
  Image,
  Music,
  Video,
} from "lucide-react";

const UploadBox = ({
  files = [],
  onFileChange,
  onUpload,
  uploading = false,
  onRemoveFile,
  remainingCredits = 0,
  isUploadDisable = false,
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
    <div className="w-full bg-white p-5 sm:p-6 rounded-xl flex flex-col gap-5">
      {/* Kéo thả tệp tin */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/40"
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
        {/* ĐỔI TEXT-PURPLE SANG TEXT-INDIGO */}
        <div className={`p-4 rounded-xl mb-3 ${isDragging ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
          <Upload size={28} className={uploading ? "animate-bounce text-indigo-500" : ""} />
        </div>
        <p className="text-sm font-medium text-slate-700">
          Kéo thả chuỗi tệp tin vào đây hoặc <span className="text-indigo-600 hover:underline font-semibold">Chọn từ máy tính</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Hỗ trợ PDF, Word, PowerPoint, Hình ảnh... dung lượng tối đa 20MB
        </p>
      </div>

      {/* Hiển thị danh sách file đã chọn trong hàng đợi */}
      <div className="w-full">
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-0.5">Danh sách tệp chuẩn bị ({files.length})</p>
            <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
              {files.map((file, index) => (
                <div
                  key={`${file.name}_${index}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-white border border-slate-200/80 shadow-sm rounded-lg flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700 max-w-[280px]" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
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
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Xóa tệp khỏi hàng đợi"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Nút bấm Submit tải lên hành trình */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              {/* ĐỔI BG-PURPLE SANG BG-INDIGO */}
              <button
                type="button"
                onClick={onUpload}
                disabled={isUploadDisable || uploading}
                className={`rounded-lg px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all flex items-center gap-2 ${
                  isUploadDisable || uploading
                    ? "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100"
                }`}
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang xử lý tải lên...
                  </>
                ) : (
                  "Tiến hành tải lên hệ thống"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBox;