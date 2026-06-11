import { useAuth, useUser } from "@clerk/clerk-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserCreditsContext } from "../../context/UserCreditsContext";
import axios from "axios";
import apiEndpoints from "../../api/apiEndpoint";
import {
  Loader2,
  FileText,
  Download,
  Eye,
  Coins,
  ArrowUpRight,
  Sparkles,
  UploadCloud,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecentFiles from "../../components/ui/RecentFiles";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { credits } = useContext(UserCreditsContext);
  const { user } = useUser();

  const fetchRecentFiles = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const token = await getToken();

      const res = await axios.get(apiEndpoints.FETCH_FILES(user.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        let fetchedData = [];
        if (Array.isArray(res.data)) {
          fetchedData = res.data;
        } else if (res.data && Array.isArray(res.data.files)) {
          fetchedData = res.data.files;
        } else if (res.data && typeof res.data === "object") {
          fetchedData =
            Object.values(res.data).find((val) => Array.isArray(val)) || [];
        }
        setFiles(fetchedData);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setMessage("Không thể tải danh sách tài liệu.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchRecentFiles();
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchRecentFiles();
  }, [getToken]);

  const totalViews = files.reduce((acc, file) => acc + (file.views || 0), 0);
  const totalDownloads = files.reduce(
    (acc, file) => acc + (file.downloads || 0),
    0,
  );
  const totalFiles = files.length;

  return (
    <DashboardLayout>
      <div className="py-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 bg-slate-50/50 min-h-screen animate-in fade-in duration-300">
        {/* TOP STATUS MESSAGES */}
        {message && (
          <div
            className={`p-4 rounded-2xl border shadow-sm text-sm font-medium transition-all ${
              messageType === "error"
                ? "bg-rose-50 text-rose-800 border-rose-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-100"
            }`}
          >
            {message}
          </div>
        )}

        {/* TWO COLUMNS MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT AREA: NUMERICAL STATS & RECENT FILES (2/3 WIDTH) */}
          <div className="lg:col-span-2 space-y-6">
            {/* GRID STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CARD 1: DOCUMENTS */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-indigo-200/80 transition-all group duration-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Tài liệu đã đăng
                    </span>
                    <span className="text-3xl font-bold text-slate-800 font-mono tracking-tight">
                      {totalFiles}
                    </span>
                  </div>
                  <div className="p-3 bg-indigo-50/60 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <FileText size={20} className="stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 mr-1.5">
                    <TrendingUp size={12} /> +12%
                  </span>{" "}
                  so với tháng trước
                </div>
              </div>

              {/* CARD 2: VIEWS */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-sky-200/80 transition-all group duration-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Tổng lượt xem
                    </span>
                    <span className="text-3xl font-bold text-slate-800 font-mono tracking-tight">
                      {totalViews}
                    </span>
                  </div>
                  <div className="p-3 bg-sky-50/60 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                    <Eye size={20} className="stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 mr-1.5">
                    <TrendingUp size={12} /> +24%
                  </span>{" "}
                  người đọc mới quan tâm
                </div>
              </div>

              {/* CARD 3: DOWNLOADS */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-emerald-200/80 transition-all group duration-200">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Lượt tải về
                    </span>
                    <span className="text-3xl font-bold text-slate-800 font-mono tracking-tight">
                      {totalDownloads}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Download size={20} className="stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                  Tỷ lệ tải đạt{" "}
                  <span className="text-indigo-600 font-bold mx-1">35%</span>{" "}
                  trên tổng lượt tương tác
                </div>
              </div>
            </div>

            {/* RECENT FILES AREA CONTAINER */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Tài liệu tải lên gần đây
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Danh sách tệp tin đang được chia sẻ trên hệ thống.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/user/my-files")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                >
                  Xem tất cả <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="w-full">
                {loading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <Loader2
                      className="text-indigo-600 animate-spin mb-3 stroke-[1.8]"
                      size={32}
                    />
                    <p className="text-xs font-medium text-slate-500">
                      Đang đồng bộ dữ liệu từ Spring Boot...
                    </p>
                  </div>
                ) : (
                  <RecentFiles files={files} />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT AREA: QUICK ACTIONS & CREDIT WIDGETS (1/3 WIDTH) */}
          <div className="space-y-6">
            {/* WALL CREDIT WALLET BOX */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-md shadow-indigo-100">
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-indigo-100/80 font-medium tracking-wide uppercase">
                    Ví xu hiện có
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold font-mono tracking-tight">
                      {credits ?? 0}
                    </span>
                    <span className="text-sm font-semibold text-indigo-200">
                      Xu
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                  <Coins
                    size={24}
                    className="text-amber-300 fill-amber-300/40"
                  />
                </div>
              </div>
              <p className="text-[11px] text-indigo-100/70 mt-4 leading-relaxed">
                Sử dụng xu để tải tài liệu chuyên sâu hoặc chia sẻ file chất
                lượng tốt để nhận lại xu từ cộng đồng.
              </p>
              <button
                onClick={() => navigate("/premium")}
                className="w-full mt-5 bg-white hover:bg-slate-50 text-indigo-700 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Sparkles
                  size={14}
                  className="fill-indigo-600 text-indigo-600"
                />{" "}
                Nạp thêm xu ngay
              </button>
            </div>

            {/* QUICK ACTIONS PANEL BUTTONS */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Thao tác nhanh
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Lối tắt quản lý tài nguyên tài khoản cá nhân.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => navigate("/upload")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <UploadCloud size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Tải lên tài liệu mới
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Chia sẻ file PDF, Word, Powerpoint
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
