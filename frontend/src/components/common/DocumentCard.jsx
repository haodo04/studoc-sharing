import React, { useState, useEffect } from "react";
import { Star, Heart, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToCollectionButton from "../ui/AddToCollectionButton"; 

const ThumbnailImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={
        imgSrc ||
        "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=60"
      }
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(
          "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=60"
        );
      }}
    />
  );
};

export default function DocumentCard({ doc, isFavorited, onToggleFavorite }) {
  const navigate = useNavigate();
  const fileId = doc.id || doc._id;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(fileId);
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`/document/${fileId}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer relative"
    >
      <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
        <ThumbnailImage
          src={doc.thumbnailUrl}
          alt={doc.title || doc.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-2 left-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1">
          <span>{doc.docType || "Tài liệu"}</span>
        </span>

        <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
          {doc.creditCost === 0 ? "Miễn phí" : `${doc.creditCost} Xu`}
        </span>

        {/* Nút yêu thích + bộ sưu tập */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          <div className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm transition-all [&_svg]:text-white [&_svg:hover]:text-indigo-300">
            <AddToCollectionButton fileId={fileId} variant="bare" />
          </div>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm transition-all"
            title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? "text-pink-500 fill-pink-500" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase text-slate-500">
            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              {doc.universityId === "OTHER_UNI" ? doc.customUniversity : doc.universityId}
            </span>
            <span className="truncate max-w-[120px]">{doc.subjectCode}</span>
          </div>

          <h3 className="font-bold text-[13px] text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {doc.title || doc.name}
          </h3>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-slate-800">
              {typeof doc.rating === "number" ? doc.rating.toFixed(1) : doc.rating || "0.0"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{doc.downloadCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}