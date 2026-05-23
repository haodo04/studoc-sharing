import React, { useState } from 'react';
import { Search, Compass, TrendingUp, Clock, Filter } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';
import DashboardLayout from '../components/layout/DashboardLayout';

const ExplorePage = () => {
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    // Danh mục bộ lọc nhanh
    const categories = [
        "Tất cả", "Công nghệ thông tin", "Kinh tế - Quản trị",
        "Ngoại ngữ", "Tâm lý học", "Toán học", "Đồ án - Luận văn", "Đề thi"
    ];

    // Dữ liệu mẫu: Tài liệu nổi bật
    const trendingDocs = [
        { id: 101, title: "Giáo trình Cấu trúc dữ liệu và Giải thuật (Bản đẹp)", author: "Trần Văn A", fileType: "pdf", views: 2450, downloads: 890, cost: 2, date: "3 ngày trước" },
        { id: 102, title: "Tổng hợp 500 từ vựng TOEIC thường gặp nhất", author: "Hải Yến English", fileType: "word", views: 1820, downloads: 650, cost: 1, date: "1 tuần trước" },
        { id: 103, title: "Bảng tính Excel quản lý tài chính cá nhân tự động", author: "Minh Quân", fileType: "excel", views: 950, downloads: 320, cost: 0, date: "5 ngày trước" },
        { id: 104, title: "Template Slide Thuyết trình Đồ án Tốt nghiệp (Minimalist)", author: "DesignSpace", fileType: "ppt", views: 3100, downloads: 1200, cost: 3, date: "2 tuần trước" },
    ];

    // Dữ liệu mẫu: Tài liệu mới cập nhật
    const recentDocs = [
        { id: 201, title: "Đề thi giữa kỳ môn Nhập môn Lập trình Web 2024", author: "Nguyễn Lê Bảo", fileType: "pdf", views: 45, downloads: 12, cost: 1, date: "10 phút trước" },
        { id: 202, title: "Tiểu luận: Ảnh hưởng của AI đến ngành Marketing", author: "Thùy Linh", fileType: "docx", views: 89, downloads: 25, cost: 1, date: "1 giờ trước" },
        { id: 203, title: "Tài liệu ôn tập Trí tuệ nhân tạo (Full chương 1-5)", author: "Hào Võ", fileType: "pdf", views: 120, downloads: 40, cost: 2, date: "3 giờ trước" },
        { id: 204, title: "Bài tập lớn môn Hệ cơ sở dữ liệu - Quản lý thư viện", author: "DevTeam", fileType: "word", views: 56, downloads: 8, cost: 1, date: "Hôm qua" },
    ];

    return (
        <DashboardLayout activeMenu="Explore">
            <div className="flex-1 overflow-y-auto bg-slate-50/50 pb-12">

                {/* 1. HERO SEARCH SECTION */}
                <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-b border-slate-200/60 px-6 py-12 sm:py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-semibold mb-4">
                            <Compass size={16} />
                            <span>Khám phá tri thức</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                            Tìm kiếm tài liệu học tập
                        </h1>
                        <p className="text-slate-500 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                            Hàng ngàn giáo trình, bài giảng, đề thi và đồ án đang chờ bạn khám phá. Chia sẻ kiến thức, nhận lại giá trị.
                        </p>

                        {/* Thanh Search To */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl leading-5 bg-transparent placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:text-base transition-all shadow-sm"
                                placeholder="Nhập tên tài liệu, môn học, giáo trình..."
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. QUICK CATEGORIES */}
                <div className="px-6 py-5 border-b border-slate-200/50 bg-white sticky top-0 z-10">
                    <div className="max-w-[1500px] mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                        <div className="flex items-center gap-2 text-slate-400 mr-2 shrink-0">
                            <Filter size={18} />
                        </div>
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveCategory(category)}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-[1500px] mx-auto px-4 sm:px-6 mt-8 space-y-12">

                    {/* 3. TRENDING SECTION */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-slate-900">
                                <TrendingUp size={20} className="text-orange-500" />
                                <h2 className="text-xl font-bold">Tài liệu nổi bật tuần này</h2>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Xem tất cả</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {trendingDocs.map((doc) => (
                                <DocumentCard key={doc.id} {...doc} onDownload={() => alert(`Tải file: ${doc.title}`)} />
                            ))}
                        </div>
                    </section>

                    {/* 4. RECENT FEED SECTION */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-slate-900">
                                <Clock size={20} className="text-emerald-500" />
                                <h2 className="text-xl font-bold">Mới cập nhật</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {recentDocs.map((doc) => (
                                <DocumentCard key={doc.id} {...doc} onDownload={() => alert(`Tải file: ${doc.title}`)} />
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExplorePage;