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
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, SUCCESS, FAILED, PENDING

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
      console.error("Failed to fetch admin transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    if (status === "00") return { label: 'Success', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    if (!status || status.trim() === '') return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
    return { label: 'Failed', color: 'bg-red-100 text-red-700', icon: XCircle };
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      (txn.txnRef && txn.txnRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.userEmail && txn.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.userFullName && txn.userFullName.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesFilter = true;
    if (statusFilter === 'SUCCESS') matchesFilter = txn.status === "00";
    if (statusFilter === 'FAILED') matchesFilter = txn.status !== "00" && txn.status !== null && txn.status.trim() !== '';
    if (statusFilter === 'PENDING') matchesFilter = !txn.status || txn.status.trim() === '';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Transaction History
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor all user payments securely (Read-only).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success (00)</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Ref or Email..." 
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
                <th className="px-6 py-4 font-medium">Txn Ref</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Package / Amount</th>
                <th className="px-6 py-4 font-medium">Date & VNPAY No</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
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
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No transactions found.</td>
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
                          {txn.packageType || 'Unknown'}
                        </span>
                        <div className="font-bold text-slate-800">
                          {formatCurrency(txn.amount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-slate-700">{new Date(txn.createdAt).toLocaleString()}</div>
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
