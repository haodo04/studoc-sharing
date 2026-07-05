import React from "react";
import { FolderPlus } from "lucide-react";
import { useCollectionModal } from "../../context/CollectionModalContext";

export default function AddToCollectionButton({ fileId, variant = "icon" }) {
  const { openCollectionModal } = useCollectionModal();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCollectionModal(fileId);
  };

  if (variant === "bare") {
    return (
      <button
        onClick={handleClick}
        title="Thêm vào bộ sưu tập"
        className="p-0 leading-none flex items-center justify-center"
      >
        <FolderPlus className="w-4 h-4 text-white hover:text-indigo-300 transition-colors" />
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        title="Thêm vào bộ sưu tập"
      >
        <FolderPlus size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all"
      title="Thêm vào bộ sưu tập"
    >
      <FolderPlus className="w-4 h-4" />
      <span className="hidden sm:inline">Bộ sưu tập</span>
    </button>
  );
}
