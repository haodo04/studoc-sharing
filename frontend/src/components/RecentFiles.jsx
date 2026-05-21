import { useState } from "react";
import {
  FileIcon,
  FileText,
  Image,
  Music,
  Video,
  Lock,
  Globe,
  Search,
  SlidersHorizontal,
  FolderOpen,
  ArrowUpRight
} from "lucide-react";

const RecentFiles = ({ files = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Image size={15} className="text-indigo-500" />;
    }
    if (["mp4", "webm", "mov", "avi", "mkv"].includes(extension)) {
      return <Video size={15} className="text-sky-500" />;
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <Music size={15} className="text-emerald-500" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
      return <FileText size={15} className="text-amber-500" />;
    }
    return <FileIcon size={15} className="text-indigo-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedType === "all") return matchesSearch;
    
    const ext = file.name?.split(".").pop()?.toLowerCase();
    if (selectedType === "document") return matchesSearch && ["pdf", "doc", "docx", "txt"].includes(ext);
    if (selectedType === "image") return matchesSearch && ["jpg", "jpeg", "png", "webp", "svg"].includes(ext);
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Top Section Actions */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Tài liệu vừa tải lên</h2>
            <p className="text-xs text-slate-500 mt-0.5">Danh sách hồ sơ dữ liệu cá nhân của bạn</p>
          </div>
          {/* Quick Stats Counter */}
          <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-medium self-start sm:self-center shadow-sm">
            Tổng tài liệu: <span className="text-indigo-600 font-bold">{files.length}</span>
          </div>
        </div>

        {/* Interactive Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhanh tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedType === "all" ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedType("document")}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedType === "document" ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              Văn bản
            </button>
            <button
              onClick={() => setSelectedType("image")}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedType === "image" ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
            >
              Hình ảnh
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 overflow-x-auto">
        {filteredFiles.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
            <div className="p-4 bg-slate-50 rounded-full border border-slate-100 mb-3 text-slate-400">
              <FolderOpen size={24} className="stroke-[1.5]" />
            </div>
            <p className="text-sm font-medium text-slate-700">Chưa tìm thấy tài liệu nào</p>
            <p className="text-xs text-slate-400 max-w-[240px] mt-1">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc tiến hành kéo thả tệp mới ở bên cạnh.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Tên tài liệu</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Dung lượng</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Ngày tải</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Quyền hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFiles.map((file, index) => (
                <tr
                  key={file.id || index}
                  className="hover:bg-slate-50/70 group transition-colors"
                >
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex-shrink-0 group-hover:bg-white transition-colors">
                        {getFileIcon(file)}
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </td>

                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(file.uploadedAt)}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium border">
                      {file.isPublic ? (
                        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border-emerald-100 rounded-full px-2 py-0.5">
                          <Globe size={11} />
                          <span>Cộng đồng</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-50 border-slate-200/60 rounded-full px-2 py-0.5">
                          <Lock size={11} />
                          <span>Riêng tư</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentFiles;