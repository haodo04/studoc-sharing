import React, { useEffect, useState } from 'react';
import {
    Star,
    FileText,
    Image as ImageIcon,
    Folder,
    FileSpreadsheet,
    Loader2,
    FileIcon,
    Video,
    Music
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import apiEndpoints from '../../../api/apiEndpoint';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken, isLoaded, isSignedIn } = useAuth();

    const fetchFavorites = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(apiEndpoints.GET_FAVORITES, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setFavorites(response.data);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            toast.error("Lỗi khi tải danh sách yêu thích.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchFavorites();
        }
    }, [isLoaded, isSignedIn, getToken]);

    const handleToggleFavorite = async (fileId) => {
        try {
            const token = await getToken();
            const response = await axios.post(apiEndpoints.TOGGLE_FAVORITE(fileId), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const isFavorited = response.data;
                if (!isFavorited) {
                    toast.success("Đã xóa khỏi danh sách yêu thích");
                    setFavorites(prev => prev.filter(f => f.fileId !== fileId));
                } else {
                    toast.success("Đã thêm vào danh sách yêu thích");
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Có lỗi xảy ra khi cập nhật yêu thích.");
        }
    };

    const getFileIcon = (fileName) => {
        if (!fileName) return <FileIcon size={20} className="text-primary" />;
        const extension = fileName.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
            return <ImageIcon size={20} className="text-purple-500" />;
        }
        if (["mp4", "webm", "mav", "avi", "mkv"].includes(extension)) {
            return <Video size={20} className="text-blue-500" />;
        }
        if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
            return <Music size={20} className="text-green-500" />;
        }
        if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension)) {
            return <FileText size={20} className="text-amber-500" />;
        }
        return <FileIcon size={20} className="text-primary" />;
    };

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
            day: "numeric"
        });
    };

    // Truy cập nhanh (Có thể lấy 4 file yêu thích gần nhất)
    const quickAccessItems = favorites.slice(0, 4);

    return (
        <DashboardLayout activeMenu="Favorites">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
                <div className="max-w-container-max mx-auto w-full">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            Yêu thích
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-16">
                            <Loader2 className="animate-spin text-primary mb-4" size={32} />
                            <p className="text-on-surface-variant">Đang tải danh sách...</p>
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
                            <Star size={48} className="text-outline mb-4" />
                            <p className="font-headline-sm text-on-surface">Chưa có tài liệu yêu thích</p>
                            <p className="text-on-surface-variant text-sm mt-2">Hãy đánh dấu sao các tài liệu quan trọng để truy cập nhanh ở đây.</p>
                        </div>
                    ) : (
                        <>
                            {/* Quick Access Section */}
                            {quickAccessItems.length > 0 && (
                                <section className="mb-10">
                                    <h3 className="font-headline-md text-headline-md text-on-surface-variant mb-4">
                                        Đã lưu gần đây
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {quickAccessItems.map((item) => (
                                            <div
                                                key={item.favoriteId}
                                                className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:bg-surface-bright transition-colors cursor-pointer flex flex-col h-48 relative"
                                            >
                                                {/* Thumbnail / Image Area */}
                                                <Link to={`/file/${item.fileId}`} className="flex-1 bg-surface-container-low bg-cover bg-center relative block">
                                                    {item.file?.thumbnailUrl ? (
                                                        <div 
                                                            className="absolute inset-0 bg-cover bg-center"
                                                            style={{ backgroundImage: `url('${item.file.thumbnailUrl}')` }}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-surface-variant text-on-surface-variant">
                                                            {getFileIcon(item.file?.name)}
                                                        </div>
                                                    )}
                                                </Link>
                                                
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); handleToggleFavorite(item.fileId); }}
                                                    className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
                                                    title="Bỏ yêu thích"
                                                >
                                                    <Star size={16} className="text-primary" fill="currentColor" />
                                                </button>

                                                {/* Info Area */}
                                                <Link to={`/file/${item.fileId}`} className="p-4 border-t border-outline-variant bg-surface-container-lowest flex items-center gap-3 block">
                                                    <div className="flex items-center gap-3">
                                                        {getFileIcon(item.file?.name)}
                                                        <div className="min-w-0">
                                                            <p className="font-label-md text-label-md text-on-surface truncate" title={item.file?.title || item.file?.name}>
                                                                {item.file?.title || item.file?.name}
                                                            </p>
                                                            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                                                                Lưu lúc {formatDate(item.savedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* All Favorites List Section */}
                            <section>
                                <h3 className="font-headline-md text-headline-md text-on-surface-variant mb-4">
                                    Tất cả tệp
                                </h3>
                                {/* Table Header */}
                                <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-2 px-4">
                                    <span className="font-label-md text-label-md text-on-surface-variant w-1/2">
                                        Tên
                                    </span>
                                    <div className="flex w-1/2 justify-between">
                                        <span className="font-label-md text-label-md text-on-surface-variant hidden sm:block w-1/2">
                                            Ngày lưu
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface-variant w-1/2 text-right">
                                            Kích thước
                                        </span>
                                    </div>
                                </div>

                                {/* List Items */}
                                <div className="flex flex-col">
                                    {favorites.map((item) => (
                                        <div
                                            key={item.favoriteId}
                                            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface-container-low transition-colors group"
                                        >
                                            {/* Left Side: Icon + Name */}
                                            <div className="flex items-center gap-4 w-1/2 min-w-0">
                                                <button 
                                                    onClick={() => handleToggleFavorite(item.fileId)}
                                                    className="text-primary opacity-100 flex items-center hover:scale-110 transition-transform"
                                                    title="Bỏ yêu thích"
                                                >
                                                    <Star size={20} fill="currentColor" />
                                                </button>
                                                {getFileIcon(item.file?.name)}
                                                <Link to={`/file/${item.fileId}`} className="font-body-md text-body-md text-on-surface truncate hover:text-primary transition-colors block flex-1" title={item.file?.title || item.file?.name}>
                                                    {item.file?.title || item.file?.name}
                                                </Link>
                                            </div>

                                            {/* Right Side: Date & Size */}
                                            <div className="flex w-1/2 justify-between items-center pointer-events-none">
                                                <span className="font-body-md text-body-md text-on-surface-variant hidden sm:block w-1/2">
                                                    {formatDate(item.savedAt)}
                                                </span>
                                                <span className="font-body-md text-body-md text-on-surface-variant w-1/2 text-right">
                                                    {formatFileSize(item.file?.size)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                </div>
            </div>
        </DashboardLayout>
    );
};

export default FavoritesPage;