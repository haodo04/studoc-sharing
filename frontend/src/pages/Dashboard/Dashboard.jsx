import { UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { UserCreditsContext } from "../../context/UserCreditsContext";
import axios from "axios";
import apiEndpoints from "../../api/apiEndpoint";
import { Loader2, FileText, Download, Eye, Coins } from "lucide-react";
import DashboardUpload from "../../components/ui/DashboardUpload";
import RecentFiles from "../../components/ui/RecentFiles";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { getToken } = useAuth();
  const { credits, fetchUserCredits } = useContext(UserCreditsContext);

  const fetchRecentFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get(apiEndpoints.FETCH_FILES, {
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
        } else if (res.data && typeof res.data === 'object') {
          fetchedData = Object.values(res.data).find(val => Array.isArray(val)) || [];
        }
        
        setFiles(fetchedData);
      }
    } catch (err) {
      console.error("Error fetching files from Backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, [getToken]);

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    setUploadFiles((prev) => [...prev, ...selectedFiles]);
    setMessage("");
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setUploading(true);
    setMessage("");

    try {
      const token = await getToken();
      const formData = new FormData();
      uploadFiles.forEach((file) => {
        formData.append("files", file); 
      });

      const res = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        setMessage("Tải lên chuỗi tài liệu thành công!");
        setMessageType("success");
        setUploadFiles([]);

        await fetchRecentFiles();
        if (fetchUserCredits) await fetchUserCredits();
      }
    } catch (err) {
      console.error("Upload error response:", err);
      setMessage(err.response?.data?.message || "Lỗi đồng bộ tải tệp tin lên Backend API.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="py-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* HEADER WELCOME BANNER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Không gian tổng quan Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">Đồng bộ hóa dữ liệu danh mục tệp tin thời gian thực từ máy chủ.</p>
          </div>
        </div>

        {/* THÈ SỐ LIỆU THỐNG KÊ TỔNG QUAN */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 block">Đã tải lên</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono">{files.length}</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <FileText size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 block">Lượt xem</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono">{files.length * 2}</span>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-all">
              <Eye size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 block">Lượt tải về</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 font-mono">{files.length}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Download size={20} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 block">Số dư Credit</span>
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 font-mono">{credits} Cr</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Coins size={20} />
            </div>
          </div>
        </div>

        {/* FEEDBACK BANNER TRẠNG THÁI */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm text-xs sm:text-sm font-medium transition-all ${
              messageType === "error"
                ? "bg-red-50 text-red-800 border-red-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-100"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${messageType === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 xl:col-span-4">
            <DashboardUpload
              files={uploadFiles}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              uploading={uploading}
              onRemoveFile={handleRemoveFile}
              remainingUploads={credits} 
            />
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[350px]">
                <Loader2 className="text-indigo-600 animate-spin mb-4 stroke-[1.8]" size={36} />
                <p className="text-sm font-medium text-slate-700">Đang đồng bộ từ Spring Boot API...</p>
              </div>
            ) : (
              <RecentFiles files={files} />
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;