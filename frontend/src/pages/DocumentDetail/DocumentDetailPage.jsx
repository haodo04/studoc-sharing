import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useAuth,
} from "@clerk/clerk-react";
import {
  Search,
  Sparkles,
  FileText,
  Download,
  Star,
  Clock,
  User,
  MapPin,
  Mail,
  ChevronRight,
  ShieldCheck,
  Share2,
  Bookmark,
  Flame,
  Layout,
  Eye,
  Lock,
  MessageSquare,
  Landmark,
  PenTool,
  Lightbulb,
  Unlock,
} from "lucide-react";

import { documentApi } from "../../api/documentApi";
import NavbarPage from "../../components/common/NavbarPage";
import { getCommentsByFileId } from "../../api/commentApi";
import DocumentHeaderInfo from "./components/DocumentHeaderInfo";
import DocumentPreview from "./components/DocumentPreview";
import RatingSection from "./components/RatingSection";
import DocumentCard from "../../components/common/DocumentCard";
import apiEndpoints from "../../api/apiEndpoint";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UserCreditsContext,
  useUserCredits,
} from "../../context/UserCreditsContext";

export default function DocumentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = "http://localhost:8080/api/v1.0";

  const [documentData, setDocumentData] = useState(null);
  const [relatedDocs, setRelatedDocs] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // kiểm tra trạng thái tài liệu mở khóa chưa
  const [hasUnlockedFull, setHasUnlockedFull] = useState(false);

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [favoriteFileIds, setFavoriteFileIds] = useState(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        const response = await axios.get(apiEndpoints.GET_FAVORITES, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const ids = response.data.map((f) => f.fileId);
          setFavoriteFileIds(new Set(ids));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      }
    };
    fetchFavorites();
  }, [isLoaded, isSignedIn, getToken]);

  const handleToggleFavorite = async (fileId) => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }
    try {
      const token = await getToken();
      const response = await axios.post(
        apiEndpoints.TOGGLE_FAVORITE(fileId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        const isFavorited = response.data;
        setFavoriteFileIds((prev) => {
          const newSet = new Set(prev);
          if (isFavorited) {
            newSet.add(fileId);
            toast.success("Đã thêm vào yêu thích");
          } else {
            newSet.delete(fileId);
            toast.success("Đã bỏ yêu thích");
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // hàm lấy danh sách bình luận
  const fetchComments = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      setIsLoadingComments(true);
      const data = await getCommentsByFileId(id);
      setCommentsList(data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách thảo luận từ server:", err);
    } finally {
      setIsLoadingComments(false);
    }
  }, [id]);

  // hàm chỉ tiết tài liệu
  const fetchDocumentDetails = useCallback(async () => {
    if (!id || id === "undefined") return;
    try {
      const token = isSignedIn ? await getToken() : null;
      const response = await documentApi.fetchDocumentDetails(id, token);
      if (response.status === 200 && response.data) {
        setDocumentData(response.data);
        setHasUnlockedFull(
          response.data.unlocked || response.data.purchased || false,
        );
      }
    } catch (err) {
      console.error("Lỗi khi làm mới chi tiết tài liệu:", err);
    }
  }, [id, isSignedIn, getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    const loadDocumentAndRelated = async () => {
      if (!id || id === "undefined") {
        console.error("Tham số id tài liệu trên thanh URL không hợp lệ:", id);
        setError("Mã tài liệu không hợp lệ.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = isSignedIn ? await getToken() : null;

        const [response] = await Promise.all([
          documentApi.fetchDocumentDetails(id, token),
          fetchComments(),
        ]);

        if (response.status === 200 && response.data) {
          setDocumentData(response.data);

          setHasUnlockedFull(
            response.data.unlocked || response.data.purchased || false,
          );

          if (response.data.comments) {
            setCommentsList(response.data.comments);
          }

          try {
            const relatedRes = await axios.get(
              `${BASE_URL}/files/${id}/related?limit=4`,
            );
            if (relatedRes.status === 200) {
              setRelatedDocs(relatedRes.data);
            }
          } catch (relError) {
            console.error("Không thể tải tài liệu liên quan:", relError);
          }
        } else {
          setError("Không tìm thấy thông tin tài liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tài liệu:", error);
        setError("Không thể kết nối tới máy chủ hoặc tài liệu không tồn tại.");
        setDocumentData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentAndRelated();
  }, [id, fetchComments, isLoaded, isSignedIn, getToken]);

  const { refreshCredits, fetchUserCredits } = useUserCredits();

  // const handleDownload = () => {
  //   if (!documentData) return;

  //   toast(
  //     (t) => (
  //       <div className="flex flex-col gap-2 p-1 text-xs">
  //         <p className="font-medium text-slate-700">
  //           Hệ thống sẽ trừ{" "}
  //           <span className="font-extrabold text-indigo-600">
  //             {documentData.creditCost ?? 0} Xu
  //           </span>{" "}
  //           trong tài khoản để tải xuống tài liệu này.
  //         </p>
  //         <div className="flex justify-end gap-2 mt-1">
  //           <button
  //             onClick={async () => {
  //               toast.dismiss(t.id);

  //               const downloadToastId = toast.loading(
  //                 "Đang chuẩn bị tệp tin...",
  //               );

  //               try {
  //                 const token = await getToken();

  //                 const response = await axios.get(
  //                   `${BASE_URL}/files/interaction/${id}/download`,
  //                   { headers: { Authorization: `Bearer ${token}` } },
  //                 );

  //                 const { downloadUrl, fileName } = response.data;

  //                 const fileResponse = await fetch(downloadUrl);

  //                 if (!fileResponse.ok) {
  //                   throw new Error(
  //                     `Không thể tải file từ máy chủ (HTTP ${fileResponse.status})`,
  //                   );
  //                 }

  //                 const blob = await fileResponse.blob();

  //                 if (blob.size === 0) {
  //                   throw new Error("File tải về bị lỗi, vui lòng thử lại!");
  //                 }

  //                 const blobUrl = window.URL.createObjectURL(blob);
  //                 const link = document.createElement("a");
  //                 link.href = blobUrl;
  //                 link.download = fileName;
  //                 link.style.display = "none";
  //                 document.body.appendChild(link);
  //                 link.click();
  //                 document.body.removeChild(link);
  //                 window.URL.revokeObjectURL(blobUrl);

  //                 toast.success("Tải tài liệu thành công!", {
  //                   id: downloadToastId,
  //                 });

  //                 await fetchUserCredits();
  //               } catch (err) {
  //                 console.error("Lỗi khi tải tài liệu:", err);

  //                 let customErrorMessage =
  //                   "Tải file thất bại hoặc tài khoản không đủ số dư!";

  //                 if (
  //                   err.response &&
  //                   (err.response.status === 401 || err.response.status === 403)
  //                 ) {
  //                   customErrorMessage =
  //                     "Phiên đăng nhập hết hạn hoặc bạn không có quyền tải file này. Vui lòng đăng nhập lại!";
  //                 } else if (err.message) {
  //                   customErrorMessage = err.message;
  //                 }

  //                 toast.error(customErrorMessage, { id: downloadToastId });
  //               }
  //             }}
  //             className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
  //           >
  //             Xác nhận trừ Xu
  //           </button>
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
  //           >
  //             Hủy
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //     {
  //       duration: 8000,
  //       icon: "💡",
  //       style: {
  //         borderRadius: "16px",
  //         background: "#ffffff",
  //         border: "1px solid #e2e8f0",
  //         boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  //         maxWidth: "360px",
  //       },
  //     },
  //   );
  // };
  // LUỒNG MỚI 1: Hàm kích hoạt trừ xu mở khóa tài liệu vĩnh viễn
  const onUnlockDocument = () => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để mở khóa tài liệu!");
      return;
    }
    if (!documentData) return;

    toast(
      (t) => (
        <div className="flex flex-col gap-2 p-1 text-xs">
          <p className="font-medium text-slate-700">
            Hệ thống sẽ khấu trừ{" "}
            <span className="font-extrabold text-indigo-500">
              {documentData.creditCost ?? 0} Xu
            </span>{" "}
            để mở khóa vĩnh viễn quyền tải & xem online toàn bộ tài liệu này.
          </p>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                const unlockToastId = toast.loading("Đang xử lý trừ xu...");

                try {
                  const token = await getToken();

                  await axios.post(
                    apiEndpoints.UNLOCK_FILE(id),
                    {},
                    { headers: { Authorization: `Bearer ${token}` } },
                  );

                  toast.success("Mở khóa tài liệu thành công!", {
                    id: unlockToastId,
                  });

                  setHasUnlockedFull(true);

                  if (refreshCredits) await refreshCredits();
                  else if (fetchUserCredits) await fetchUserCredits();

                  await fetchDocumentDetails();
                } catch (err) {
                  console.error("Lỗi khi mở khóa:", err);
                  let errMsg =
                    "Mở khóa thất bại hoặc tài khoản không đủ số dư!";
                  if (err.response?.data?.message)
                    errMsg = err.response.data.message;
                  toast.error(errMsg, { id: unlockToastId });
                }
              }}
              className="bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
            >
              Xác nhận mở khóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: {
          borderRadius: "16px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          maxWidth: "360px",
        },
      },
    );
  };

  // Hàm tải file miễn phí hoàn toàn sau khi đã mở khóa
  const handleDownload = async () => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng!");
      return;
    }
    // Nếu chưa mở khóa, chuyển hướng bắt người dùng mở khóa trước
    if (!hasUnlockedFull) {
      onUnlockDocument();
      return;
    }

    const downloadToastId = toast.loading("Đang chuẩn bị tệp tin tải xuống...");
    try {
      const token = await getToken();
      const response = await axios.get(
        `${BASE_URL}/files/interaction/${id}/download`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { downloadUrl, fileName } = response.data;
      const fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok)
        throw new Error(`Lỗi kết nối tệp tin (HTTP ${fileResponse.status})`);

      const blob = await fileResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || documentData.title || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Tải tài liệu thành công!", { id: downloadToastId });
    } catch (err) {
      console.error("Lỗi tải file:", err);
      toast.error(err.message || "Tải file thất bại!", { id: downloadToastId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-slate-500 font-medium text-sm">
          Đang tải dữ liệu tài liệu...
        </p>
      </div>
    );
  }

  if (error || !documentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
          {error || "Không tìm thấy tài liệu này!"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* HEADER STICKY */}
      <NavbarPage />

      {/* BREADCRUMBS */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-400 overflow-x-auto whitespace-nowrap">
          <span
            className="text-slate-600 hover:text-indigo-600 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Trang chủ
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">
            {documentData.categoryId === "OTHER_CAT"
              ? documentData.customCategory
              : documentData.categoryId || "Tài liệu"}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer">
            {documentData.universityId === "OTHER_UNI"
              ? documentData.customUniversity
              : documentData.universityId || "Các trường"}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 truncate">
            {documentData.subjectName || "Chưa phân loại"}
          </span>
        </div>
      </div>

      {/* BỐ CỤC CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Khối 1: Thông tin tiêu đề & Header */}
            <DocumentHeaderInfo
              documentData={documentData}
              isFavorited={favoriteFileIds.has(id)}
              onToggleFavorite={() => handleToggleFavorite(id)}
            />

            {/* Khối 2: Trình xem trước tài liệu */}
            {documentData && (
              <DocumentPreview
                documentData={documentData}
                handleDownload={handleDownload}
                hasUnlockedFull={hasUnlockedFull}
                onUnlockFull={onUnlockDocument}
              />
            )}

            {/* KHỐI MÔ TẢ NỘI DUNG */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase flex items-center gap-1.5 text-indigo-600">
                <PenTool className="w-4 h-4" /> Mô tả nội dung tài liệu
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {documentData.description ||
                  "Chưa có mô tả chi tiết cho tài liệu này."}
              </p>
            </div>

            <RatingSection
              fileId={id}
              onCommentSuccess={() => {
                fetchDocumentDetails();
                fetchComments();
              }}
            />
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-6">
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Chi phí tải
                  </div>
                  <div className="text-base font-extrabold tracking-tight text-emerald-400">
                    -{documentData.creditCost ?? 0} Xu
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Dung lượng
                  </div>
                  <div className="font-bold text-slate-200">
                    {typeof documentData.size === "number"
                      ? `${(documentData.size / 1024).toFixed(1)} KB`
                      : documentData.size || "N/A"}
                  </div>
                </div>
              </div>
              {hasUnlockedFull ? (
                <button
                  onClick={handleDownload}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold tracking-tight py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-xs md:text-sm flex justify-center items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Tải File Gốc Miễn Phí
                </button>
              ) : (
                <button
                  onClick={onUnlockDocument}
                  className="w-full bg-gradient-to-r bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold tracking-tight py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-xs md:text-sm flex justify-center items-center gap-2 uppercase text-center"
                >
                  <Unlock className="w-4 h-4" /> Mở Khóa Tài Liệu (
                  {documentData.creditCost ?? 0} Xu)
                </button>
              )}
              <p className="text-[10px] text-slate-500 text-center leading-normal">
                *Tài liệu sau khi dùng lượt tải về thành công sẽ nằm trong Tab
                Lịch sử để tải lại hoàn toàn miễn phí mãi mãi.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2.5 font-medium">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mã môn học:</span>
                <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                  {documentData.subjectCode || "Đang cập nhật"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Định dạng file:</span>
                <span className="text-slate-800 font-bold">
                  {(() => {
                    const mime = documentData.type?.toLowerCase() || "";
                    if (
                      mime.includes("word") ||
                      mime.includes("officedocument.wordprocessingml")
                    )
                      return "DOCX/DOC";
                    if (
                      mime.includes("presentation") ||
                      mime.includes("powerpoint")
                    )
                      return "PPTX/PPT";
                    if (mime.includes("pdf")) return "PDF";
                    if (mime.includes("zip") || mime.includes("rar"))
                      return "ZIP/RAR";
                    return documentData.docType?.toUpperCase() || "DOCUMENT";
                  })()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Chuyên mục:</span>
                <span className="text-slate-800 font-bold">
                  {documentData.subjectName || "Chưa phân loại"}
                </span>
              </div>
            </div>

            {/* THẢO LUẬN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 tracking-tight text-xs md:text-sm uppercase text-indigo-600 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Bình luận (
                {commentsList.length})
              </h3>

              {/* Giao diện danh sách các bình luận lấy từ cơ sở dữ liệu */}
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {isLoadingComments ? (
                  <p className="text-slate-400 text-center py-2 text-[11px]">
                    Đang tải danh sách thảo luận...
                  </p>
                ) : commentsList.length === 0 ? (
                  <p className="text-slate-400 text-center py-2 text-[11px]">
                    Chưa có bình luận nào. Hãy là người đầu tiên đánh giá và
                    thảo luận ở trên!
                  </p>
                ) : (
                  commentsList.map((comment) => (
                    <div
                      key={comment.id}
                      className="text-xs space-y-1 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={
                              comment.userPhotoUrl ||
                              "https://images.clerk-static.com/preview-placeholder.png"
                            }
                            alt={comment.userFullName}
                            className="w-5 h-5 rounded-full object-cover bg-slate-100"
                            onError={(e) => {
                              e.target.src =
                                "https://images.clerk-static.com/preview-placeholder.png";
                            }}
                          />
                          <span className="font-bold text-slate-800">
                            {comment.userFullName}
                          </span>
                          {/* Hiển thị số sao người này đã đánh giá */}
                          <span className="text-[10px] text-amber-500 font-semibold ml-1">
                            ★ {comment.rating}/5
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : "Vừa xong"}
                        </span>
                      </div>
                      <p className="text-slate-600 pl-6 font-normal leading-normal whitespace-pre-line">
                        {comment.content || (
                          <span className="text-slate-300 italic">
                            Chỉ đánh giá số sao
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TÀI LIỆU LIÊN QUAN */}
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-5">
          <div className="flex justify-between items-end">
            <h2 className="text-base md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5.5 bg-indigo-600 rounded-full"></span>{" "}
              Tài liệu cùng chuyên mục liên quan tốt nhất
            </h2>
          </div>

          {relatedDocs.length === 0 ? (
            <p className="text-slate-400 text-sm italic">
              Không có tài liệu liên quan nào khác cùng chuyên mục này.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedDocs.map((doc) => (
                <DocumentCard
                  key={doc.id || doc._id}
                  doc={doc}
                  isFavorited={favoriteFileIds.has(doc.id || doc._id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
        {/* ...Giữ nguyên cấu trúc footer sạch sẽ của bạn... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="p-1.5 bg-indigo-600 rounded-lg text-white text-xs w-7 h-7 flex items-center justify-center font-bold">
                S
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                StudocShare
              </span>
            </div>
            <p className="text-[12px] leading-relaxed font-medium text-slate-400">
              Sử mệnh của chúng tôi là xã hội hóa và tự do hóa tài liệu học tập,
              giúp sinh viên mọi miền tổ quốc tiếp cận tri thức chất lượng cao
              một cách bình đẳng và dễ dàng nhất.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              Tài liệu nổi bật
            </h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" /> Slide bài giảng
                mẫu
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" /> Đề cương ôn thi
                học phần
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" /> Đề thi mẫu cuối
                kỳ
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              Chính sách & Hỗ trợ
            </h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li className="hover:text-white cursor-pointer transition-colors">
                Điều khoản dịch vụ mở
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Bảo mật thông tin tài khoản
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Trung tâm trợ giúp
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              Thông tin Liên Hệ
            </h4>
            <ul className="space-y-2 text-[13px] font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" /> Địa chỉ:{" "}
                <span className="text-slate-300">Đại học Bách Khoa Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> Email:{" "}
                <span className="text-slate-300">support@studocshare.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
