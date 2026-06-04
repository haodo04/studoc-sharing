import React from 'react';
import { FileText, Lock, Download } from 'lucide-react';

export default function DocumentPreview({ documentData, handleDownload }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between text-xs font-semibold border-b border-slate-800">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" /> 
          Trình xem trước tài liệu ({documentData.pageCount || 0} trang)
        </span>
        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30">
          Đọc thử miễn phí 2 trang
        </span>
      </div>
      <div className="p-4 md:p-6 bg-slate-100 space-y-4 max-h-[620px] overflow-y-auto relative">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
          <div className="text-center font-bold text-slate-900 uppercase border-b pb-2 mb-4">
            {documentData.universityId || "Đang cập nhật"}
          </div>
          <p className="font-bold text-slate-900 mb-2">Câu 1 (2.5 điểm):</p>
          <p>Tính giới hạn của hàm số sau khi x tiến về 0: L = lim (cos(x) - e^(-x^2/2)) / x^4</p>
          <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">
            [Trang 1 / {documentData.pageCount || 0}]
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs leading-relaxed font-mono">
          <p className="font-bold text-slate-900 mb-2">Lời giải chi tiết câu 1:</p>
          <p>Khai triển Maclaurin đến bậc 4: cos(x) = 1 - x^2/2 + x^4/24 + o(x^4)</p>
          <p>Kết quả giới hạn thu được L = -1/12.</p>
          <div className="text-right text-[10px] text-slate-400 pt-4 font-sans">
            [Trang 2 / {documentData.pageCount || 0}]
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 text-xs blur-[4px] pointer-events-none select-none font-mono">
          <p className="font-bold">Câu 2 (3.0 điểm): Cực trị tự do hàm hai biến</p>
          <p>Tìm cực trị của hàm số z = x^3 + y^3 - 3xy...</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[480px] bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 flex flex-col items-center justify-end p-6 text-center text-white">
          <div className="max-w-md space-y-3 pb-2">
            <Lock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
            <h3 className="text-sm md:text-base font-extrabold tracking-tight">
              Mở khóa để đọc toàn bộ {documentData.pageCount || 0} trang
            </h3>
            <p className="text-[11px] text-slate-400 px-4 leading-normal">
              Vui lòng sử dụng lượt tải tích lũy hoặc đăng ký hội viên để tải xuống bản đầy đủ chất lượng cao.
            </p>
            <button 
              onClick={handleDownload} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" /> 
              Tải Xuống Ngay (-{documentData.creditCost ?? 0} Lượt)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}