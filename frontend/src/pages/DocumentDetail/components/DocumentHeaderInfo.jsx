import React from 'react';
import { Landmark, Eye, Download, Star, Heart } from 'lucide-react';

export default function DocumentHeaderInfo({ documentData, isFavorited, onToggleFavorite }) {
  if (!documentData) return null;
  const data = documentData.documentData ? documentData.documentData : documentData;
  
  const authorName = documentData.authorName || data.authorName || documentData.author || "Thành viên StuDoc";
  const authorAvatar = documentData.authorAvatar || data.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";

  const formatDate = (dateString) => {
    if (!dateString) return "Đang cập nhật";
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-extrabold uppercase px-2.5 py-1 rounded-md border border-indigo-100">
            {data.docType || "Tài liệu"}
          </span>
          <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> {data.universityId || "Đang cập nhật"}
          </span>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
            isFavorited 
              ? "bg-pink-50 border-pink-200 text-pink-700" 
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
          title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-pink-500 text-pink-500" : ""}`} />
          <span className="hidden sm:inline">{isFavorited ? "Đã lưu" : "Lưu lại"}</span>
        </button>
      </div>

      <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
        {data.title || data.name}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <img 
            src={authorAvatar} 
            alt={authorName} 
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div>
            <div className="text-slate-800 font-bold">bởi {authorName}</div>
            <div className="text-[10px] text-slate-400 font-normal">Đăng ngày {formatDate(data.uploadedAt)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-slate-400" /> 
            <strong className="text-slate-700">{data.viewCount ?? 0}</strong> xem
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4 text-slate-400" /> 
            <strong className="text-slate-700">{data.downloadCount ?? 0}</strong> tải
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" /> 
            <strong className="text-slate-700">{data.rating ?? "0.0"}</strong> 
            <span className="text-slate-500">({data.reviewCount ?? 0} đánh giá)</span>
          </span>
        </div>
      </div>
    </div>
  );
}