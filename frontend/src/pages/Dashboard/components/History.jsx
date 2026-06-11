import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import apiEndpoints from "../../../api/apiEndpoint";
import {
  Download,
  Eye,
  List,
  Search,
  History as HistoryIcon,
  Loader2,
  Coins
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchHistory = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(apiEndpoints.GET_DOWNLOAD_HISTORY(user.id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setHistoryList(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching download history:", error);
      toast.error("Không thể tải danh sách lịch sử download.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user, getToken]);

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredHistory = historyList.filter(item => 
    (item.fileName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout activeMenu="Tài liệu đã tải xuống">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* THANH TÌM KIẾM TẬP TRUNG */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trong lịch sử tải..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-700 transition-all"
            />
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
             <List size={14}/> Hiển thị danh sách lịch sử đơn hàng tải
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="text-indigo-600 animate-spin mb-4" size={36} />
            <p className="text-sm font-medium text-slate-700">Đang đồng bộ lịch sử tải xuống từ hệ thống...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-3">
              <HistoryIcon size={28} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Chưa có lịch sử tải xuống</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Bạn chưa thực hiện tải bất cứ tài liệu nào từ nền tảng.
            </p>
          </div>
        ) : (
          /* TABLE VIEW RENDER */
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500">Tên tài liệu</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Dung lượng</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Chi phí mua</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase text-slate-500">Thời gian tải</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-500 text-center">Tải lại tệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700 max-w-[300px] truncate" title={item.fileName}>
                      {item.fileName || "Tài liệu không còn tồn tại"}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">
                      {formatFileSize(item.fileSize)}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 border border-amber-100/70 rounded-full px-2 py-0.5 w-fit">
                        <Coins size={12}/>
                        <span>{item.creditsSpent || 0} xu</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDate(item.downloadedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút Xem lại Chi tiết */}
                        <a
                          href={`/file/${item.fileId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Xem chi tiết tài liệu"
                        >
                          <Eye size={15} />
                        </a>

                        {/* Nút Thực thi Tải lại File trực tiếp từ Backend */}
                        <a
                          href={apiEndpoints.DOWNLOAD_FILE(item.fileId)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Tải lại file"
                        >
                          <Download size={15} />
                        </a>
                      </div>
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

export default History;