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

    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={16} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={16} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={16} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={16} className="text-amber-500" />;
    }

    return <FileIcon size={16} className="text-purple-500" />;
  };

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload size={14} className="text-purple-500" />
          <h3 className="text-sm font-semibold text-gray-800">Upload Files</h3>
        </div>

        <p className="text-[11px] text-gray-400">
          {remainingUploads} of 5 files remaining
        </p>
      </div>

      <div
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`min-h-[150px] rounded-lg border border-dashed px-4 py-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? "border-purple-400 bg-purple-50"
            : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/40"
        }`}
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
          <Upload size={18} className="text-purple-500" />
        </div>

        <p className="text-sm text-gray-600">Drag and drop files here</p>
        <p className="mt-1 text-xs text-gray-400">or click to browse</p>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-gray-200">
                  {getFileIcon(file)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-700 max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
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
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onUpload}
              disabled={uploading || files.length === 0}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                uploading || files.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUpload;