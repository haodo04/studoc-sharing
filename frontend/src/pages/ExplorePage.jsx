import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton } from "@clerk/clerk-react";

// DỮ LIỆU MẪU MỞ RỘNG MỚI (PHONG PHÚ & SINH ĐỘNG)
const QUICK_STATS = [
  { label: "Tài liệu chia sẻ", count: "145,200+", icon: "📚" },
  { label: "Sinh viên hoạt động", count: "89,400+", icon: "👨‍🎓" },
  { label: "Lượt tải thành công", count: "612,000+", icon: "⚡" },
  { label: "Trao đổi sôi nổi", count: "14,500+", icon: "💬" }
];

const SLIDER_BANNERS = [
  {
    id: 1,
    title: "Chiến dịch: Chia sẻ tài liệu ôn thi học kỳ mới",
    desc: "Đăng tải tài liệu bất kỳ (Slide, Đề cương, Đề thi cuối kỳ...) để nhận ngay X2 Credit và cơ hội lọt Top Bàng Vàng Vinh Danh nhận quà công nghệ từ ban quản trị.",
    bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    btnText: "Tham gia đăng tải ngay",
    link: "/upload"
  },
  {
    id: 2,
    title: "Tuần lễ vàng sinh viên: Trọn gói Premium ưu đãi 35%",
    desc: "Tải không giới hạn kho tài liệu bách khoa, slide hướng dẫn đồ án, code mẫu giải đề nâng cao chỉ từ 1k/ngày. Đăng ký liền tay, nhận ngay đặc quyền VIP.",
    bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    btnText: "Nâng cấp tài khoản VIP",
    link: "/subscriptions"
  },
  {
    id: 3,
    title: "Trải nghiệm tính năng Quét camera giải đề thi thông minh",
    desc: "Tính năng Beta mới cho phép sử dụng điện thoại quét nhanh hình ảnh đề toán cao cấp, triết học để tìm kiếm lời giải và tài liệu tham khảo bám sát trong 3 giây.",
    bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80",
    btnText: "Khám phá tính năng mới",
    link: "/home"
  }
];

const UNIVERSITIES = [
  { name: "ĐH Bách Khoa Hà Nội", short: "HUST", logo: "🏛️", count: "42,150 tài liệu" },
  { name: "ĐH Kinh tế Quốc dân", short: "NEU", logo: "📊", count: "31,800 tài liệu" },
  { name: "ĐH Công nghệ - VNU", short: "UET", logo: "💻", count: "19,500 tài liệu" },
  { name: "ĐH Ngoại Thương", short: "FTU", logo: "🌐", count: "22,400 tài liệu" },
  { name: "Học viện Ngân hàng", short: "BA", logo: "💰", count: "15,200 tài liệu" },
  { name: "ĐH Kinh tế TP.HCM", short: "UEH", logo: "📈", count: "12,900 tài liệu" }
];

const CATEGORIES = [
  { id: "it", name: "Công Nghệ Thông Tin", icon: "💻", desc: "Cấu trúc dữ liệu, Thuật toán, Lập trình Web/App, AI, Code mẫu..." },
  { id: "eco", name: "Kinh Tế - Kế Toán", icon: "📊", desc: "Kinh tế vĩ mô, Vi mô, Tài chính doanh nghiệp, Marketing..." },
  { id: "law", name: "Pháp Luật Đại Cương", icon: "⚖️", desc: "Luật dân sự, Luật hình sự, Hiến pháp, Luật thương mại..." },
  { id: "med", name: "Y Dược - Điều Dưỡng", icon: "🩺", desc: "Giải phẫu học, Dược lý lâm sàng, Hóa sinh, Bệnh học..." },
  { id: "lang", name: "Ngoại Ngữ & Ngôn Ngữ", icon: "🗣️", desc: "Tài liệu ôn thi IELTS, TOEIC, Tiếng Anh chuyên ngành, Tiếng Trung..." },
  { id: "math", name: "Toán & Khoa Học Cơ Bản", icon: "📐", desc: "Giải tích 1-2-3, Đại số tuyến tính, Vật lý đại cương, Triết học..." },
  { id: "poly", name: "Chính Trị & Tư Tưởng", icon: "📕", desc: "Triết học Mác-Lênin, Tư tưởng Hồ Chí Minh, Lịch sử Đảng..." },
  { id: "art", name: "Kiến Trúc & Đồ Họa", icon: "🎨", desc: "Thiết kế đồ họa, Bản vẽ kỹ thuật, Autocad, Photoshop cơ bản..." },
  { id: "eng", name: "Khối Kỹ Thuật & Điện Tử", icon: "⚙️", desc: "Điện tử số, Cơ điện tử, Bản vẽ mạch, Vi điều khiển, IoT..." }
];

