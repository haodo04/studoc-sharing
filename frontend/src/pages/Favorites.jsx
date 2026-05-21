import React from 'react';
import {
    Star,
    FileText,
    Image as ImageIcon,
    Folder,
    FileSpreadsheet
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const FavoritesPage = () => {
    // Mock Data cho khu vực "Truy cập nhanh"
    const quickAccessItems = [
        {
            id: 1,
            name: 'Q3_Financial_Report_Final.pdf',
            timeInfo: 'Mở lúc 09:41',
            icon: <FileText size={20} className="text-primary" />,
            bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 2,
            name: 'Brand_Guidelines_2024.fig',
            timeInfo: 'Mở hôm qua',
            icon: <ImageIcon size={20} className="text-tertiary-container" />,
            bgImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=500&q=80',
        }
    ];

    // Dữ liệu mẫu cho danh sách tất cả file yêu thích
    const favoriteListItems = [
        {
            id: 1,
            name: 'Marketing Campaign Assets',
            date: '12 Thg 10, 2023',
            size: '--',
            icon: <Folder size={20} className="text-primary" />,
        },
        {
            id: 2,
            name: 'Budget_Planning_FY24.xlsx',
            date: '05 Thg 10, 2023',
            size: '1.2 MB',
            icon: <FileSpreadsheet size={20} className="text-secondary" />,
        },
        {
            id: 3,
            name: 'Project_Alpha_Specs.docx',
            date: '28 Thg 9, 2023',
            size: '845 KB',
            icon: <FileText size={20} className="text-primary" />,
        }
    ];

    return (
        <DashboardLayout activeMenu="Favorites">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="max-w-container-max mx-auto w-full">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            Yêu thích
                        </h2>
                    </div>

                    {/* Quick Access Section */}
                    <section className="mb-10">
                        <h3 className="font-headline-md text-headline-md text-on-surface-variant mb-4">
                            Truy cập nhanh
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickAccessItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:bg-surface-bright transition-colors cursor-pointer flex flex-col h-48"
                                >
                                    {/* Thumbnail / Image Area */}
                                    <div
                                        className="flex-1 bg-surface-container-low bg-cover bg-center relative"
                                        style={{ backgroundImage: `url('${item.bgImage}')` }}
                                    >
                                        <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center">
                                            <Star size={16} className="text-primary" fill="currentColor" />
                                        </div>
                                    </div>
                                    {/* Info Area */}
                                    <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center gap-3">
                                        {item.icon}
                                        <div className="min-w-0">
                                            <p className="font-label-md text-label-md text-on-surface truncate">
                                                {item.name}
                                            </p>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                                                {item.timeInfo}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* All Favorites List Section */}
                    <section>
                        {/* Table Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-2 px-4">
                            <span className="font-label-md text-label-md text-on-surface-variant w-1/2">
                                Tên
                            </span>
                            <div className="flex w-1/2 justify-between">
                                <span className="font-label-md text-label-md text-on-surface-variant hidden sm:block w-1/2">
                                    Ngày sửa đổi
                                </span>
                                <span className="font-label-md text-label-md text-on-surface-variant w-1/2 text-right">
                                    Kích thước
                                </span>
                            </div>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col">
                            {favoriteListItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group"
                                >
                                    {/* Left Side: Icon + Name */}
                                    <div className="flex items-center gap-4 w-1/2 min-w-0">
                                        <button className="text-primary opacity-100 flex items-center hover:scale-110 transition-transform">
                                            <Star size={20} fill="currentColor" />
                                        </button>
                                        {item.icon}
                                        <span className="font-body-md text-body-md text-on-surface truncate">
                                            {item.name}
                                        </span>
                                    </div>

                                    {/* Right Side: Date & Size */}
                                    <div className="flex w-1/2 justify-between items-center">
                                        <span className="font-body-md text-body-md text-on-surface-variant hidden sm:block w-1/2">
                                            {item.date}
                                        </span>
                                        <span className="font-body-md text-body-md text-on-surface-variant w-1/2 text-right">
                                            {item.size}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default FavoritesPage;