import { useContext, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { UserCreditsContext } from "../components/context/UserCreditsContext";
import { AlertCircle, CheckCircle2, ArrowUpCircle } from "lucide-react";
import axios from "axios";
import apiEndpoints from "../util/apiEndpoint";
import UploadBox from "../components/UploadBox";

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); 
    const { getToken } = useAuth();
    const { credits, fetchUserCredits } = useContext(UserCreditsContext);
    const MAX_FILES = 5;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (files.length + selectedFiles.length > MAX_FILES) {
            setMessage(`Bạn chỉ có thể tải lên tối đa ${MAX_FILES} tài liệu cùng một lúc.`);
            setMessageType("error");
            return;
        } 

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setMessage("");

        try {
            const token = await getToken();
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            const response = await axios.post(apiEndpoints.UPLOAD_FILE, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setMessage("Tài liệu của nhóm bạn đã được tải lên thành công!");
            setMessageType('success');
            setFiles([]);
            
            if (fetchUserCredits) await fetchUserCredits();
        } catch (error) {
            console.error('Error uploading files: ', error);
            setMessage(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình tải tệp lên máy chủ.");
            setMessageType("error");
        } {
            setUploading(false);
        }
    };

    const isUploadDisable = files.length === 0 || files.length > MAX_FILES || credits <= 0 || files.length > credits;

    return (
        <DashboardLayout activeMenu="Upload">
            <div className="py-6 max-w-[1000px] mx-auto space-y-6">
                
                {/* BANNER HEADER */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ArrowUpCircle className="text-indigo-400" size={22} />
                            <h1 className="text-xl font-bold tracking-tight">Trung tâm Tải lên Tài liệu</h1>
                        </div>
                        <p className="text-xs text-slate-300">Đóng góp giáo trình, tài liệu hữu ích để tích lũy tài nguyên hệ thống.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-right hidden sm:block">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Hạn mức khả dụng</span>
                        <span className="text-lg font-bold text-indigo-300 font-mono">{credits} Credits</span>
                    </div>
                </div>

                {/* BANNER NOTIFICATION */}
                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm text-sm font-medium transition-all ${
                        messageType === 'error' 
                            ? 'bg-red-50 text-red-800 border-red-100' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    }`}>
                        {messageType === 'error' ? (
                            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                        ) : (
                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {/* UPLOAD WRAPPER CONTAINER */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-1">
                    <UploadBox
                        files={files}
                        onFileChange={handleFileChange}
                        onUpload={handleUpload}
                        uploading={uploading}
                        onRemoveFile={handleRemoveFile}
                        remainingCredits={credits}
                        isUploadDisable={isUploadDisable}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Upload;