const TRENDING_DOCS = [
  { id: "doc-1", title: "Bộ đề thi cuối kỳ môn Giải tích 1 - Viện Toán ứng dụng HUST (Có đáp án giải chi tiết từng bước)", school: "HUST", subject: "Giải tích 1", downloads: 2420, rating: 4.9, reviews: 48, credits: 1, type: "Đề thi", size: "3.4 MB", author: "Nguyễn Văn Hùng", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-2", title: "Slide bài giảng trọn bộ Hệ quản trị Cơ sở dữ liệu - PGS.TS Trần Đức giảng dạy", school: "UET", subject: "Cơ sở dữ liệu", downloads: 1890, rating: 5.0, reviews: 32, credits: 2, type: "Bài giảng", size: "12.8 MB", author: "Trần Minh Thư", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-3", title: "Báo cáo Thực tập tốt nghiệp xuất sắc ngành Phân tích dữ liệu tại FPT Software", school: "NEU", subject: "Thực tập", downloads: 1350, rating: 4.8, reviews: 19, credits: 1, type: "Báo cáo", size: "5.1 MB", author: "Lê Hoàng Nam", thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-4", title: "Đề cương ôn tập chi tiết môn Kinh tế vĩ mô - Học kỳ 2024.1 (Bám sát ngân hàng câu hỏi mới)", school: "FTU", subject: "Kinh tế vĩ mô", downloads: 1120, rating: 4.7, reviews: 26, credits: 1, type: "Đề cương", size: "2.2 MB", author: "Vũ Phương Thảo", thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60" }
];

const HIGH_RATED_DOCS = [
  { id: "doc-5", title: "Sổ tay tóm tắt trọn bộ công thức Vật lý đại cương 1 - Độc quyền bản PDF siêu ngắn gọn", school: "HUST", subject: "Vật lý đại cương 1", downloads: 3560, rating: 5.0, reviews: 84, credits: 1, type: "Tài liệu tóm tắt", size: "1.1 MB", author: "Phạm Minh Đức", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-6", title: "Giáo trình Kinh tế quốc tế và Thương mại điện tử (Bản scan đẹp kèm câu hỏi trắc nghiệm)", school: "FTU", subject: "Kinh tế quốc tế", downloads: 1420, rating: 4.9, reviews: 41, credits: 3, type: "Giáo trình", size: "45.6 MB", author: "Thư viện FTU", thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-7", title: "Bài tập lớn Đồ án lập trình mạng với Java và Socket - Đạt điểm A+ hội đồng chấm thi", school: "UET", subject: "Lập trình mạng", downloads: 975, rating: 5.0, reviews: 15, credits: 2, type: "Bài tập lớn", size: "8.4 MB", author: "Hoàng Đình Tú", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-8", title: "Tổng hợp Đề thi và Đáp án Pháp luật đại cương các kỳ thi gần nhất từ 2021 đến 2024", school: "BA", subject: "Pháp luật đại cương", downloads: 2150, rating: 4.9, reviews: 56, credits: 1, type: "Đề thi", size: "4.0 MB", author: "Đỗ Thùy Linh", thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60" }
];

