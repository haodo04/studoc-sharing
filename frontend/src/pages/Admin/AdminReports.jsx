import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  Undo2
} from 'lucide-react';
import { getAdminReports, updateAdminReportStatus } from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const { getToken } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, RESOLVED, REJECTED

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await getAdminReports(token);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch admin reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = await getToken();
      await updateAdminReportStatus(id, newStatus, token);
      toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);
      fetchReports();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusInfo = (status) => {
    if (status === "RESOLVED") return { label: 'Đã giải quyết', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
    if (status === "REJECTED") return { label: 'Từ chối', color: 'bg-slate-100 text-slate-700', icon: XCircle };
    return { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700', icon: Clock };
  };

  const filteredReports = reports.filter(r => {
    const searchString = `${r.documentTitle} ${r.reporterEmail} ${r.reason}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="text-rose-500" />
            Báo cáo Vi phạm
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Kiểm duyệt các tài liệu bị người dùng báo cáo.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm báo cáo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Tài liệu & Người báo cáo</th>
                <th className="px-6 py-4 font-medium">Lý do & Chi tiết</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Không có báo cáo nào.</td>
                </tr>
              ) : filteredReports.map((report) => {
                const statusInfo = getStatusInfo(report.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-slate-800 line-clamp-2 max-w-xs mb-1">
                        {report.documentTitle}
                      </div>
                      <a href={`/document/${report.documentId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Xem tài liệu <ExternalLink size={10} />
                      </a>
                      <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        Báo cáo bởi: <span className="font-medium text-slate-700">{report.reporterName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">({report.reporterEmail})</div>
                    </td>
                    
                    <td className="px-6 py-4 align-top max-w-sm">
                      <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 mb-2">
                        {report.reason}
                      </span>
                      {report.detail && (
                        <p className="text-slate-600 text-xs italic bg-slate-50 p-2 rounded border border-slate-100">
                          "{report.detail}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400 mt-2 font-medium">
                        Ngày báo cáo: {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${statusInfo.color}`}>
                        <StatusIcon size={14} />
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top text-right space-x-2">
                      {report.status === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-200 font-bold rounded-lg transition-colors text-xs"
                          >
                            <CheckCircle2 size={14} /> Resolve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 font-bold rounded-lg transition-colors text-xs"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(report.id, 'PENDING')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 font-bold rounded-lg transition-colors text-xs"
                          title="Hoàn tác về trạng thái Chờ xử lý"
                        >
                          <Undo2 size={14} /> Hoàn tác
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
