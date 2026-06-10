import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import NavbarPage from "../../components/common/NavbarPage";
import apiEndpoints from "../../api/apiEndpoint";
import { useUserCredits } from "../../context/UserCreditsContext";

export default function UploadPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { fetchUserCredits } = useUserCredits();
  const [dbUniversities, setDbUniversities] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // State quản lý form dữ liệu khớp chuẩn 100% với các trường hiển thị của FileMetadataDocument
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    universityId: "",
    categoryId: "",
    subjectCode: "",
    subjectName: "",
    docType: "Đề thi", // Mặc định chọn Đề thi
    creditCost: 0,
    isPublic: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phân loại tài liệu học tập theo quy ước của db docType
  const documentTypes = ["Đề thi", "Bài tập", "Bài giảng", "Tóm tắt"];

  const [customUniversity, setCustomUniversity] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [uniRes, catRes] = await Promise.all([
          axios.get(apiEndpoints.GET_UNIVERSITIES),
          axios.get(apiEndpoints.GET_CATEGORIES),
        ]);
        setDbUniversities(uniRes.data || []);
        setDbCategories(catRes.data || []);
      } catch (error) {
        console.error("Lỗi khi tải metadata học thuật:", error);
        toast.error("Không thể load danh sách trường học và chuyên ngành!");
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  // Xử lý thay đổi dữ liệu đầu vào
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedExtensions = /(\.pdf|\.doc|\.docx|\.ppt|\.pptx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast.error(
        "Hệ thống chỉ hỗ trợ định dạng file PDF, Word hoặc PowerPoint!",
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("Dung lượng file tối đa cho phép là 25MB!");
      return;
    }

    setSelectedFile(file);

    if (!formData.title) {
      const fileNameWithoutExt =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setFormData((prev) => ({ ...prev, title: fileNameWithoutExt }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Vui lòng chọn hoặc kéo thả tệp tin tài liệu!");
      return;
    }
    if (!formData.universityId || !formData.categoryId) {
      toast.error("Vui lòng chọn đầy đủ Trường học và Chuyên ngành!");
      return;
    }
    if (formData.universityId === "OTHER" && !customUniversity.trim()) {
      toast.error("Vui lòng nhập tên Trường Đại học của bạn!");
      return;
    }
    if (formData.categoryId === "OTHER" && !customCategory.trim()) {
      toast.error("Vui lòng nhập tên Chuyên ngành của bạn!");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Đang xử lý và tải file lên...");

    try {
      const token = await getToken();
      const sendData = new FormData();
      sendData.append("files", selectedFile);

      const metadata = {
        title: formData.title,
        description: formData.description,

        universityId: formData.universityId,
        customUniversity:
          formData.universityId === "OTHER_UNI"
            ? customUniversity.trim()
            : null,

        categoryId: formData.categoryId,
        customCategory:
          formData.categoryId === "OTHER_CAT" ? customCategory.trim() : null,

        subjectCode: formData.subjectCode
          ? formData.subjectCode.toUpperCase()
          : "CHƯA_CÓ",
        subjectName: formData.subjectName,
        docType: formData.docType,
        creditCost: parseInt(formData.creditCost) || 0,
        isPublic: formData.isPublic,
      };

      sendData.append("metadata", JSON.stringify(metadata));

      const response = await axios.post(apiEndpoints.UPLOAD_FILE, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        await fetchUserCredits();
        toast.success(
          "Đăng tải tài liệu thành công! Bạn nhận được +2 Xu đóng góp.",
          { id: toastId },
        );
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Lỗi hệ thống khi truyền tải tệp tin!",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <NavbarPage />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* CỘT TRÁI: KHU VỰC HƯỚNG DẪN QUY ĐỊNH (Chiếm 4/12 cột) */}
          <div className="lg:col-span-4 bg-slate-900 text-slate-200 p-6 lg:p-8 flex flex-col justify-between border-r border-slate-800">
            <div className="space-y-6">
              <div>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider block mb-1">
                  Studocu Share platform
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Quy trình upload chuẩn
                </h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Nhập chính xác thông tin môn học giúp học liệu của bạn tiếp
                  cận đúng các sinh viên cùng khóa và tăng lượt tải kiếm xu hiệu
                  quả.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                    1
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Mã môn học:</strong> Giúp
                    định danh chính xác (Ví dụ môn Giải tích 1 của HUST là
                    MI1110, NEU là KHME1105).
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                    2
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Phân loại (DocType):</strong>{" "}
                    Giúp hệ thống sắp xếp tài liệu vào đúng Tab Đề thi, Slide
                    bài giảng hoặc Đề cương tóm tắt.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                    3
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Đặt giá tải file:</strong>{" "}
                    Đặt giá xu từ 0 - 100 Xu. Khi sinh viên khác tải xuống, ví
                    xu của bạn sẽ tự động cộng tiền.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 bg-slate-800/50 border border-slate-800 p-4 rounded-xl mt-8 text-[11px] text-slate-400 leading-relaxed">
              <AlertCircle
                size={16}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <span>
                Hệ thống sẽ tự động phân tích cấu trúc của file để trích xuất dữ
                liệu số trang, dung lượng và định dạng file.
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: KHU VỰC ĐIỀN FORM RỘNG RÃI (Chiếm 8/12 cột) */}
          <form
            onSubmit={handleFormSubmit}
            className="lg:col-span-8 p-6 lg:p-8 space-y-6"
          >
            {/* 1. KHU VỰC CHỌN/KÉO THẢ TỆP TIN */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                Tệp tin đính kèm
              </label>
              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files[0])
                      handleFileChange(e.dataTransfer.files[0]);
                  }}
                  onClick={() => document.getElementById("file-picker").click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    isDragging
                      ? "border-indigo-600 bg-indigo-50/40"
                      : "border-slate-300 hover:border-indigo-500 hover:bg-slate-50/30"
                  }`}
                >
                  <input
                    id="file-picker"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                  <UploadCloud size={28} className="text-indigo-500" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-800">
                      Chọn tệp tin học liệu hoặc kéo thả trực tiếp
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hỗ trợ PDF, DOCX, PPTX (Dung lượng tối đa 25MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/30 p-3.5 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Tiêu đề tài liệu hiển thị
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Đề thi cuối kỳ môn Giải tích 1 năm học 2024 - K67..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Mô tả tóm tắt nội dung
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm thông tin (Ví dụ: Đề thi có kèm đáp án chi tiết ở trang cuối, tài liệu gồm 4 câu tự luận...)"
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Thuộc Trường Đại học (`University`)
                </label>
                <select
                  name="universityId"
                  value={formData.universityId}
                  onChange={handleInputChange}
                  disabled={isLoadingMetadata}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer transition-all disabled:opacity-60"
                  required
                >
                  <option value="">
                    {isLoadingMetadata
                      ? "-- Đang tải trường học... --"
                      : "-- Chọn trường đại học liên kết --"}
                  </option>
                  {dbUniversities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} {uni.shortName ? `(${uni.shortName})` : ""}
                    </option>
                  ))}
                  <option value="OTHER_UNI">
                    Khác... (Tự nhập trường của bạn)
                  </option>
                </select>
                {formData.universityId === "OTHER_UNI" && (
                  <input
                    type="text"
                    placeholder="Nhập tên Trường Đại học của bạn..."
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    className="w-full text-xs px-3 py-2 mt-2 border border-amber-300 bg-amber-50/20 rounded-xl focus:outline-none focus:border-amber-500 placeholder:text-slate-400 transition-all animate-fadeIn"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Chuyên ngành học (`major`)
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  disabled={isLoadingMetadata}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer transition-all disabled:opacity-60"
                  required
                >
                  <option value="">
                    {isLoadingMetadata
                      ? "-- Đang tải chuyên ngành... --"
                      : "-- Chọn ngành phân loại --"}
                  </option>
                  {dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="OTHER_CAT">
                    Khác... (Tự nhập chuyên ngành)
                  </option>
                </select>
                {formData.categoryId === "OTHER_CAT" && (
                  <input
                    type="text"
                    placeholder="Nhập tên chuyên ngành học khác..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 mt-2 border border-amber-300 bg-amber-50/20 rounded-xl focus:outline-none focus:border-amber-500 placeholder:text-slate-400 transition-all animate-fadeIn"
                  />
                )}
              </div>
            </div>

            {/* 4. KHU VỰC ĐỊNH DANH MÔN HỌC CHI TIẾT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Mã học phần (`subjectCode`)
                </label>
                <input
                  type="text"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: MI1110"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase placeholder:normal-case font-semibold"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Tên môn học cụ thể (`subjectName`)
                </label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giải tích 1, Lập trình hướng đối tượng..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* 5. CẤU HÌNH PHÂN LOẠI FILE & GIÁ BÁN XU */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                  Loại tài liệu (`docType`)
                </label>
                <select
                  name="docType"
                  value={formData.docType}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer transition-all font-medium"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide flex justify-between">
                  <span>Giá tài liệu (`creditCost`)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    name="creditCost"
                    min="0"
                    max="100"
                    value={formData.creditCost}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl pl-3 pr-12 py-2 text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-800"
                  />
                  <div className="absolute right-3 text-[10px] font-bold text-slate-400 select-none">
                    Xu
                  </div>
                </div>
              </div>

              <div className="flex items-center pt-4 sm:pt-5 pl-1">
                <label className="relative flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Chế độ Công khai
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Hiển thị toàn bộ web (`Public`)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ACTION FOOTER BUTTONS */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Đang tải lên..." : "Xác nhận Tải lên"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
