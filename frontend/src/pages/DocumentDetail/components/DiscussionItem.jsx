import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  CornerDownRight,
  Pencil,
  Trash2,
  X,
  Check,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { discussionApi } from "../../../api/discussionApi";

const MAX_INDENT_DEPTH = 5;

export default function DiscussionItem({
  node,
  fileId,
  depth,
  currentUser,
  onReplyAdded,
  onUpdated,
  onDeleted,
}) {
  const { userId, getToken, isSignedIn } = useAuth();

  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(node.content || "");
  const [isBusy, setIsBusy] = useState(false);

  const isOwner = isSignedIn && userId === node.clerkId;
  const indentPx = Math.min(depth, MAX_INDENT_DEPTH) * 20;
  const hasChildren = node.children && node.children.length > 0;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để trả lời.");
      return;
    }
    if (!replyContent.trim()) return;
    try {
      setIsBusy(true);
      const token = await getToken();
      const created = await discussionApi.create(
        fileId,
        {
          content: replyContent,
          parentId: node.id,
          userFullName: currentUser.fullName,
          userPhotoUrl: currentUser.imageUrl,
        },
        token,
      );
      onReplyAdded(created);
      setReplyContent("");
      setIsReplying(false);
    } catch (err) {
      console.error(err);
      toast.error("Trả lời thất bại, thử lại nhé.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    try {
      setIsBusy(true);
      const token = await getToken();
      const updated = await discussionApi.update(node.id, editContent, token);
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Sửa bình luận thất bại.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 text-xs">
          <span className="font-semibold text-slate-700">
            Xóa bình luận này?
          </span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded-md bg-slate-100 text-slate-500 text-[11px] font-bold hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete();
              }}
              className="px-3 py-1 rounded-md bg-red-500 text-white text-[11px] font-bold hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        </div>
      ),
      {
        duration: 3000, 
      },
    );
  };

  const confirmDelete = async () => {
    try {
      setIsBusy(true);
      const token = await getToken();
      await discussionApi.remove(node.id, token);
      onDeleted(node.id, hasChildren);
    } catch (err) {
      console.error(err);
      toast.error("Xóa bình luận thất bại.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div style={{ marginLeft: indentPx }} className="text-xs">
      <div className="flex items-start gap-2">
        <img
          src={
            node.userPhotoUrl ||
            "https://images.clerk-static.com/preview-placeholder.png"
          }
          alt={node.userFullName}
          className="w-6 h-6 rounded-full object-cover bg-slate-100 shrink-0 mt-0.5"
          onError={(e) => {
            e.target.src =
              "https://images.clerk-static.com/preview-placeholder.png";
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-800">
              {node.deleted ? "Người dùng" : node.userFullName}
            </span>
            {node.isAuthorReply && !node.deleted && (
              <span className="flex items-center gap-0.5 text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" /> Tác giả
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-medium">
              {node.createdAt
                ? new Date(node.createdAt).toLocaleDateString("vi-VN")
                : "Vừa xong"}
            </span>
            {node.edited && !node.deleted && (
              <span className="text-[10px] text-slate-300 italic">
                (đã chỉnh sửa)
              </span>
            )}
          </div>

          {node.deleted ? (
            <p className="text-slate-300 italic mt-1">
              Bình luận này đã bị xóa.
            </p>
          ) : isEditing ? (
            <div className="mt-1 space-y-1.5">
              <textarea
                rows={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isBusy}
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleSaveEdit}
                  disabled={isBusy}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700"
                >
                  <Check className="w-3 h-3" /> Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(node.content || "");
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold hover:bg-slate-200"
                >
                  <X className="w-3 h-3" /> Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 mt-0.5 leading-normal whitespace-pre-line">
              {node.content}
            </p>
          )}

          {!node.deleted && !isEditing && (
            <div className="flex items-center gap-3 mt-1">
              {isSignedIn && (
                <button
                  onClick={() => setIsReplying((v) => !v)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600"
                >
                  <CornerDownRight className="w-3 h-3" /> Trả lời
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600"
                  >
                    <Pencil className="w-3 h-3" /> Sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </>
              )}
            </div>
          )}

          {isReplying && (
            <form onSubmit={handleReply} className="mt-2 space-y-1.5">
              <textarea
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết câu trả lời..."
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isBusy}
              />
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  disabled={isBusy || !replyContent.trim()}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Gửi
                </button>
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold hover:bg-slate-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className="mt-2.5 space-y-2.5 border-l border-slate-100 pl-3">
          {node.children.map((child) => (
            <DiscussionItem
              key={child.id}
              node={child}
              fileId={fileId}
              depth={depth + 1}
              currentUser={currentUser}
              onReplyAdded={onReplyAdded}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
