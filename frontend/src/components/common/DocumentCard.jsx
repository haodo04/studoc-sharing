import React, { useState, useEffect } from "react";
import { Star, Heart, Download, FileText, Presentation, Archive, File } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const getFileIcon = (docType) => {
    const type = docType?.toLowerCase();
    if (type === "pdf") return <FileText className="w-4 h-4 text-red-500" />;
    if (type === "docx" || type === "doc")
      return <FileText className="w-4 h-4 text-blue-500" />;
    if (type === "pptx" || type === "ppt")
      return <Presentation className="w-4 h-4 text-orange-500" />;
    if (type === "zip" || type === "rar")
      return <Archive className="w-4 h-4 text-emerald-500" />;
    return <File className="w-4 h-4 text-slate-500" />;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(doc.id || doc._id);
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`/document/${doc.id || doc._id}`);
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
          {getFileIcon(doc.docType)}
          <span>{doc.docType || "Tài liệu"}</span>
        </span>

        <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
          {doc.creditCost === 0 ? "Miễn phí" : `${doc.creditCost} Xu`}
        </span>

        {/* Nút yêu thích */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm transition-all z-10"
          title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? "text-pink-500 fill-pink-500" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase text-slate-500">
            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              {doc.universityId === "OTHER_UNI"
                ? doc.customUniversity
                : doc.universityId}
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
            <span className="text-slate-800">{typeof doc.rating === 'number' ? doc.rating.toFixed(1) : (doc.rating || "0.0")}</span>
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
