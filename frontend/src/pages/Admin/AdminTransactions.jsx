import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { getAdminTransactions } from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';

const AdminTransactions = () => {
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await getAdminTransactions(token);
      setTransactions(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách giao dịch", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    if (status === "SUCCESS") return { label: 'Thành công', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    if (status === "PENDING" || !status || status.trim() === '') return { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
    return { label: 'Thất bại', color: 'bg-red-100 text-red-700', icon: XCircle };
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      (txn.txnRef && txn.txnRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.userEmail && txn.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.userFullName && txn.userFullName.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (statusFilter === 'SUCCESS') matchesFilter = txn.status === "SUCCESS";
    if (statusFilter === 'FAILED') matchesFilter = txn.status === "FAILED";
    if (statusFilter === 'PENDING') matchesFilter = !txn.status || txn.status.trim() === '' || txn.status === "PENDING";

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Lịch sử giao dịch
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Theo dõi toàn bộ giao dịch thanh toán của người dùng (chỉ xem).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="FAILED">Thất bại</option>
            <option value="PENDING">Đang xử lý</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo mã GD hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Mã giao dịch</th>
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Gói / Số tiền</th>
                <th className="px-6 py-4 font-medium">Thời gian & Mã VNPAY</th>
                <th className="px-6 py-4 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không tìm thấy giao dịch nào.</td>
                </tr>
              ) : filteredTransactions.map((txn) => {
                const statusInfo = getStatusInfo(txn.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <div className="font-mono text-slate-700 font-medium">{txn.txnRef || 'N/A'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">ID: {txn.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="font-medium text-slate-800">{txn.userFullName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{txn.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          {txn.packageType || 'Không xác định'}
                        </span>
                        <div className="font-bold text-slate-800">
                          {formatCurrency(txn.amount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-slate-700">{new Date(txn.createdAt).toLocaleString('vi-VN')}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        VNPAY: {txn.vnpTransactionNo || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex justify-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-max ${statusInfo.color}`}>
                          <StatusIcon size={14} />
                          {statusInfo.label}
                        </span>
                      </div>
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

export default AdminTransactions;