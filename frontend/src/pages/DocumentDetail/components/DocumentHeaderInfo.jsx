import React from 'react';
import { Landmark, Eye, Download, Star } from 'lucide-react';

export default function DocumentHeaderInfo({ documentData }) {
  // Hàm format hiển thị ngày tháng chuẩn Việt Nam từ chuỗi ISO MongoDB trả về
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
      <div className="flex flex-wrap gap-2">
        {/* Loại tài liệu: map từ docType (Ví dụ: Bài tập, Đề thi, Đồ án) */}
        <span className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-extrabold uppercase px-2.5 py-1 rounded-md border border-indigo-100">
          {documentData.docType || "Tài liệu"}
        </span>
        {/* Trường học: map từ universityId */}
        <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" /> {documentData.universityId || "Đang cập nhật"}
        </span>
      </div>

      {/* Tiêu đề tài liệu */}
      <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
        {documentData.title || documentData.name}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
        {/* Khu vực thông tin tác giả và ngày đăng tải */}
        <div className="flex items-center gap-2">
          <img 
            src={documentData.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
            alt={documentData.author || "User"} 
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div>
            <div className="text-slate-800 font-bold">bởi {documentData.author || "Thành viên StuDoc"}</div>
            <div className="text-[10px] text-slate-400 font-normal">Đăng ngày {formatDate(documentData.uploadedAt)}</div>
          </div>
        </div>

        {/* Khu vực các chỉ số tương tác dynamic từ Database */}
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-slate-400" /> 
            <strong className="text-slate-700">{documentData.viewCount ?? 0}</strong> xem
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4 text-slate-400" /> 
            <strong className="text-slate-700">{documentData.downloadCount ?? 0}</strong> tải
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" /> 
            <strong className="text-slate-700">{documentData.rating ?? "0.0"}</strong> 
            <span className="text-slate-500">({documentData.reviewCount ?? 0} đánh giá)</span>
          </span>
        </div>
      </div>
    </div>
  );
}