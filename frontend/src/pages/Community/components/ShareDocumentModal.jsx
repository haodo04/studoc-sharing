import React, { useState } from "react";
import { X, Search, FileText, Coins } from "lucide-react";
import { documentApi } from "../../../api/documentApi";

export default function ShareDocumentModal({ onClose, onPick }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      setIsSearching(true);
      const data = await documentApi.searchDocuments({ keyword, limit: 10 });
      setResults(data?.content || data || []);
    } catch (err) {
      console.error("Lỗi tìm tài liệu để chia sẻ:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Chia sẻ tài liệu</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tài liệu theo tên..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="max-h-72 overflow-y-auto space-y-2">
          {isSearching ? (
            <p className="text-center text-[11px] text-slate-400 py-4">Đang tìm...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-[11px] text-slate-400 py-4">
              Nhập từ khóa và bấm tìm để chọn tài liệu chia sẻ.
            </p>
          ) : (
            results.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onPick(doc)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left"
              >
                <img
                  src={doc.thumbnailUrl}
                  alt={doc.title}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{doc.title || doc.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {doc.subjectName || "Chưa phân loại"}
                    <Coins className="w-3 h-3 ml-1.5 text-amber-500" /> {doc.creditCost || 0} xu
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}