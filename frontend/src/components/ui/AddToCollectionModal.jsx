import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { X, Plus, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCollectionModal } from "../../context/CollectionModalContext";
import { collectionApi } from "../../api/collectionApi";

export default function AddToCollectionModal() {
  const { targetFileId, closeCollectionModal } = useCollectionModal();
  const { getToken } = useAuth();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!targetFileId) return;

    const load = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await collectionApi.getCollectionsContainingFile(targetFileId, token);
        setCollections(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách bộ sưu tập.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [targetFileId, getToken]);

  if (!targetFileId) return null;

  const handleToggle = async (collectionId, checked) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, containsFile: checked } : c)),
    );
    try {
      const token = await getToken();
      if (checked) await collectionApi.addFile(collectionId, targetFileId, token);
      else await collectionApi.removeFile(collectionId, targetFileId, token);
    } catch (err) {
      toast.error("Có lỗi xảy ra, thử lại sau!");
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, containsFile: !checked } : c)),
      );
    }
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name || creating) return;

    setCreating(true);
    try {
      const token = await getToken();
      const res = await collectionApi.create(name, token);
      await collectionApi.addFile(res.data.id, targetFileId, token);
      setCollections((prev) => [{ ...res.data, containsFile: true }, ...prev]);
      setNewName("");
      toast.success("Đã tạo bộ sưu tập và thêm tài liệu!");
    } catch (err) {
      toast.error("Không thể tạo bộ sưu tập.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      onClick={closeCollectionModal}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">Thêm vào bộ sưu tập</h3>
          <button onClick={closeCollectionModal} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        ) : (
          <div className="max-h-56 overflow-y-auto space-y-1 mb-3">
            {collections.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có bộ sưu tập nào.</p>
            ) : (
              collections.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={c.containsFile}
                    onChange={(e) => handleToggle(c.id, e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex-1 text-slate-700 font-medium truncate">{c.name}</span>
                  <span className="text-[11px] text-slate-400">{c.fileCount} tài liệu</span>
                </label>
              ))
            )}
          </div>
        )}

        <div className="border-t border-slate-100 pt-3 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Tạo bộ sưu tập mới..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}