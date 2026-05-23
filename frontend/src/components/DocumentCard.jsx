import React from 'react';
import {
    FileText,
    FileSpreadsheet,
    Presentation,
    File,
    Eye,
    Download,
    User
} from "lucide-react";

const DocumentCard = ({
    title,
    author,
    fileType = 'pdf',
    views = 0,
    downloads = 0,
    cost = 1,
    date = 'Vừa xong',
    onDownload
}) => {

    const getFileIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'pdf':
                return <FileText className="text-red-500 w-7 h-7" />;
            case 'word':
            case 'doc':
            case 'docx':
                return <FileText className="text-blue-500 w-7 h-7" />;
            case 'excel':
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="text-emerald-500 w-7 h-7" />;
            case 'powerpoint':
            case 'ppt':
            case 'pptx':
                return <Presentation className="text-orange-500 w-7 h-7" />;
            default:
                return <File className="text-slate-500 w-7 h-7" />;
        }
    };

    return (
        <div className="group bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200/80 transition-all duration-200 flex flex-col justify-between h-[190px] w-full">

            {/* Phần trên: Icon file, Tên tài liệu & Người đăng */}
            <div>
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50/50 transition-colors shrink-0">
                        {getFileIcon(fileType)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h4
                            className="text-[14px] font-semibold text-slate-900 leading-snug break-words line-clamp-2 group-hover:text-indigo-600 transition-colors"
                            title={title}
                        >
                            {title}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                            <User size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[110px]" title={author}>
                                {author}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="shrink-0">{date}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần dưới: Thống kê (Views/Downloads) & Nút Tải về */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1" title="Lượt xem">
                        <Eye size={14} className="text-slate-400" />
                        <span>{views}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Lượt tải về">
                        <Download size={14} className="text-slate-400" />
                        <span>{downloads}</span>
                    </div>
                </div>

                <button
                    onClick={onDownload}
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/70 px-3 py-1.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95 text-xs font-bold text-amber-700"
                >
                    <Download size={13} className="stroke-[2.5]" />
                    <span>{cost === 0 ? "Miễn phí" : `-${cost} lượt`}</span>
                </button>
            </div>
        </div>
    );
};

export default DocumentCard;