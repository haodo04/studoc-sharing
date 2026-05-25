import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

// DỮ LIỆU MẪU CHI TIẾT TÀI LIỆU
const MOCK_DOCUMENT = {
  id: "doc-1",
  title: "Bộ đề thi cuối kỳ môn Giải tích 1 - Viện Toán ứng dụng HUST (Có đáp án giải chi tiết từng bước)",
  school: "HUST",
  schoolFull: "Đại học Bách Khoa Hà Nội",
  subject: "Giải tích 1",
  subjectCode: "MI1110",
  category: "Toán & Khoa Học Cơ Bản",
  type: "Đề thi",
  author: "Nguyễn Văn Hùng",
  authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
  uploadDate: "12/05/2024",
  downloads: 2420,
  views: 5890,
  rating: 4.9,
  reviewsCount: 48,
  creditsCost: 1,
  size: "3.4 MB",
  pagesCount: 15,
  description: "Tài liệu tổng hợp ngân hàng câu hỏi đề thi cuối kỳ môn Giải tích 1 (Mã học phần MI1110) qua các kỳ thi gần đây của Viện Toán ứng dụng ĐH Bách Khoa Hà Nội. Toàn bộ các câu hỏi tự luận về tích phân suy rộng, cực trị hàm nhiều biến và phương trình vi phân đều có lời giải chi tiết từng bước, bám sát barem chấm điểm hệ đại học.",
  comments: [
    { id: 1, user: "minh_duc_k66", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60", content: "Đề trúng tủ câu tích phân suy rộng kỳ vừa rồi luôn mọi người ơi! Đánh giá 5 sao uy tín.", date: "2 ngày trước" },
    { id: 2, user: "thao_phuong_neu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60", content: "Tài liệu trình bày rất sạch sẽ, dễ hiểu kể cả cho đứa mất gốc như mình.", date: "5 ngày trước" }
  ]
};

// DỮ LIỆU TÀI LIỆU LIÊN QUAN PHÍA DƯỚI
const RELATED_DOCUMENTS = [
  { id: "doc-5", title: "Sổ tay tóm tắt trọn bộ công thức Vật lý đại cương 1 - Độc quyền bản PDF siêu ngắn gọn", school: "HUST", downloads: 3560, rating: 5.0, credits: 1, type: "Tóm tắt", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-9", title: "Đề cương ôn thi cấp tốc Đại số tuyến tính trong 24h - Bí kíp qua môn chống trượt", school: "HUST", downloads: 4120, rating: 4.8, credits: 1, type: "Cấp tốc", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-13", title: "Ngân hàng đề thi trắc nghiệm Tin học đại cương HUST có đáp án khoanh sẵn", school: "HUST", downloads: 1980, rating: 4.7, credits: 2, type: "Trắc nghiệm", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-14", title: "Giáo trình Giải tích 1 - Tác giả Nguyễn Đình Trí (Bản đẹp mục lục rõ ràng)", school: "HUST", downloads: 2890, rating: 4.9, credits: 3, type: "Giáo trình", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" }
];

export default function DocumentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comments, setComments] = useState(MOCK_DOCUMENT.comments);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleDownload = () => {
    alert(`Hệ thống đang trừ ${MOCK_DOCUMENT.creditsCost} Credit để bắt đầu tải tệp tin: ${MOCK_DOCUMENT.size}`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      user: "SinhVien_BaoCao",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
      content: newComment,
      date: "Vừa xong"
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HEADER STICKY (ĐỒNG BỘ NGUYÊN BẢN TRANG HOME) ================= */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
            <span className="text-2xl">📚</span>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Studoc-Share
            </span>
          </div>

          {/* Ô tìm kiếm tập trung */}
          <div className="flex-1 max-w-xl relative hidden sm:block">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition-all shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Tìm đề thi Giải tích, mã môn, trường học..." 
                className="bg-transparent text-xs md:text-sm text-white w-full focus:outline-none placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Cụm phải Actions */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <nav className="hidden lg:flex items-center gap-5 text-xs md:text-sm font-semibold text-slate-300">
              <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-white transition-colors">Khám phá</span>
              <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white transition-colors">Dashboard</span>
              <span onClick={() => navigate('/upload')} className="cursor-pointer hover:text-white transition-colors">Tải Lên</span>
            </nav>

            <button 
              onClick={() => navigate('/subscriptions')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1 shrink-0"
            >
              👑 Premium
            </button>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all">
                  Đăng nhập
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* ================= ĐƯỜNG CHỈ DẪN ĐANG Ở MỤC NÀO (BREADCRUMBS) ================= */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-400 overflow-x-auto whitespace-nowrap">
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/home')}>Trang chủ</span>
          <span>&rsaquo;</span>
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">{MOCK_DOCUMENT.category}</span>
          <span>&rsaquo;</span>
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">Tài liệu {MOCK_DOCUMENT.school}</span>
          <span>&rsaquo;</span>
          <span className="text-slate-900 truncate">{MOCK_DOCUMENT.subject}</span>
        </div>
      </div>

      {/* ================= BỐ CỤC CHÍNH 2 CỘT NỘI DUNG ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI (2/3 WIDTH): INFO, PREVIEW, DESCRIPTION & RATING */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Thông tin tệp tóm tắt */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-black uppercase px-2.5 py-1 rounded-md border border-indigo-100">
                  {MOCK_DOCUMENT.type}
                </span>
                <span className="bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md">
                  🏛️ {MOCK_DOCUMENT.schoolFull} ({MOCK_DOCUMENT.school})
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-slate-950 tracking-tight leading-snug">{MOCK_DOCUMENT.title}</h1>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <img src={MOCK_DOCUMENT.authorAvatar} alt={MOCK_DOCUMENT.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-slate-800 font-bold">bởi {MOCK_DOCUMENT.author}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Đăng ngày {MOCK_DOCUMENT.uploadDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 text-slate-400">
                  <span>👁️ <strong className="text-slate-600">{MOCK_DOCUMENT.views}</strong> xem</span>
                  <span>📥 <strong className="text-slate-600">{MOCK_DOCUMENT.downloads}</strong> tải</span>
                  <span className="text-amber-500">⭐ <strong>{MOCK_DOCUMENT.rating}</strong> ({MOCK_DOCUMENT.reviewsCount} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* TRÌNH ĐỌC TRỰC TUYẾN GIẢ LẬP KHÓA BLUR TRANG 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800">
                <span className="flex items-center gap-2">📄 Trình xem trước tài liệu ({MOCK_DOCUMENT.pagesCount} trang)</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30">Đọc thử miễn phí 2 trang</span>
              </div>
              <div className="p-4 md:p-6 bg-slate-100 space-y-4 max-h-[620px] overflow-y-auto relative">
                {/* Trang 1 */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
                  <div className="text-center font-bold text-slate-900 uppercase border-b pb-2 mb-4">{MOCK_DOCUMENT.schoolFull}</div>
                  <p className="font-bold text-slate-900 mb-2">Câu 1 (2.5 điểm):</p>
                  <p>Tính giới hạn của hàm số sau khi x tiến về 0: L = lim (cos(x) - e^(-x^2/2)) / x^4</p>
                  <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">[Trang 1 / {MOCK_DOCUMENT.pagesCount}]</div>
                </div>
                {/* Trang 2 */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
                  <p className="font-bold text-slate-900 mb-2">Lời giải chi tiết câu 1:</p>
                  <p>Khai triển Maclaurin đến bậc 4: cos(x) = 1 - x^2/2 + x^4/24 + o(x^4)</p>
                  <p>Kết quả giới hạn thu được L = -1/12.</p>
                  <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">[Trang 2 / {MOCK_DOCUMENT.pagesCount}]</div>
                </div>
                {/* Trang 3 bị Blur */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs blur-[4px] pointer-events-none select-none font-mono">
                  <p className="font-bold">Câu 2 (3.0 điểm): Cực trị tự do hàm hai biến</p>
                  <p>Tìm cực trị của hàm số z = x^3 + y^3 - 3xy...</p>
                </div>
                {/* Khung Chặn Mờ Đăng Ký/Tải Về */}
                <div className="absolute inset-x-0 bottom-0 top-[480px] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
                  <div className="max-w-md space-y-3 pb-2">
                    <span className="text-2xl">🔒</span>
                    <h3 className="text-sm md:text-base font-black">Mở khóa để đọc toàn bộ {MOCK_DOCUMENT.pagesCount} trang</h3>
                    <p className="text-[11px] text-slate-400 px-4 leading-normal">Vui lòng sử dụng credit tích lũy hoặc đăng ký hội viên để tải xuống bản đầy đủ chất lượng cao.</p>
                    <button onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all">
                      Tải Xuống Ngay ({MOCK_DOCUMENT.creditsCost} Credit)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Khối mô tả nội dung văn bản */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-black text-slate-950 text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
                📝 Mô tả nội dung tài liệu
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {MOCK_DOCUMENT.description}
              </p>
            </div>

            {/* ================= KHỐI ĐÁNH GIÁ SỐ SAO (RATING STARS MỚI BỔ SUNG) ================= */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-black text-slate-950 text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
                  ⭐ Đánh giá của bạn về tài liệu này
                </h3>
                {userRating > 0 && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                    Bạn đã đánh giá {userRating}/5 sao
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                {/* Các ngôi sao tương tác tương tác động */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setUserRating(star);
                        alert(`Cảm ơn bạn đã đánh giá tài liệu ${star} sao!`);
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl transition-all active:scale-125 focus:outline-none"
                    >
                      <span className={(hoverRating || userRating) >= star ? "text-amber-400" : "text-slate-200"}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-medium text-center sm:text-left">
                  Đánh giá của bạn giúp cộng đồng sinh viên dễ dàng lọc và tìm kiếm được các nguồn tài liệu học tập uy tín nhất.
                </p>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI (1/3 WIDTH): BOX DOWNLOAD & COMMENT */}
          <div className="space-y-6">
            {/* Box tải xuống nhanh */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Chi phí tải</div>
                  <div className="text-base font-black text-emerald-400">{MOCK_DOCUMENT.creditsCost} Credit</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Dung lượng</div>
                  <div className="font-bold text-slate-200">{MOCK_DOCUMENT.size}</div>
                </div>
              </div>
              <button onClick={handleDownload} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-xs md:text-sm">
                📥 Tải Xuống Bản Đầy Đủ (.PDF)
              </button>
              <p className="text-[10px] text-slate-500 text-center leading-normal">
                *Tài liệu sau khi dùng credit tải về thành công sẽ nằm trong Tab Lịch sử để tải lại hoàn toàn miễn phí mãi mãi.
              </p>
            </div>

            {/* Thông số metadata */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5 font-medium">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Mã môn học:</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{MOCK_DOCUMENT.subjectCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Định dạng file:</span>
                <span className="text-slate-800 font-bold">Adobe PDF (.pdf)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Chuyên mục:</span>
                <span className="text-slate-800 font-bold">{MOCK_DOCUMENT.subject}</span>
              </div>
            </div>

            {/* Box bình luận bình luận thảo luận */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-slate-950 text-xs md:text-sm uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-2">
                💬 Thảo luận sinh viên ({comments.length})
              </h3>
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  rows="2"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Hỏi đáp về tài liệu, đề thi..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-slate-50/50 resize-none font-medium placeholder-slate-400"
                ></textarea>
                <button type="submit" className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                  Gửi bình luận
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

        {/* ================= KHU VỰC TÀI LIỆU LIÊN QUAN (MỚI BỔ SUNG PHÍA DƯỚI) ================= */}
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-5">
          <div className="flex justify-between items-end">
            <h2 className="text-base md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span> Tài liệu cùng chuyên mục liên quan tốt nhất
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RELATED_DOCUMENTS.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => alert(`Điều hướng sang trang chi tiết của file ID: ${doc.id}`)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="h-32 w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {doc.type}
                  </span>
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-t border-slate-50 pt-2">
                    <div>🔥 {doc.downloads} tải</div>
                    <div className="text-indigo-600">{doc.credits} Credit</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= FOOTER (ĐỒNG BỘ NGUYÊN BẢN TRANG HOME) ================= */}
      <footer className="bg-slate-900 text-slate-400 text-xs md:text-sm pt-12 pb-6 px-6 mt-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Studoc-Share</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Nền tảng chia sẻ và lưu trữ tài liệu học tập tối ưu, kết nối tài liệu hữu ích từ sinh viên trên khắp các trường Đại học lớn tại Việt Nam.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Khám phá</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Tài liệu thịnh hành</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Đề thi mẫu cuối kỳ</span></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-1.5 text-xs font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ mở</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Bảo mật thông tin tài khoản</span></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Thông tin Liên Hệ</h4>
            <ul className="space-y-1 text-xs font-medium text-slate-500">
              <li>📍 Địa chỉ: <span className="text-slate-400">Đại học Bách Khoa Hà Nội</span></li>
              <li>📧 Email: <span className="text-slate-400">support@studocshare.vn</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-4 text-center md:text-left text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} Studoc-Share. Toàn bộ quyền nội dung được bảo lưu bởi nhóm phát triển đồ án.
        </div>
      </footer>

    </div>
  );
}