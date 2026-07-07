import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { 
  getAdminDocuments, 
  toggleAdminDocumentVisibility, 
  deleteAdminDocument 
} from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';

const AdminDocuments = () => {
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await getAdminDocuments(token);
      setDocuments(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài liệu", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const token = await getToken();
      await toggleAdminDocumentVisibility(id, token);
      setDocuments(documents.map(doc => 
        doc.id === id ? { ...doc, isPublic: !doc.isPublic } : doc
      ));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hiển thị", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái hiển thị.");
    }
  };

  const confirmDelete = (doc) => {
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = await getToken();
      await deleteAdminDocument(documentToDelete.id, token);
      
      setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu", error);
      alert("Đã xảy ra lỗi khi xóa tài liệu. Tài liệu này có thể đã bị xóa trước đó.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    (doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (doc.uploaderName && doc.uploaderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (doc.subjectName && doc.subjectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Quản lý tài liệu
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Kiểm duyệt, quản lý hiển thị và xóa tài liệu đã tải lên.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tài liệu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Thông tin tài liệu</th>
                <th className="px-6 py-4 font-medium">Người tải lên</th>
                <th className="px-6 py-4 font-medium text-center">Lượt xem / Tải</th>
                <th className="px-6 py-4 font-medium text-center">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không tìm thấy tài liệu nào.</td>
                </tr>
              ) : filteredDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 line-clamp-1" title={doc.title}>
                        {doc.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                          {doc.type?.replace('.', '').toUpperCase() || 'FILE'}
                        </span>
                        <span className="truncate max-w-[150px]">{doc.subjectName}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{doc.uploaderName}</span>
                      <span className="text-xs text-slate-500">{doc.uploaderEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-slate-700">{doc.viewCount} lượt xem</span>
                      <span className="text-xs text-slate-500">{doc.downloadCount} lượt tải</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {doc.isPublic ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <Eye size={14} />
                        Công khai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <EyeOff size={14} />
                        Đã ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <a 
                        href={doc.fileLocation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Xem tài liệu"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => handleToggleVisibility(doc.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          doc.isPublic 
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        }`}
                        title={doc.isPublic ? "Ẩn tài liệu" : "Công khai tài liệu"}
                      >
                        {doc.isPublic ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => confirmDelete(doc)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa tài liệu"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Xóa tài liệu?</h3>
            </div>
            
            <p className="text-slate-600 mb-2">
              Bạn có chắc chắn muốn xóa tài liệu <strong>"{documentToDelete?.title}"</strong> không?
            </p>
            <p className="text-sm text-red-500 font-medium mb-6">
              Hành động này là XÓA CỨNG (Hard Delete). Tài liệu sẽ bị xóa vĩnh viễn khỏi Database và Cloudinary, không thể khôi phục!
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa vĩnh viễn'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;