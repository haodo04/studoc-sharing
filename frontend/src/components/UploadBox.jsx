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
      return <Image size={18} className="text-purple-500" />;
    }

    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={18} className="text-blue-500" />;
    }

    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={18} className="text-green-500" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={18} className="text-amber-500" />;
    }

    return <FileIcon size={18} className="text-purple-500" />;
  };

  return (
    <div className="w-full">
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Files
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {remainingCredits} credits remaining
          </p>
        </div>

        {/* Upload Area */}
        <div
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/40"
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Upload size={28} className="text-blue-600" />
          </div>

          <p className="text-lg font-medium text-gray-700">
            Drag and drop files here
          </p>

          <p className="mt-2 text-sm text-gray-500">
            or click to browse ({remainingCredits} credits remaining)
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* Selected files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Selected Files ({files.length})
            </h3>

            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200">
                      {getFileIcon(file)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
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
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onUpload}
                disabled={isUploadDisable || uploading}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors ${
                  isUploadDisable || uploading
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBox;