const DISCUSSION_THREADS = [
  { id: "t-1", title: "Cần xin file code mẫu Socket Java Chat Room cho bài tập lớn tuần 14", category: "Công Nghệ Thông Tin", user: "TuAn_Hust", replies: 14, views: 245, badge: "Cần trợ giúp" },
  { id: "t-2", title: "Ai có mẹo nhớ nhanh các định lý trong Triết học Mác-Lênin không, sắp thi rồi cứu em!", category: "Chính Trị", user: "LyLy_Neu", replies: 28, views: 412, badge: "Thảo luận hot" },
  { id: "t-3", title: "Lập nhóm tự học ôn thi IELTS mục tiêu 7.5 từ gốc, học qua Google Meet mỗi tối", category: "Ngoại Ngữ", user: "HoangNam_Ftu", replies: 9, views: 188, badge: "Tìm đồng đội" },
  { id: "t-4", title: "Giải đáp thắc mắc câu hỏi phân loại tích phân suy rộng đề thi K67 Giải tích 1", category: "Toán Cơ Bản", user: "ThayGiaoToan", replies: 35, views: 670, badge: "Lời giải hay" }
];

// 2 DANH MỤC MỚI BỔ SUNG THÊM Ở PHÍA DƯỚI BANNER QUẢNG CÁO THEO YÊU CẦU
const MOST_VIEWED_DOCS = [
  { id: "doc-9", title: "Báo cáo tiểu luận môn Tư tưởng Hồ Chí Minh - Đề tài Công nghiệp hóa hiện đại hóa nông thôn", school: "NEU", subject: "Tư tưởng HCM", views: 12450, credits: 1, type: "Tiểu luận", size: "1.8 MB", author: "Phạm Thu Trang", thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-10", title: "Tổng hợp bộ câu hỏi trắc nghiệm ôn tập Triết học Mác Lênin chuẩn xác (Chương 1, 2, 3)", school: "BA", subject: "Triết học", views: 9840, credits: 1, type: "Trắc nghiệm", size: "2.5 MB", author: "Lê Minh Tuấn", thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=60" }
];

