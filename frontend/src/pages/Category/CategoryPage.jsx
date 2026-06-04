import React, { useState } from 'react';
import NavbarPage from "../../components/common/NavbarPage";
import {
    Search,
    Compass,
    Clock,
    TrendingUp,
    Star,
    Monitor,
    Briefcase,
    Scale,
    Stethoscope,
    Calculator,
    GraduationCap,
    Building2,
    BookOpen,
    Award,
    FileText,
    File,
    Presentation,
    Archive,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function CategoryPage() {
    const [activeFilter, setActiveFilter] = useState('Tất cả');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            {/* 1. KẾ THỪA NAVBAR TỪ EXPLORE PAGE */}
            <NavbarPage />

            {/* 2. MAIN LAYOUT */}
            <div className="flex flex-1 max-w-[1500px] mx-auto w-full">

                {/* SIDEBAR BÊN TRÁI (Đã bỏ thanh search) */}
                <aside className="hidden md:flex flex-col sticky top-[65px] left-0 h-[calc(100vh-65px)] p-6 gap-4 w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0 z-10">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-indigo-600 mb-1">Bộ lọc tài liệu</h2>
                        <p className="text-sm text-slate-500">Tìm kiếm theo ngành & trường</p>
                    </div>

                    {/* Nhóm: Khám Phá */}
                    <div className="flex flex-col gap-1 mb-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Khám Phá</h3>
                        {[
                            { name: 'Tất cả', icon: Compass },
                            { name: 'Mới nhất', icon: Clock },
                            { name: 'Thịnh hành', icon: TrendingUp },
                            { name: 'Đánh giá cao', icon: Star },
                        ].map((item) => {
                            const Icon = item.icon;
                            const isActive = activeFilter === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveFilter(item.name)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive
                                        ? "bg-indigo-50 text-indigo-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "fill-indigo-100" : ""}`} />
                                    <span>{item.name}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Nhóm: Ngành Học */}
                    <div className="flex flex-col gap-1 mb-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Ngành Học</h3>
                        {[
                            { name: 'IT', icon: Monitor },
                            { name: 'Economy', icon: Briefcase },
                            { name: 'Law', icon: Scale },
                            { name: 'Medicine', icon: Stethoscope },
                            { name: 'Math', icon: Calculator },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Nhóm: Trường Đại Học */}
                    <div className="flex flex-col gap-1 mb-8">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Trường Đại Học</h3>
                        {[
                            { name: 'NLU', icon: GraduationCap },
                            { name: 'HUST', icon: Building2 },
                            { name: 'NEU', icon: BookOpen },
                            { name: 'FTU', icon: Award },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </aside>

                {/* NỘI DUNG CHÍNH BÊN PHẢI */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">

                    {/* KHU VỰC THANH TÌM KIẾM MỚI*/}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="relative w-full max-w-lg group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nhập tên tài liệu, môn học, mã học phần..."
                                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl leading-5 bg-transparent placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-sm font-medium transition-all shadow-sm"
                            />
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm shrink-0 active:scale-95 flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" />
                            Tìm kiếm
                        </button>
                    </div>

                    {/* Header của Content */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-5">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{activeFilter}</h1>
                            <p className="text-sm text-slate-500 mt-1">Khám phá hàng ngàn tài liệu học tập từ các trường đại học hàng đầu.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">Sắp xếp theo:</span>
                            <select className="bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer">
                                <option>Mới nhất</option>
                                <option>Đánh giá cao</option>
                                <option>Tải nhiều nhất</option>
                                <option>Cũ nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Lưới Tài Liệu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {/* Document Card 1 (Featured - spans 2 cols on lg) */}
                        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col lg:col-span-2 sm:col-span-2 cursor-pointer">
                            <div className="relative w-full aspect-[21/9] bg-slate-50 overflow-hidden">
                                <img
                                    alt="Cover"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60"
                                />
                                <div className="absolute top-3 left-3 bg-white text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                    <FileText className="w-4 h-4 text-red-500" /> PDF
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200">
                                    150 Lượt tải
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">HUST - IT</span>
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">CS101</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    Giáo trình Cấu trúc dữ liệu và Giải thuật toàn tập 2024
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                                    Tài liệu chi tiết về CTDL, bao gồm lý thuyết, bài tập thực hành và code mẫu C++. Phù hợp cho sinh viên năm 2.
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-xs font-bold">4.9</span>
                                        <span className="text-slate-400 text-[10px] ml-1">(128)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-semibold">2.4k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Card 2 */}
                        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer">
                            <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 opacity-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-600/20">
                                    <FileText className="w-16 h-16" />
                                </div>
                                <div className="absolute top-3 left-3 bg-white text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                    <FileText className="w-4 h-4 text-blue-500" /> DOCX
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200">
                                    Miễn phí
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">NEU - ECO</span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    Đề thi Kinh tế vĩ mô cuối kỳ 2023 có đáp án
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-xs font-bold">4.5</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-semibold">850</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Card 3 */}
                        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer">
                            <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
                                <img
                                    alt="Cover"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60"
                                />
                                <div className="absolute top-3 left-3 bg-white text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                    <Presentation className="w-4 h-4 text-orange-500" /> PPT
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200">
                                    50 Lượt tải
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">NLU - LAW</span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    Slide bài giảng Luật Dân sự 1 - Chương 1 đến 5
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-xs font-bold">4.2</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-semibold">320</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Card 4 */}
                        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer">
                            <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 opacity-60"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-600/30">
                                    <FileText className="w-16 h-16" />
                                </div>
                                <div className="absolute top-3 left-3 bg-white text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                    <FileText className="w-4 h-4 text-red-500" /> PDF
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200">
                                    200 Lượt tải
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">MED - BIO</span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    Atlas Giải phẫu người Frank H. Netter Bản tiếng Việt
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-xs font-bold">5.0</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-semibold">5.2k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Card 5 */}
                        <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer">
                            <div className="relative w-full aspect-[16/10] bg-slate-50 overflow-hidden">
                                <img
                                    alt="Cover"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60"
                                />
                                <div className="absolute top-3 left-3 bg-white text-indigo-600 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm">
                                    <Archive className="w-4 h-4 text-emerald-500" /> ZIP
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200">
                                    Miễn phí
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wide border border-slate-200">FTU - MATH</span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    Tuyển tập bài tập Toán cao cấp A1, A2 (Có giải)
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span className="text-xs font-bold">4.7</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs font-semibold">1.1k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Phân trang (Pagination) */}
                    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors disabled:opacity-50">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm font-medium">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm font-medium">3</button>
                        <span className="text-slate-500 px-2">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-sm font-medium">12</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}