import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { 
  Search, 
  Sparkles, 
  FileText, 
  Download, 
  Star, 
  Clock, 
  User, 
  MapPin, 
  Mail,
  ChevronRight,
  ShieldCheck,
  Share2,
  Bookmark,
  Flame,
  Layout,
  Eye,
  Lock,
  MessageSquare,
  Landmark,
  PenTool
} from 'lucide-react';

import { documentApi } from '../../api/documentApi';
import NavbarPage from '../../components/common/NavbarPage';

const RELATED_DOCUMENTS = [
  { id: "doc-5", title: "Sổ tay tóm tắt trọn bộ công thức Vật lý đại cương 1", school: "HUST", downloads: 3560, rating: 5.0, credits: 1, type: "Tóm tắt", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-9", title: "Đề cương ôn thi cấp tốc Đại số tuyến tính", school: "HUST", downloads: 4120, rating: 4.8, credits: 1, type: "Cấp tốc", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-13", title: "Ngân hàng đề thi trắc nghiệm Tin học đại cương HUST", school: "HUST", downloads: 1980, rating: 4.7, credits: 2, type: "Trắc nghiệm", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-14", title: "Giáo trình Giải tích 1 - Tác giả Nguyễn Đình Trí", school: "HUST", downloads: 2890, rating: 4.9, credits: 3, type: "Giáo trình", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" }
];

export default function DocumentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // ================= STATE QUẢN LÝ DỮ LIỆU ĐỘNG =================
  const [documentData, setDocumentData] = useState(null);
  const [comments, setComments] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false); 

  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // ================= FETCH DỮ LIỆU KHI VÀO TRANG =================
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        const response = await documentApi.fetchDocumentDetails(id || 'doc-1');
        if (response.status === 200) {
          setDocumentData(response.data);
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("Lỗi khi tải tài liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDocument();
  }, [id]);

  // ================= HANDLERS =================
  const handleDownload = () => {
    if (!documentData) return;
    alert(`Hệ thống đang trừ ${documentData.creditsCost} lượt tải để bắt đầu tải tệp tin: ${documentData.size}`);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;
    
    try {
      setIsSubmittingComment(true);
      const response = await documentApi.submitComment(documentData.id, newComment);
      
      if (response.status === 201) {
        setComments([response.data, ...comments]);
        setNewComment(""); 
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi bình luận!");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleRate = async (star) => {
    if (isSubmittingRating) return; 
    
    try {
      setIsSubmittingRating(true);
      setUserRating(star); 
      
      const response = await documentApi.submitRating(documentData.id, star);
      
      if (response.status === 200) {
        setDocumentData(prev => ({
          ...prev,
          rating: response.data.newRating,
          reviewsCount: response.data.newReviewsCount
        }));
      }
    } catch (error) {
      alert("Lỗi đánh giá!");
      setUserRating(0); 
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // ================= LOADING RENDER =================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-slate-500 font-medium text-sm">Đang tải dữ liệu tài liệu...</p>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Không tìm thấy tài liệu này!</p>
      </div>
    );
  }

  // ================= MAIN UI RENDER =================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER STICKY */}
      <NavbarPage/>

      {/* BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-400 overflow-x-auto whitespace-nowrap">
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/home')}>Trang chủ</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">{documentData.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">Tài liệu {documentData.school}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 truncate">{documentData.subject}</span>
        </div>
      </div>

      {/* BỐ CỤC CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-extrabold uppercase px-2.5 py-1 rounded-md border border-indigo-100">
                  {documentData.type}
                </span>
                <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5" /> {documentData.schoolFull} ({documentData.school})
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {documentData.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <img src={documentData.authorAvatar} alt={documentData.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-slate-800 font-bold">bởi {documentData.author}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Đăng ngày {documentData.uploadDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-slate-400" /> <strong className="text-slate-700">{documentData.views}</strong> xem</span>
                  <span className="flex items-center gap-1"><Download className="w-4 h-4 text-slate-400" /> <strong className="text-slate-700">{documentData.downloads}</strong> tải</span>
                  <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-500" /> <strong className="text-slate-700">{documentData.rating}</strong> <span className="text-slate-500">({documentData.reviewsCount} đánh giá)</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Trình xem trước tài liệu ({documentData.pagesCount} trang)</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30">Đọc thử miễn phí 2 trang</span>
              </div>
              <div className="p-4 md:p-6 bg-slate-100 space-y-4 max-h-[620px] overflow-y-auto relative">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
                  <div className="text-center font-bold text-slate-900 uppercase border-b pb-2 mb-4">{documentData.schoolFull}</div>
                  <p className="font-bold text-slate-900 mb-2">Câu 1 (2.5 điểm):</p>
                  <p>Tính giới hạn của hàm số sau khi x tiến về 0: L = lim (cos(x) - e^(-x^2/2)) / x^4</p>
                  <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">[Trang 1 / {documentData.pagesCount}]</div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
                  <p className="font-bold text-slate-900 mb-2">Lời giải chi tiết câu 1:</p>
                  <p>Khai triển Maclaurin đến bậc 4: cos(x) = 1 - x^2/2 + x^4/24 + o(x^4)</p>
                  <p>Kết quả giới hạn thu được L = -1/12.</p>
                  <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">[Trang 2 / {documentData.pagesCount}]</div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs blur-[4px] pointer-events-none select-none font-mono">
                  <p className="font-bold">Câu 2 (3.0 điểm): Cực trị tự do hàm hai biến</p>
                  <p>Tìm cực trị của hàm số z = x^3 + y^3 - 3xy...</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 top-[480px] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
                  <div className="max-w-md space-y-3 pb-2">
                    <Lock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                    <h3 className="text-sm md:text-base font-extrabold tracking-tight">Mở khóa để đọc toàn bộ {documentData.pagesCount} trang</h3>
                    <p className="text-[11px] text-slate-400 px-4 leading-normal">Vui lòng sử dụng lượt tải tích lũy hoặc đăng ký hội viên để tải xuống bản đầy đủ chất lượng cao.</p>
                    <button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto">
                      <Download className="w-4 h-4" /> Tải Xuống Ngay (-{documentData.creditsCost} Lượt)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase flex items-center gap-1.5 text-indigo-600">
                <PenTool className="w-4 h-4" /> Mô tả nội dung tài liệu
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {documentData.description}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase flex items-center gap-1.5 text-indigo-600">
                  <Star className="w-4 h-4 fill-indigo-600 text-indigo-600" /> Đánh giá của bạn về tài liệu này
                </h3>
                {userRating > 0 && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                    Bạn đã đánh giá {userRating}/5 sao
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
                      <Star className={`w-7 h-7 ${(hoverRating || userRating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-50"}`} />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  Đánh giá của bạn giúp cộng đồng sinh viên dễ dàng lọc và tìm kiếm được các nguồn tài liệu học tập uy tín nhất.
                </p>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Chi phí tải</div>
                  <div className="text-base font-extrabold tracking-tight text-emerald-400">-{documentData.creditsCost} Lượt</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Dung lượng</div>
                  <div className="font-bold text-slate-200">{documentData.size}</div>
                </div>
              </div>
              <button onClick={handleDownload} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold tracking-tight py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-xs md:text-sm flex justify-center items-center gap-2">
                <Download className="w-4 h-4" /> Tải Xuống Bản Đầy Đủ (.PDF)
              </button>
              <p className="text-[10px] text-slate-500 text-center leading-normal">
                *Tài liệu sau khi dùng lượt tải về thành công sẽ nằm trong Tab Lịch sử để tải lại hoàn toàn miễn phí mãi mãi.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5 font-medium">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mã môn học:</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{documentData.subjectCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Định dạng file:</span>
                <span className="text-slate-800 font-bold">Adobe PDF (.pdf)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Chuyên mục:</span>
                <span className="text-slate-800 font-bold">{documentData.subject}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase text-indigo-600 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Thảo luận sinh viên ({comments.length})
              </h3>
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  rows="2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmittingComment}
                  placeholder="Hỏi đáp về tài liệu, đề thi..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50 resize-none font-medium placeholder-slate-400 disabled:bg-slate-100"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isSubmittingComment || !newComment.trim()}
                  className={`font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all ${
                    isSubmittingComment || !newComment.trim() 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-900 hover:bg-slate-950 active:scale-95 text-white'
                  }`}
                >
                  {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </form>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-1 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <img src={comment.avatar} alt={comment.user} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-bold text-slate-800">@{comment.user}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{comment.date}</span>
                    </div>
                    <p className="text-slate-600 pl-6 font-normal leading-normal">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* TÀI LIỆU LIÊN QUAN */}
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-5">
          <div className="flex justify-between items-end">
            <h2 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span> Tài liệu cùng chuyên mục liên quan tốt nhất
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RELATED_DOCUMENTS.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => navigate(`/document/${doc.id}`)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="h-32 w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {doc.type}
                  </span>
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-50 pt-2">
                    <div className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500" /> {doc.downloads} tải</div>
                    <div className="text-indigo-600 font-bold">{doc.credits} Lượt</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="p-1.5 bg-indigo-600 rounded-lg text-white text-xs w-7 h-7 flex items-center justify-center font-bold">S</span>
              <span className="text-lg font-extrabold tracking-tight">StudocShare</span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium text-slate-400">
              Sứ mệnh của chúng tôi là xã hội hóa và tự do hóa tài liệu học tập, giúp sinh viên mọi miền tổ quốc tiếp cận tri thức chất lượng cao một cách bình đẳng và dễ dàng nhất.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Tài liệu nổi bật</h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-500" /> Slide bài giảng mẫu</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-500" /> Đề cương ôn thi học phần</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-500" /> Đề thi mẫu cuối kỳ</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ mở</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Bảo mật thông tin tài khoản</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Trung tâm trợ giúp</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Thông tin Liên Hệ</h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Địa chỉ: <span className="text-slate-300">Đại học Bách Khoa Hà Nội</span></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email: <span className="text-slate-300">support@studocshare.vn</span></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 pb-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-4 px-4">
          <div>
            © {new Date().getFullYear()} StudocShare Inc. Bản quyền thuộc về đội ngũ phát triển dự án.
          </div>
          <div className="flex gap-5">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Github</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Cộng đồng</span>
          </div>
        </div>
      </footer>

    </div>
  );
}