const FLASH_EXAM_PREP = [
  { id: "doc-11", title: "Đề cương ôn thi cấp tốc Đại số tuyến tính trong 24h - Bí kíp qua môn chống trượt tẹt ga", school: "HUST", subject: "Đại số tuyến tính", downloads: 4120, credits: 1, type: "Cấp tốc", size: "950 KB", author: "Anh K65 Bách Khoa", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-12", title: "Tóm tắt cốt lõi kiến thức môn Kinh tế vi mô - Ôn tập nhanh trước giờ G (Đầy đủ sơ đồ đồ thị)", school: "FTU", subject: "Kinh tế vi mô", downloads: 3180, credits: 2, type: "Cấp tốc", size: "1.4 MB", author: "CLB Hỗ trợ học tập", thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60" }
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSeeMore = (categoryName) => {
    alert(`Hệ thống đang điều hướng sang trang Danh Mục (/category) lọc nâng cao cho chuyên mục: ${categoryName}`);
  };

  const handleViewDetail = (id) => {
    navigate(`/document/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HEADER STICKY TÍCH HỢP Ô TÌM KIẾM TẬP TRUNG ================= */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Cụm trái: Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/home')}>
            <span className="text-2xl">📚</span>
            <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 hidden sm:inline">
              Studoc-Share
            </span>
          </div>

          {/* Cụm trung tâm: Ô TÌM KIẾM TRÊN HEADER */}
          <div className="flex-1 max-w-xl relative">
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

          {/* Cụm phải: Gói Premium, Menu điều hướng, Auth User */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <nav className="hidden lg:flex items-center gap-5 text-xs md:text-sm font-semibold text-slate-300">
              <span onClick={() => navigate('/home')} className="text-white cursor-pointer hover:text-white transition-colors">Khám phá</span>
              <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white transition-colors">Dashboard</span>
              <span onClick={() => navigate('/upload')} className="cursor-pointer hover:text-white transition-colors">Tải Lên</span>
            </nav>

            {/* Gói hội viên Premium kế bên Profile */}
            <button 
              onClick={() => navigate('/subscriptions')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[10px] md:text-xs px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1 shrink-0"
            >
              👑 <span className="hidden xs:inline">Gói</span> Premium
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

      {/* ================= HỆ THỐNG SLIDER BANNER FULL-WIDTH & HEIGHT TO LÊN ================= */}
      <div className="bg-slate-950 text-white relative h-72 md:h-[380px] overflow-hidden border-b border-slate-800 group">
        {SLIDER_BANNERS.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col justify-end p-8 md:p-16 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Ảnh nền phủ rộng lớn */}
            <div className="absolute inset-0">
              <img src={slide.bgImage} alt={slide.title} className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-[8000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden md:block"></div>
            </div>
            
            {/* Khối chữ giới thiệu chiến dịch */}
            <div className="relative z-10 space-y-3 md:space-y-4 max-w-2xl text-left">
              <span className="inline-block bg-indigo-500/20 text-indigo-300 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30">
                Sự kiện tiêu điểm số {slide.id}
              </span>
              <h2 className="text-xl md:text-4xl font-black text-white tracking-tight leading-tight">{slide.title}</h2>
              <p className="text-xs md:text-base text-slate-300 font-normal leading-relaxed font-light line-clamp-2 md:line-clamp-none">{slide.desc}</p>
              <div className="pt-2">
                <button 
                  onClick={() => navigate(slide.link)} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  {slide.btnText} &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Thanh điều hướng chấm tròn góc dưới phải */}
        <div className="absolute bottom-6 right-8 z-20 flex gap-2">
          {SLIDER_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-indigo-500 w-6" : "bg-slate-700 hover:bg-slate-500"}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Chỉ số đếm thống kê nhỏ gọn bên dưới Slider */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-lg border border-slate-200/60">
          {QUICK_STATS.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 border-r last:border-0 border-slate-100 justify-center">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-base md:text-lg font-black text-slate-900">{stat.count}</div>
                <div className="text-[11px] md:text-xs text-slate-400 font-semibold">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= KHÔNG GIAN NỘI DUNG CHÍNH CUỘN DỌC ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-12">
        
        {/* MỤC 1: TÀI LIỆU THEO TRƯỜNG HỌC */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span> Tài liệu phân loại theo Trường học
            </h2>
            <button onClick={() => handleSeeMore("Các Trường Học")} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider transition-colors">
              Xem tất cả trường &rarr;
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {UNIVERSITIES.map((uni, idx) => (
              <div 
                key={idx}
                onClick={() => handleSeeMore(uni.name)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all text-center group"
              >
                <div className="text-xl mb-1.5 w-9 h-9 mx-auto bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">{uni.logo}</div>
                <div className="font-extrabold text-slate-900 text-xs md:text-sm">{uni.short}</div>
                <div className="text-[11px] font-bold text-indigo-600 mt-1 bg-indigo-50/50 py-0.5 rounded-md">{uni.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MỤC 2: BANNER QUẢNG CÁO XEN KẼ CHUYÊN NGHIỆP ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 flex flex-col justify-between shadow relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-7xl">📝</div>
            <div className="space-y-2">
              <span className="bg-white/20 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">Tin tức Học đường</span>
              <h3 className="text-base md:text-lg font-black leading-tight">Đăng ký tham gia Kỳ Thi Thử Online Đại Học Học Kỳ mới</h3>
              <p className="text-xs text-blue-100 font-light leading-snug">Cọ xát kiến thức môn Giải tích, Vật lý đại cương với ngân hàng đề thi chuẩn của các thầy cô, nhận quà Credit lớn.</p>
            </div>
            <button onClick={() => alert("Chuyển sang trang Đăng ký thi thử")} className="mt-4 bg-white text-indigo-700 font-bold text-xs px-4 py-2 rounded-lg shadow self-start hover:bg-slate-100 transition-all">
              Đăng ký miễn phí
            </button>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-purple-950 text-white rounded-xl p-6 flex flex-col justify-between shadow relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-7xl">💰</div>
            <div className="space-y-2">
              <span className="bg-purple-500/30 text-purple-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded border border-purple-500/20">Cơ chế Đại sứ tri thức</span>
              <h3 className="text-base md:text-lg font-black leading-tight">Trở thành Người Đóng Góp - Rút tiền mặt từ kho tài liệu</h3>
              <p className="text-xs text-purple-200 font-light leading-snug">Khi tài liệu chất lượng của bạn đạt mốc trên 500+ lượt tải về từ cộng đồng, bạn có thể quy đổi Credit tích lũy thành ví điện tử Momo hoặc ATM.</p>
            </div>
            <button onClick={() => navigate('/upload')} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow self-start transition-all">
              Bắt đầu upload tài liệu
            </button>
          </div>
        </div>

        {/* ================= MỤC LƯỢT XEM KHỦNG KỲ QUA (DANH MỤC MỚI BỔ SUNG DƯỚI BANNER) ================= */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-cyan-500 rounded-full"></span> Tài liệu đạt Lượt xem lớn nhất tuần
            </h2>
            <button onClick={() => handleSeeMore("Xem nhiều nhất")} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider shrink-0">
              Xem thêm &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOST_VIEWED_DOCS.map((doc) => (
              <div key={doc.id} onClick={() => handleViewDetail(doc.id)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex gap-4 items-center group">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{doc.type} • {doc.school}</span>
                    <span className="text-cyan-600">👁️ {doc.views.toLocaleString()} xem</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs md:text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MỤC 3: TRA CỨU THEO KHỐI NGÀNH CHUYÊN MÔN (ĐẦY ĐỦ 9 MỤC) */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span> Tra cứu theo Khối ngành chuyên môn
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => handleSeeMore(cat.name)}
                className="p-4 rounded-xl border border-slate-200 cursor-pointer bg-white hover:border-indigo-400 hover:shadow-md transition-all flex items-start gap-3 group"
              >
                <span className="text-2xl bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors shrink-0">{cat.icon}</span>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-950 text-xs md:text-sm group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-tight font-medium line-clamp-1">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MỤC 4: XU HƯỚNG TẢI VỀ NHIỀU NHẤT */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span> Xu hướng tải về nhiều nhất tuần qua
            </h2>
            <button onClick={() => handleSeeMore("Xu hướng")} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider shrink-0">
              Xem tất cả &rarr;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {TRENDING_DOCS.map((doc) => (
              <div key={doc.id} onClick={() => handleViewDetail(doc.id)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group">
                <div className="h-40 w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {doc.size}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {doc.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{doc.school}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {doc.title}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium">
                    <div>🔥 {doc.downloads} tải</div>
                    <div className="text-right text-amber-500">⭐ {doc.rating}</div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="truncate max-w-[110px]">Bởi: {doc.author}</span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-[11px]">{doc.credits} Credit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ĐỀ CƯƠNG ÔN THI CẤP TỐC CHỐNG TRƯỢT (DANH MỤC THỨ 2 BỔ SUNG THÊM) ================= */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-red-500 rounded-full"></span> ⚡ Đề cương Cấp tốc - Cứu nguy mùa thi cử
            </h2>
            <button onClick={() => handleSeeMore("Ôn cấp tốc")} className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider shrink-0">
              Vào tủ sách cấp tốc &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FLASH_EXAM_PREP.map((doc) => (
              <div key={doc.id} onClick={() => handleViewDetail(doc.id)} className="bg-gradient-to-r from-red-50/50 to-amber-50/30 p-5 rounded-2xl border border-red-100/70 hover:border-red-300 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-red-600 uppercase tracking-wider">
                    <span>🔥 {doc.type} • TRƯỜNG {doc.school}</span>
                    <span>📥 {doc.downloads} lượt tải</span>
                  </div>
                  <h4 className="font-black text-slate-950 text-sm md:text-base leading-snug group-hover:text-red-600 transition-colors">
                    {doc.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-red-100/50 pt-2.5 font-medium">
                  <span>Tác giả: {doc.author}</span>
                  <span className="text-red-600 bg-red-100/50 px-2.5 py-0.5 rounded-full font-bold text-[11px]">{doc.credits} Credit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MỤC 5: DIỄN ĐÀN THẢO LUẬN TRAO ĐỔI SÔI NỔI */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-5.5 bg-pink-500 rounded-full"></span> Góc Trao Đổi Học Tập & Thảo Luận Sinh Viên
              </h2>
            </div>
            <button onClick={() => alert("Chuyển sang Diễn Đàn")} className="text-pink-600 hover:text-pink-800 text-xs font-bold uppercase tracking-wider shrink-0">
              Vào diễn đàn &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISCUSSION_THREADS.map((thread) => (
              <div key={thread.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      thread.badge === "Cần trợ giúp" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                      thread.badge === "Thảo luận hot" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {thread.badge}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">Khối ngành: {thread.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base leading-snug hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                    {thread.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 font-medium">
                  <span>Đăng bởi: <strong className="text-slate-600">@{thread.user}</strong></span>
                  <div className="flex items-center gap-3">
                    <span>💬 {thread.replies} trả lời</span>
                    <span>👁️ {thread.views} xem</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MỤC 6: TÀI LIỆU ĐÁNH GIÁ 5 SAO CHẤT LƯỢNG CAO */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-emerald-600 rounded-full"></span> Tài liệu 5★ Đóng góp Chất lượng cao
            </h2>
            <button onClick={() => handleSeeMore("Đánh giá cao")} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wider shrink-0">
              Xem tất cả &rarr;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {HIGH_RATED_DOCS.map((doc) => (
              <div key={doc.id} onClick={() => handleViewDetail(doc.id)} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group">
                <div className="h-44 w-full overflow-hidden relative bg-slate-100 border-b border-slate-100">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {doc.size}
                  </span>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {doc.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{doc.school}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {doc.title}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 border-t border-slate-100 pt-2 text-xs text-slate-500 font-medium">
                    <div>📥 {doc.downloads} tải</div>
                    <div className="text-right text-emerald-600 font-bold">⭐ {doc.rating}</div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="truncate max-w-[110px]">Bởi: {doc.author}</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">{doc.credits} Credit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= FOOTER ĐỒNG BỘ LANDING CHÍNH ================= */}
      <footer className="bg-slate-900 text-slate-400 text-xs md:text-sm pt-16 pb-8 px-6 mt-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Studoc-Share</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Nền tảng chia sẻ và lưu trữ tài liệu học tập tối ưu, kết nối hàng ngàn tài liệu hữu ích từ sinh viên trên khắp các trường Đại học lớn tại Việt Nam.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Khám phá</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><span onClick={() => handleSeeMore("Tài liệu hot")} className="hover:text-white cursor-pointer transition-colors">Tài liệu thịnh hành</span></li>
              <li><span onClick={() => handleSeeMore("Đề thi")} className="hover:text-white cursor-pointer transition-colors">Đề thi mẫu cuối kỳ</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Chính sách & Hỗ trợ</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><span className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ mở</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Bảo mật thông tin tài khoản</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Thông tin Liên Hệ</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li>📍 Địa chỉ: <span className="text-slate-400">Đại học Bách Khoa Hà Nội</span></li>
              <li>📧 Email: <span className="text-slate-400">support@studocshare.vn</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-4">
          <div>
            &copy; {new Date().getFullYear()} Studoc-Share. Toàn bộ quyền nội dung được bảo lưu bởi nhóm phát triển đồ án.
          </div>
        </div>
      </footer>

    </div>
  );
}