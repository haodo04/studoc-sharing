import React, { useState, useEffect } from "react";
import { FileText, Coins, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { documentApi } from "../../../api/documentApi";

// cache đơn giản trong bộ nhớ tab hiện tại, tránh gọi lại API cho cùng 1 fileId nhiều lần
const docInfoCache = new Map();

export default function DocumentCardMessage({ fileId }) {
  const navigate = useNavigate();
  const [doc, setDoc] = useState(docInfoCache.get(fileId) || null);
  const [isLoading, setIsLoading] = useState(!docInfoCache.has(fileId));

  useEffect(() => {
    if (docInfoCache.has(fileId)) return;
    let cancelled = false;

    documentApi
      .fetchDocumentDetails(fileId)
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.documentData || res.data;
        docInfoCache.set(fileId, data);
        setDoc(data);
      })
      .catch(() => !cancelled && setDoc(null))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [fileId]);

  if (isLoading) {
    return <div className="w-64 h-16 bg-slate-100 rounded-xl animate-pulse" />;
  }

  if (!doc) {
    return (
      <div className="w-64 p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-400 italic">
        Tài liệu này không còn tồn tại.
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(`/documents/${fileId}`)}
      className="w-64 flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all text-left group"
    >
      <img
        src={doc.thumbnailUrl}
        alt={doc.title}
        className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
        onError={(e) => (e.target.style.display = "none")}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800 truncate">{doc.title || doc.name}</p>
        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
          <FileText className="w-3 h-3" /> {doc.subjectName || "Chưa phân loại"}
        </p>
        <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
          <Coins className="w-3 h-3" /> {doc.creditCost || 0} xu
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />
    </button>
  );
}