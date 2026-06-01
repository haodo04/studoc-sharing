import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiEndpoints from "../../../api/apiEndpoint";
import {
  Copy,
  Download,
  Eye,
  Grid,
  List,
  Lock,
  Globe,
  Trash2,
  Search,
  FolderOpen,
  Loader2
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FileCard from "../../../components/ui/FileCard";
import ConfirmationDialog from "../../../components/ui/confirmationDialog";
import LinkShareModal from "../../../components/ui/LinkShareModal";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    selectedFile: null 
  });

  const [shareModal, setShareModal] = useState({
    isOpen: false,
    fileId: null,
    link: ""
  }); 

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.FETCH_FILES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setFiles(Array.isArray(response.data) ? response.data : response.data.files || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Không thể kết nối danh mục file từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [getToken]);

  const handleTogglePublic = async (id) => {
    try {
      const token = await getToken();
      const response = await axios.put(apiEndpoints.TOGGLE_FILE(id), {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        toast.success("Cập nhật quyền hạn tài liệu thành công!");
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            (file.id === id || file._id === id) ? { ...file, isPublic: !file.isPublic } : file
          )
        );
      }
    } catch (error) {
      console.error("Error toggling privacy:", error);
      toast.error("Lỗi cập nhật trạng thái riêng tư.");
    }
  };

  const openDeleteConfirmation = (file) => {
    setDeleteConfirmation({ isOpen: true, selectedFile: file });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, selectedFile: null });
  };

  const handleDelete = async () => {
  const fileTarget = deleteConfirmation.selectedFile;
  if (!fileTarget) return;

  const targetId = fileTarget.id || fileTarget._id;
  
  try {
    const token = await getToken();
    const response = await axios.delete(apiEndpoints.DELETE_FILE(targetId), {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200 || response.status === 204) {
      toast.success("Đã xóa tài liệu khỏi hệ thống!");
      
      setFiles((prevFiles) => 
        prevFiles.filter((file) => {
          const fileId = file.id || file._id;
          return fileId !== targetId; 
        })
      );
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error("Quá trình xóa tài liệu thất bại.");
  } finally {
    closeDeleteConfirmation();
  }
};

  const openShareModal = (file) => {
    const fileId = file.id || file._id;
    const shareLink = `${window.location.origin}/file/${fileId}`;
    setShareModal({ isOpen: true, fileId: fileId, link: shareLink });
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, fileId: null, link: "" });
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filteredFiles = files.filter(file => 
    (file.name || file.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout activeMenu="My Files">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* TOP INTERACTIVE HUB */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu của bạn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center border border-slate-200 p-1 bg-slate-50/50 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              title="Xem dạng danh sách"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              title="Xem dạng lưới ô vuông"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={36} />
            <p className="text-sm font-medium text-slate-700">Đang đồng bộ dữ liệu kho lưu trữ...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-3">
              <FolderOpen size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Kho tài liệu trống</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Bạn chưa tải lên tài liệu nào hoặc không khớp với từ khóa tìm kiếm.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW RENDER */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredFiles.map((file) => {
              const fileId = file.id || file._id;
              return (
                <FileCard
                  key={fileId}
                  file={file}
                  onDelete={() => openDeleteConfirmation(file)}
                  onTogglePublic={() => handleTogglePublic(fileId)}
                  onShare={() => openShareModal(file)}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500">Tên tài liệu</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Dung lượng</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Người sở hữu</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Ngày tải lên</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Trạng thái</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500 text-center">Tác vụ nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => {
                  const fileId = file.id || file._id;
                  return (
                    <tr key={fileId} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-700 max-w-[240px] truncate" title={file.name || file.title}>
                        {file.name || file.title}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-slate-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">Bạn</td>
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {formatDate(file.uploadedAt || file.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTogglePublic(fileId)}
                          className="inline-flex items-center text-[11px] font-semibold rounded-full border transition-all cursor-pointer active:scale-95 overflow-hidden"
                        >
                          {file.isPublic ? (
                            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border-emerald-100 px-2.5 py-1">
                              <Globe size={12} />
                              <span>Công khai</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-600 bg-slate-50 border-slate-200/60 px-2.5 py-1">
                              <Lock size={12} />
                              <span>Riêng tư</span>
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openShareModal(file)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Chia sẻ liên kết"
                          >
                            <Copy size={15} />
                          </button>
                          
                          <a
                            href={apiEndpoints.DOWNLOAD_FILE(fileId)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center"
                            title="Tải về máy"
                          >
                            <Download size={15} />
                          </a>

                          {fileId ? (
                            <a
                              href={`/file/${fileId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center justify-center"
                              title="Xem chi tiết"
                            >
                              <Eye size={15} />
                            </a>
                          ) : (
                            <span className="w-8"></span>
                          )}

                          <button
                            onClick={() => openDeleteConfirmation(file)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa tài liệu"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationDialog
            isOpen={deleteConfirmation.isOpen}
            onClose={closeDeleteConfirmation}
            title="Xóa tài liệu hệ thống"
            message="Bạn có chắc chắn muốn loại bỏ vĩnh viễn tệp tin này? Hành động này sẽ không thể hoàn tác dữ liệu."
            confirmText="Xác nhận xóa"
            cancelText="Hủy bỏ"
            onConfirm={handleDelete}
            confirmButtonClass="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-lg"
        />

        <LinkShareModal
            isOpen={shareModal.isOpen}
            onClose={closeShareModal}
            link={shareModal.link}
            title="Chia sẻ tài liệu học tập"
        />

      </div>
    </DashboardLayout>
  );
};

export default MyFiles;