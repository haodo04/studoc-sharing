import React from 'react';
import { Star } from 'lucide-react';

export default function RatingSection({ 
  userRating, 
  hoverRating, 
  setHoverRating, 
  handleRate, 
  isSubmittingRating 
}) {
  // Đảm bảo userRating luôn có giá trị số (mặc định là 0 nếu chưa có dữ liệu từ BE)
  const currentRating = userRating || 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase flex items-center gap-1.5 text-indigo-600">
          <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" /> Đánh giá của bạn về tài liệu này
        </h3>
        {currentRating > 0 && (
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
            Bạn đã đánh giá {currentRating}/5 sao
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmittingRating}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-all active:scale-125 focus:outline-none disabled:opacity-50"
            >
              <Star 
                className={`w-7 h-7 ${
                  (hoverRating || currentRating) >= star 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-slate-200 fill-slate-50"
                }`} 
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
          Đánh giá của bạn giúp cộng đồng sinh viên dễ dàng lọc và tìm kiếm được các nguồn tài liệu học tập uy tín nhất.
        </p>
      </div>
    </div>
  );
}