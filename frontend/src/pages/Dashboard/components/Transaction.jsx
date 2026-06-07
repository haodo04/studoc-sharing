import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import apiEndpoints from "../../../api/apiEndpoint";
import {
  CreditCard,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  DollarSign
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchPaymentHistory = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.GET_PAYMENT_HISTORY(user.id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setTransactions(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Không thể tải danh sách lịch sử giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPaymentHistory();
    }
  }, [user, getToken]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderStatus = (status) => {
    const formattedStatus = (status || "").toUpperCase();
    switch (formattedStatus) {
      case "SUCCESS":
      case "ĐÃ THANH TOÁN":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} />
            <span>Thành công</span>
          </span>
        );
      case "FAILED":
      case "THẤT BẠI":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            <XCircle size={12} />
            <span>Thất bại</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock size={12} />
            <span>Chờ xử lý</span>
          </span>
        );
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    (tx.txnRef || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.vnpTransactionNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.packageType || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* THANH TÌM KIẾM HÓA ĐƠN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã giao dịch, tên gói..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-700 transition-all"
            />
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
             <Calendar size={14}/> Nhật ký biến động số dư tài khoản nạp
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={36} />
            <p className="text-sm font-medium text-slate-700">Đang đồng bộ lịch sử giao dịch Fintech...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-3">
              <CreditCard size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Chưa có giao dịch phát sinh</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Bạn chưa thực hiện bất cứ lệnh nạp xu hay thanh toán hóa đơn nào trên hệ thống.
            </p>
          </div>
        ) : (
          /* BẢNG RENDER DỮ LIỆU THANH TOÁN */
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500">Mã đơn (TxnRef)</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Mã VNPAY No.</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Gói dịch vụ</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Số tiền nạp</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Thời gian</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-slate-700 font-semibold">
                      {tx.txnRef || "-"}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">
                      {tx.vnpTransactionNo || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 font-medium">
                      <span className="bg-indigo-50 border border-indigo-100/70 text-indigo-700 rounded px-2 py-0.5">
                        {tx.packageType || tx.packageId || "Nạp Xu"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-800">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderStatus(tx.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transaction;