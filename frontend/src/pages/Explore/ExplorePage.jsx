import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import { 
  BookOpen, 
  Users, 
  Zap, 
  MessageSquare, 
  Search, 
  Flame, 
  GraduationCap, 
  Star, 
  Download,
  MapPin,
  Mail,
  Crown,
  Award,
  Feather,
  Coins,
  Laptop,
  TrendingUp,
  Scale,
  Stethoscope,
  Globe,
  Ruler,
  Book,
  Palette,
  Settings,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

// DỮ LIỆU MẪU MỞ RỘNG MỚI
const QUICK_STATS = [
  { label: "Tài liệu chia sẻ", count: "145,200+", icon: BookOpen },
  { label: "Sinh viên hoạt động", count: "89,400+", icon: Users },
  { label: "Lượt tải thành công", count: "612,000+", icon: Zap },
  { label: "Trao đổi sôi nổi", count: "14,500+", icon: MessageSquare }
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
  { name: "ĐH Bách Khoa Hà Nội", short: "HUST", logo: Crown, count: "42,150 tài liệu" },
  { name: "ĐH Kinh tế Quốc dân", short: "NEU", logo: Award, count: "31,800 tài liệu" },
  { name: "ĐH Công nghệ - VNU", short: "UET", logo: Feather, count: "19,500 tài liệu" },
  { name: "ĐH Ngoại Thương", short: "FTU", logo: Star, count: "22,400 tài liệu" },
  { name: "Học viện Ngân hàng", short: "BA", logo: Coins, count: "15,200 tài liệu" },
  { name: "ĐH Kinh tế TP.HCM", short: "UEH", logo: Flame, count: "12,900 tài liệu" }
];

const CATEGORIES = [
  { id: "it", name: "Công Nghệ Thông Tin", icon: Laptop, desc: "Cấu trúc dữ liệu, Thuật toán, Lập trình Web/App, AI, Code mẫu..." },
  { id: "eco", name: "Kinh Tế - Kế Toán", icon: TrendingUp, desc: "Kinh tế vĩ mô, Vi mô, Tài chính doanh nghiệp, Marketing..." },
  { id: "law", name: "Pháp Luật Đại Cương", icon: Scale, desc: "Luật dân sự, Luật hình sự, Hiến pháp, Luật thương mại..." },
  { id: "med", name: "Y Dược - Điều Dưỡng", icon: Stethoscope, desc: "Giải phẫu học, Dược lý lâm sàng, Hóa sinh, Bệnh học..." },
  { id: "lang", name: "Ngoại Ngữ & Ngôn Ngữ", icon: Globe, desc: "Tài liệu ôn thi IELTS, TOEIC, Tiếng Anh chuyên ngành, Tiếng Trung..." },
  { id: "math", name: "Toán & Khoa Học Cơ Bản", icon: Ruler, desc: "Giải tích 1-2-3, Đại số tuyến tính, Vật lý đại cương, Triết học..." },
  { id: "poly", name: "Chính Trị & Tư Tưởng", icon: Book, desc: "Triết học Mác-Lênin, Tư tưởng Hồ Chí Minh, Lịch sử Đảng..." },
  { id: "art", name: "Kiến Trúc & Đồ Họa", icon: Palette, desc: "Thiết kế đồ họa, Bản vẽ kỹ thuật, Autocad, Photoshop cơ bản..." },
  { id: "eng", name: "Khối Kỹ Thuật & Điện Tử", icon: Settings, desc: "Điện tử số, Cơ điện tử, Bản vẽ mạch, Vi điều khiển, IoT..." }
];

const TRENDING_DOCS = [
  { id: "doc-1", title: "Bộ đề thi cuối kỳ môn Giải tích 1 - Viện Toán ứng dụng HUST (Có đáp án giải chi tiết từng bước)", school: "HUST", subject: "Giải tích 1", downloads: 2420, rating: 4.9, reviews: 48, credits: 1, type: "Đề thi", size: "3.4 MB", author: "Nguyễn Văn Hùng", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-2", title: "Slide bài giảng trọn bộ Hệ quản trị Cơ sở dữ liệu - PGS.TS Trần Đức giảng dạy", school: "UET", subject: "Cơ sở dữ liệu", downloads: 1890, rating: 5.0, reviews: 32, credits: 2, type: "Bài giảng", size: "12.8 MB", author: "Trần Minh Thư", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-3", title: "Báo cáo Thực tập tốt nghiệp xuất sắc ngành Phân tích dữ liệu tại FPT Software", school: "NEU", subject: "Thực tập", downloads: 1350, rating: 4.8, reviews: 19, credits: 1, type: "Báo cáo", size: "5.1 MB", author: "Lê Hoàng Nam", thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-4", title: "Đề cương ôn tập chi tiết môn Kinh tế vĩ mô - Học kỳ 2024.1 (Bám sát ngân hàng câu hỏi mới)", school: "FTU", subject: "Kinh tế vĩ mô", downloads: 1120, rating: 4.7, reviews: 26, credits: 1, type: "Đề cương", size: "2.2 MB", author: "Vũ Phương Thảo", thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80" }
];

const HIGH_RATED_DOCS = [
  { id: "doc-5", title: "Sổ tay tóm tắt trọn bộ công thức Vật lý đại cương 1 - Độc quyền bản PDF siêu ngắn gọn", school: "HUST", subject: "Vật lý đại cương 1", downloads: 3560, rating: 5.0, reviews: 84, credits: 1, type: "Tài liệu tóm tắt", size: "1.1 MB", author: "Phạm Minh Đức", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-6", title: "Giáo trình Kinh tế quốc tế và Thương mại điện tử (Bản scan đẹp kèm câu hỏi trắc nghiệm)", school: "FTU", subject: "Kinh tế quốc tế", downloads: 1420, rating: 4.9, reviews: 41, credits: 3, type: "Giáo trình", size: "45.6 MB", author: "Thư viện FTU", thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-7", title: "Bài tập lớn Đồ án lập trình mạng với Java và Socket - Đạt điểm A+ hội đồng chấm thi", school: "UET", subject: "Lập trình mạng", downloads: 975, rating: 5.0, reviews: 15, credits: 2, type: "Bài tập lớn", size: "8.4 MB", author: "Hoàng Đình Tú", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60" },
  { id: "doc-8", title: "Tổng hợp Đề thi và Đáp án Pháp luật đại cương các kỳ thi gần nhất từ 2021 đến 2024", school: "BA", subject: "Pháp luật đại cương", downloads: 2150, rating: 4.9, reviews: 56, credits: 1, type: "Đề thi", size: "4.0 MB", author: "Đỗ Thùy Linh", thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60" }
];

const NEW_DOCS = [
  { id: "new-1", title: "Báo cáo thực tập chuyên ngành Kỹ thuật phần mềm 2024", school: "HUST", subject: "Đồ án", downloads: 12, rating: 5.0, reviews: 2, credits: 0, type: "Báo cáo", size: "2.1 MB", author: "Trần Bảo", thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60" },
  { id: "new-2", title: "Slide ôn thi cuối kỳ Mạng máy tính và Truyền thông", school: "UET", subject: "Mạng máy tính", downloads: 45, rating: 4.5, reviews: 8, credits: 1, type: "Slide", size: "5.5 MB", author: "Lê Cường", thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60" },
  { id: "new-3", title: "Bài tập lớn môn Trí tuệ nhân tạo (AI) kèm Source Code Python", school: "FPT", subject: "AI", downloads: 89, rating: 4.8, reviews: 12, credits: 2, type: "Bài tập", size: "15.0 MB", author: "Vũ Nam", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60" },
  { id: "new-4", title: "Tài liệu tự học TOEIC 750+ (Bản PDF màu + Audio)", school: "NEU", subject: "Tiếng Anh", downloads: 320, rating: 4.9, reviews: 45, credits: 0, type: "Giáo trình", size: "120 MB", author: "Minh Trang", thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&auto=format&fit=crop&q=60" }
];

const DISCUSSION_THREADS = [
  { id: "t-1", title: "Cần xin file code mẫu Socket Java Chat Room cho bài tập lớn tuần 14", category: "Công Nghệ Thông Tin", user: "TuAn_Hust", replies: 14, views: 245, badge: "Cần trợ giúp" },
  { id: "t-2", title: "Ai có mẹo nhớ nhanh các định lý trong Triết học Mác Lênin không ạ? Sắp thi rồi cứu em!", category: "Chính Trị & Tư Tưởng", user: "LinhNga_Neu", replies: 29, views: 412, badge: "Thảo luận hot" },
  { id: "t-3", title: "Giải đáp thắc mắc câu hỏi số 4 trang 52 sách bài tập Kinh tế vi mô thầy Long", category: "Kinh Tế - Kế Toán", user: "PhuongThao_Ftu", replies: 8, views: 118, badge: "Đã có lời giải" }
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % SLIDER_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (catName) => {
    navigate(`/home?category=${encodeURIComponent(catName)}`);
  };

  const handleUniversityClick = (uniShort) => {
    navigate(`/home?school=${encodeURIComponent(uniShort)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. HEADER NAVBAR (CẬP NHẬT LOGO VÀ THANH ĐIỀU HƯỚNG TABS) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Mới */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center gap-2 font-extrabold text-xl text-slate-900 tracking-tight">
              <span className="p-2 bg-indigo-600 rounded-lg text-white text-sm w-8 h-8 flex items-center justify-center">S</span>
              <span>StudocShare</span>
            </div>
          </div>

          {/* Navigation Tabs (Thay thế Search Bar) */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-slate-600">
            <span onClick={() => navigate('/')} className="text-indigo-600 cursor-pointer transition-colors border-b-2 border-indigo-600 py-5">Khám phá</span>
            <span onClick={() => navigate('/home')} className="hover:text-indigo-600 cursor-pointer transition-colors py-5 border-b-2 border-transparent hover:border-indigo-600">Tài liệu</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors py-5 border-b-2 border-transparent hover:border-indigo-600">Cộng đồng</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors py-5 border-b-2 border-transparent hover:border-indigo-600">Bảng xếp hạng</span>
            <span onClick={() => navigate('/subscriptions')} className="text-amber-600 hover:text-amber-700 cursor-pointer transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Premium
            </span>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <button 
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm"
              >
                Vào Dashboard
              </button>
              <UserButton afterSignOutUrl="/explore" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                  Đăng nhập
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors shadow-sm">
                  Đăng ký
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 2. HERO SEARCH & SLIDER BANNER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Search */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold rounded-md">
              <Flame className="w-3.5 h-3.5" /> Nền tảng chia sẻ tài liệu số 1 sinh viên
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Khám phá kho tri thức khổng lồ từ các trường đại học
            </h1>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Hơn 140,000+ Slide bài giảng, đề cương ôn tập, đề thi mẫu có đáp án chi tiết được đóng góp bởi cộng đồng sinh viên giỏi toàn quốc.
            </p>

            {/* Big Search Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-2 max-w-md">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Nhập tên môn học, mã học phần (ví dụ: MI1110)..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-3 pl-11 pr-24 text-[13px] font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-4" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium px-1">
                <span>Tìm kiếm nhiều:</span>
                <span onClick={() => { setSearchQuery('Giải tích 1'); navigate('/home?search=Giải tích 1') }} className="text-slate-700 hover:text-indigo-600 cursor-pointer underline decoration-slate-300">Giải tích 1</span>
                <span onClick={() => { setSearchQuery('Kinh tế vi mô'); navigate('/home?search=Kinh tế vi mô') }} className="text-slate-700 hover:text-indigo-600 cursor-pointer underline decoration-slate-300">Kinh tế vi mô</span>
              </div>
            </form>
          </div>

          {/* Right Slider Banner */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[21/9] lg:aspect-[16/8] bg-slate-900 shadow-xl border border-slate-200">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${SLIDER_BANNERS[currentBanner].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

            {/* Banner Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white space-y-2 max-w-xl">
              <h3 className="text-base sm:text-xl font-extrabold tracking-tight text-white">{SLIDER_BANNERS[currentBanner].title}</h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">{SLIDER_BANNERS[currentBanner].desc}</p>
              <div className="pt-2">
                <button
                  onClick={() => navigate(SLIDER_BANNERS[currentBanner].link)}
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  {SLIDER_BANNERS[currentBanner].btnText}
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
              {SLIDER_BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`h-1.5 rounded-full transition-all ${index === currentBanner ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3. QUICK STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_STATS.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <StatIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xl font-extrabold text-slate-900 tracking-tight">{stat.count}</span>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* 4. UNIVERSITIES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" /> Tài liệu theo trường đại học
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {UNIVERSITIES.map((uni, idx) => {
              const UniIcon = uni.logo;
              return (
                <div
                  key={idx}
                  onClick={() => handleUniversityClick(uni.short)}
                  className="bg-white border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-center mb-2 text-slate-500 group-hover:text-indigo-600 transition-colors"><UniIcon className="w-7 h-7" /></div>
                  <span className="block font-extrabold text-[13px] text-slate-900 tracking-tight">{uni.short}</span>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{uni.name}</p>
                  <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full mt-2 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                    {uni.count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. CATEGORIES */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Danh mục ngành học chính
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[13px] sm:text-sm text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">{cat.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. TRENDING DOCUMENTS */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" /> Xu hướng tải xuống tuần này
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRENDING_DOCS.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {doc.type}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {doc.credits} Credit
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{doc.school}</span>
                      <span className="truncate max-w-[120px]">{doc.subject}</span>
                    </div>
                    <h3 className="font-bold text-[13px] text-slate-900 line-clamp-2 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-slate-800">{doc.rating}</span>
                      <span>({doc.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MỤC MỚI BỔ SUNG: TÀI LIỆU MỚI TẢI LÊN */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-500" /> Mới tải lên gần đây
            </h2>
            <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700">Xem tất cả &rarr;</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {NEW_DOCS.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {doc.type}
                  </span>
                  <span className={`absolute bottom-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${doc.credits === 0 ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                    {doc.credits === 0 ? 'Miễn phí' : `${doc.credits} Credit`}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{doc.school}</span>
                      <span className="truncate max-w-[120px]">{doc.subject}</span>
                    </div>
                    <h3 className="font-bold text-[13px] text-slate-900 line-clamp-2 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-slate-800">{doc.rating}</span>
                      <span>({doc.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. HIGH RATED DOCUMENTS */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Tài liệu đánh giá 5★ tuyệt đối
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HIGH_RATED_DOCS.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    {doc.type}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {doc.credits} Credit
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{doc.school}</span>
                      <span className="truncate max-w-[120px]">{doc.subject}</span>
                    </div>
                    <h3 className="font-bold text-[13px] text-slate-900 line-clamp-2 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-slate-800">{doc.rating}</span>
                      <span>({doc.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MỤC MỚI BỔ SUNG: BANNER QUẢNG CÁO CALL TO ACTION */}
        <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-2xl space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Mở khóa toàn bộ đặc quyền với Premium 💎</h3>
            <p className="text-indigo-100 text-[13px] sm:text-sm font-medium leading-relaxed">
              Tải không giới hạn hơn 140,000+ tài liệu, không chứa quảng cáo, ưu tiên hỗ trợ tìm tài liệu khó. Đăng ký ngay hôm nay để nhận ưu đãi giảm 35% cho sinh viên.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 flex-shrink-0">
            <button 
              onClick={() => navigate('/subscriptions')}
              className="px-8 py-3.5 bg-white text-indigo-700 text-sm font-extrabold rounded-xl hover:bg-indigo-50 hover:shadow-lg transition-all"
            >
              Nâng cấp ngay
            </button>
          </div>
        </section>

        {/* 8. DISCUSSIONS & COMMUNITY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Threads List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-600" /> Sinh viên hỏi đáp - Xin tài liệu
            </h2>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-sm">
              {DISCUSSION_THREADS.map((thread) => (
                <div key={thread.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider">
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{thread.category}</span>
                      <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{thread.badge}</span>
                    </div>
                    <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 tracking-tight line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors">{thread.title}</h4>
                    <span className="block text-[11px] text-slate-500 font-medium">Đăng bởi: <span className="font-bold text-slate-700">@{thread.user}</span></span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-bold flex-shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <div className="text-center min-w-[32px]">
                      <span className="block text-slate-800 text-[13px]">{thread.replies}</span>
                      <span className="block text-[9px] font-medium text-slate-500 uppercase">Phản hồi</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-center min-w-[32px]">
                      <span className="block text-slate-800 text-[13px]">{thread.views}</span>
                      <span className="block text-[9px] font-medium text-slate-500 uppercase">Xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors Card */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">🏆 Bảng vàng đóng góp</h2>
            
            <div className="bg-indigo-950 rounded-xl p-5 text-white shadow-xl space-y-4 relative overflow-hidden">
              {/* Trang trí nền */}
              <div className="absolute top-0 right-0 opacity-10 text-white transform translate-x-4 -translate-y-4">
                <Crown className="w-32 h-32" />
              </div>

              <div className="space-y-2.5 relative z-10">
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-amber-400 text-slate-950 text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">1</div>
                    <div>
                      <span className="block text-[13px] font-bold tracking-tight">Trần Minh Quân</span>
                      <span className="block text-[10px] text-indigo-200 font-medium">ĐH Bách Khoa Hà Nội</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-extrabold text-amber-400">+1,420 file</span>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-300 text-slate-950 text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">2</div>
                    <div>
                      <span className="block text-[13px] font-bold tracking-tight">Lê Phương Thảo</span>
                      <span className="block text-[10px] text-indigo-200 font-medium">ĐH Ngoại Thương</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-extrabold text-slate-300">+980 file</span>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-amber-700 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md">3</div>
                    <div>
                      <span className="block text-[13px] font-bold tracking-tight">Nguyễn Tiến Đạt</span>
                      <span className="block text-[10px] text-indigo-200 font-medium">ĐH Kinh tế Quốc dân</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-extrabold text-amber-500">+850 file</span>
                </div>
              </div>

              <div className="text-center pt-2 relative z-10 border-t border-white/10">
                <span className="text-[11px] text-indigo-200 font-medium">Phần thưởng X2 Credit tự động trao ngày 30 hàng tháng</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
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