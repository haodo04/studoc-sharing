import React from 'react';
import { Trash2, RotateCcw, FileText, Image as ImageIcon, Folder, Trash } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const TrashPage = () => {
    // Mock data
    const trashItems = [
        {
            id: 1,
            name: 'Bao_cao_Tai_chinh_Q3.pdf',
            date: 'Hôm qua',
            type: 'pdf',
            icon: <FileText size={20} />,
            bgClass: 'bg-error-container/30',
            textClass: 'text-error',
        },
        {
            id: 2,
            name: 'Thiet_ke_UI_v2.png',
            date: '12 thg 10, 2023',
            type: 'image',
            icon: <ImageIcon size={20} />,
            bgClass: 'bg-primary-container/20',
            textClass: 'text-primary',
        },
        {
            id: 3,
            name: 'Du_an_Cu',
            date: '05 thg 10, 2023',
            type: 'folder',
            icon: <Folder size={20} />,
            bgClass: 'bg-surface-variant',
            textClass: 'text-secondary',
        },
    ];

    return (
        <DashboardLayout activeMenu="Trash">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-surface-container-lowest">
                <div className="max-w-container-max mx-auto bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden py-6">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-6 pb-6 pt-2">
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-background">
                                Thùng rác
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                Các mục trong thùng rác sẽ bị xóa vĩnh viễn sau 30 ngày.
                            </p>
                        </div>
                        <button
                            className="bg-error-container text-on-error-container hover:bg-error hover:text-on-error font-label-md text-label-md py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-error/20"
                            title="Dọn sạch thùng rác"
                        >
                            <Trash2 size={20} />
                            Dọn sạch Thùng rác
                        </button>
                    </div>

                    {/* List View Container */}
                    <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm mx-6 mb-6">

                        {/* Table Header */}
                        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 border-b border-outline-variant bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider items-center hidden md:grid">
                            <div className="w-8 flex justify-center">Loại</div>
                            <div>Tên</div>
                            <div className="w-32 text-right">Ngày xóa</div>
                            <div className="w-16 text-center">Tác vụ</div>
                        </div>

                        {/* List Items */}
                        <div className="divide-y divide-outline-variant">
                            {trashItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-4 p-3 md:p-4 items-center hover:bg-surface-container-low transition-colors group"
                                >
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgClass} ${item.textClass}`}>
                                        {item.icon}
                                    </div>

                                    {/* Tên file & Ngày (Mobile) */}
                                    <div className="min-w-0">
                                        <p className="font-body-md text-body-md font-medium text-on-surface truncate">
                                            {item.name}
                                        </p>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5 md:hidden">
                                            {item.date}
                                        </p>
                                    </div>

                                    {/* Ngày xóa (Desktop) */}
                                    <div className="hidden md:block w-32 text-right font-body-md text-body-md text-on-surface-variant">
                                        {item.date}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            className="p-2 text-primary hover:bg-primary-fixed rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                                            title="Khôi phục"
                                        >
                                            <RotateCcw size={20} />
                                        </button>
                                        <button
                                            className="p-2 text-error hover:bg-error-container rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                                            title="Xóa vĩnh viễn"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {trashItems.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-48 h-48 mb-6 bg-surface-container rounded-full flex items-center justify-center text-surface-variant">
                                        <Trash2 size={80} strokeWidth={1} />
                                    </div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Thùng rác trống</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Các mục bạn xóa sẽ xuất hiện ở đây và sẽ bị xóa vĩnh viễn sau 30 ngày.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TrashPage;