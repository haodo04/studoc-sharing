import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  ChevronLeft,
  Loader2,
  Layers,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
} from "lucide-react";
import axios from "axios";
import apiEndpoints from "../../../api/apiEndpoint";
import { collectionApi } from "../../../api/collectionApi";
import toast from "react-hot-toast";
import DocumentCard from "../../../components/common/DocumentCard";
import ConfirmationDialog from "../../../components/ui/confirmationDialog";

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteFileIds, setFavoriteFileIds] = useState(new Set());

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await collectionApi.getDetail(collectionId, token);
      setCollection(res.data);
      setRenameValue(res.data.name);
    } catch (err) {
      console.error("Lỗi khi tải bộ sưu tập:", err);
      toast.error("Không thể tải bộ sưu tập này. Có thể đã bị xoá.");
      navigate("/user/collections");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.GET_FAVORITES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setFavoriteFileIds(new Set(response.data.map((f) => f.fileId)));
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích:", err);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && collectionId) {
      fetchCollection();
      fetchFavorites();
    }
  }, [isLoaded, isSignedIn, collectionId]);

  const handleToggleFavorite = async (fileId) => {
    try {
      const token = await getToken();
      const response = await axios.post(
        apiEndpoints.TOGGLE_FAVORITE(fileId),
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        const isFavorited = response.data;
        setFavoriteFileIds((prev) => {
          const newSet = new Set(prev);
          if (isFavorited) newSet.add(fileId);
          else newSet.delete(fileId);
          return newSet;
        });
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật yêu thích.");
    }
  };

  const handleRemoveFile = async (fileId) => {
    const prevFiles = collection.files;
    setCollection((prev) => ({
      ...prev,
      files: prev.files.filter((f) => (f.id || f._id) !== fileId),
    }));
    try {
      const token = await getToken();
      await collectionApi.removeFile(collectionId, fileId, token);
      toast.success("Đã bỏ tài liệu khỏi bộ sưu tập");
    } catch (err) {
      toast.error("Không thể bỏ tài liệu, thử lại sau!");
      setCollection((prev) => ({ ...prev, files: prevFiles }));
    }
  };

  const handleRename = async () => {
    const name = renameValue.trim();
    if (!name || renaming) return;

    setRenaming(true);
    try {
      const token = await getToken();
      await collectionApi.rename(collectionId, name, token);
      setCollection((prev) => ({ ...prev, name }));
      setIsRenaming(false);
      toast.success("Đã đổi tên bộ sưu tập!");
    } catch (err) {
      toast.error("Không thể đổi tên bộ sưu tập.");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await getToken();
      await collectionApi.remove(collectionId, token);
      toast.success("Đã xoá bộ sưu tập!");
      navigate("/user/collections");
    } catch (err) {
      toast.error("Không thể xoá bộ sưu tập.");
    } finally {
      setDeleteConfirmation(false);
    }
  };

  const filteredFiles = (collection?.files || []).filter((f) =>
    (f.title || f.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout activeMenu="Bộ sưu tập">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        <button
          onClick={() => navigate("/user/collections")}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 w-fit"
        >
          <ChevronLeft className="w-4 h-4" /> Quay lại danh sách bộ sưu tập
        </button>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={36} />
            <p className="text-sm font-medium text-slate-700">Đang tải bộ sưu tập...</p>
          </div>
        ) : !collection ? null : (
          <>
            {/* HEADER BỘ SƯU TẬP */}
            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Layers size={20} />
                </div>
                <div className="min-w-0">
                  {isRenaming ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        autoFocus
                        className="text-base font-bold text-slate-900 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                      />
                      <button
                        onClick={handleRename}
                        disabled={renaming}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {renaming ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => { setIsRenaming(false); setRenameValue(collection.name); }}
                        className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-base font-bold text-slate-900 truncate">{collection.name}</h2>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(collection.files || []).length} tài liệu
                  </p>
                </div>
              </div>

              {!isRenaming && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Pencil size={14} /> Đổi tên
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} /> Xoá bộ sưu tập
                  </button>
                </div>
              )}
            </div>

            {/* THANH TÌM KIẾM TRONG BỘ SƯU TẬP */}
            {collection.files?.length > 0 && (
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm trong bộ sưu tập này..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-700 transition-all"
                />
              </div>
            )}

            {/* DANH SÁCH TÀI LIỆU */}
            {filteredFiles.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-3">
                  <Layers size={28} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {collection.files?.length > 0 ? "Không tìm thấy tài liệu phù hợp" : "Bộ sưu tập này chưa có tài liệu nào"}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Bấm icon "Thêm vào bộ sưu tập" ở bất kỳ tài liệu nào và chọn bộ sưu tập này để thêm vào đây.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredFiles.map((file) => {
                  const fileId = file.id || file._id;
                  return (
                    <div key={fileId} className="flex flex-col gap-2">
                      <DocumentCard
                        doc={file}
                        isFavorited={favoriteFileIds.has(fileId)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                      <button
                        onClick={() => handleRemoveFile(fileId)}
                        className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors self-start px-1"
                      >
                        Bỏ khỏi bộ sưu tập
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <ConfirmationDialog
          isOpen={deleteConfirmation}
          onClose={() => setDeleteConfirmation(false)}
          title="Xoá bộ sưu tập"
          message="Bạn có chắc chắn muốn xoá vĩnh viễn bộ sưu tập này? Các tài liệu bên trong sẽ không bị xoá khỏi hệ thống, chỉ mất liên kết khỏi bộ sưu tập này."
          confirmText="Xác nhận xoá"
          cancelText="Hủy bỏ"
          onConfirm={handleDelete}
          confirmButtonClass="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm rounded-lg"
        />
      </div>
    </DashboardLayout>
  );
};

export default CollectionDetail;