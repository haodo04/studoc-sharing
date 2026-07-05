import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { discussionApi } from "../../../api/discussionApi";
import DiscussionItem from "./DiscussionItem";

// dựng cây từ list phẳng (parentId)
function buildTree(flatList) {
  const map = new Map();
  flatList.forEach((item) => map.set(item.id, { ...item, children: [] }));
  const roots = [];
  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId).children.push(item);
    } else {
      roots.push(item); 
    }
  });
  return roots;
}

export default function DiscussionSection({ fileId }) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  const [flatList, setFlatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useMemo(
    () => ({ fullName: user?.fullName || "Người dùng", imageUrl: user?.imageUrl || "" }),
    [user]
  );

  const fetchDiscussions = useCallback(async () => {
    if (!fileId) return;
    try {
      setIsLoading(true);
      const data = await discussionApi.getByFile(fileId);
      setFlatList(data || []);
    } catch (err) {
      console.error("Lỗi khi tải thảo luận:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const tree = useMemo(() => buildTree(flatList), [flatList]);
  const visibleCount = flatList.filter((c) => !c.deleted).length;

  const handlePostRoot = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để đặt câu hỏi.");
      return;
    }
    if (!newContent.trim()) return;

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const created = await discussionApi.create(
        fileId,
        { content: newContent, parentId: null, ...currentUser, userPhotoUrl: currentUser.imageUrl },
        token
      );
      setFlatList((prev) => [...prev, created]);
      setNewContent("");
    } catch (err) {
      console.error(err);
      toast.error("Gửi câu hỏi thất bại, thử lại nhé.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // mọi thao tác con (reply/sửa/xóa) đều update lại state tại chỗ, không fetch lại toàn bộ cây
  const handleReplyAdded = (created) => setFlatList((prev) => [...prev, created]);

  const handleUpdated = (updated) =>
    setFlatList((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

  const handleDeleted = (id, wasSoftDeleted) => {
    if (wasSoftDeleted) {
      setFlatList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, deleted: true, content: null } : c))
      );
    } else {
      setFlatList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase text-indigo-600 border-b border-slate-100 pb-2 flex items-center gap-1.5">
        <MessageCircle className="w-4 h-4" /> Hỏi đáp ({visibleCount})
      </h3>

      <form onSubmit={handlePostRoot} className="space-y-2">
        <textarea
          rows={2}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          placeholder={isSignedIn ? "Đặt câu hỏi về tài liệu này..." : "Đăng nhập để đặt câu hỏi..."}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          disabled={!isSignedIn || isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isSignedIn || isSubmitting || !newContent.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi câu hỏi"}
          </button>
        </div>
      </form>

      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {isLoading ? (
          <p className="text-slate-400 text-center py-2 text-[11px]">Đang tải thảo luận...</p>
        ) : tree.length === 0 ? (
          <p className="text-slate-400 text-center py-2 text-[11px]">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </p>
        ) : (
          tree.map((node) => (
            <DiscussionItem
              key={node.id}
              node={node}
              fileId={fileId}
              depth={0}
              currentUser={currentUser}
              onReplyAdded={handleReplyAdded}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}