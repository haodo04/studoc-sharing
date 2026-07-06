import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { documentApi } from '../../../api/documentApi';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

export default function ReportModal({ isOpen, onClose, documentId, documentTitle }) {
  const { getToken, isSignedIn } = useAuth();
  const [reason, setReason] = useState('Vi phạm bản quyền');
  const [detail, setDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    'Vi phạm bản quyền',
    'Nội dung không phù hợp / Phản cảm',
    'Spam / Quảng cáo',
    'Sai chuyên mục',
    'Lý do khác'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Vui lòng đăng nhập để gửi báo cáo!');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const token = await getToken();
      await documentApi.reportDocument(documentId, reason, detail, token);
      toast.success('Gửi báo cáo thành công! Cảm ơn bạn đã đóng góp.');
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi báo cáo, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert size={20} className="shrink-0" />
            <h3 className="font-bold">Báo cáo Tài liệu</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-sm text-slate-600">
            Bạn đang báo cáo tài liệu: <span className="font-bold text-slate-800">{documentTitle}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Lý do báo cáo <span className="text-rose-500">*</span></label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            >
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Chi tiết bổ sung</label>
            <textarea 
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Cung cấp thêm thông tin để Admin dễ dàng xác minh (URL bản gốc, chi tiết vị trí vi phạm...)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 min-h-[100px] resize-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 p-3 rounded-lg text-xs">
            <AlertTriangle size={16} className="shrink-0" />
            <p>Báo cáo giả mạo hoặc spam có thể dẫn đến việc tài khoản bị khóa vĩnh viễn.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : null}
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
