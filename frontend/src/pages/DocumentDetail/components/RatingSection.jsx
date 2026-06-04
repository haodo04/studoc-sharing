import React, { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { addOrUpdateComment } from "../../../api/commentApi";
import toast from "react-hot-toast";

const RatingSection = ({ fileId, onCommentSuccess }) => {
  const { getToken, isSignedIn } = useAuth();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      setErrorMsg("Bạn cần đăng nhập để có thể đánh giá tài liệu này.");
      return;
    }

    if (rating === 0) {
      setErrorMsg("Vui lòng chọn số sao (từ 1 đến 5) trước khi gửi.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const token = await getToken();

      const commentData = {
        content: content.trim(),
        rating: rating,
      };

      const result = await addOrUpdateComment(fileId, commentData, token);
      setContent("");

      if (onCommentSuccess) {
        onCommentSuccess(result);
      }

      toast.success("Đánh giá và bình luận của bạn đã được ghi nhận!", {
        duration: 4000,
        style: {
          fontSize: "12px",
          fontWeight: "600",
          borderRadius: "12px",
          color: "#1e293b",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Gửi nhận xét thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6">
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 mb-4">
        Đánh giá & Bình luận tài liệu
      </h3>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            Mức độ hài lòng của bạn:
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  className="transition-transform duration-100 hover:scale-110 focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isSubmitting}
                >
                  <Star
                    size={24}
                    className={`${
                      isFilled
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="text-xs font-semibold text-amber-600 ml-2">
                ({rating}/5 sao)
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2"
          >
            Nội dung nhận xét:
          </label>
          <textarea
            id="content"
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 placeholder-slate-400 text-xs transition-all"
            placeholder={
              isSignedIn
                ? "Chia sẻ cảm nghĩ, đóng góp ý kiến của bạn về tài liệu này..."
                : "Bạn phải đăng nhập để viết bình luận..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isSignedIn || isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isSignedIn}
            className={`px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all ${
              isSubmitting || !isSignedIn
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {isSubmitting ? "Đang gửi xử lý..." : "Gửi nhận xét"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingSection;
