import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  AlertTriangle,
  Star,
  HelpCircle
} from 'lucide-react';
import { 
  getAdminCommunityActivities, 
  deleteAdminCommunityActivity 
} from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';

const AdminCommunity = () => {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); 
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await getAdminCommunityActivities(token);
      setActivities(data);
    } catch (error) {
      console.error("Lỗi khi tải hoạt động cộng đồng", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = await getToken();
      await deleteAdminCommunityActivity(activityToDelete.type, activityToDelete.id, token);
      
      if (activityToDelete.type === 'COMMENT') {
        setActivities(activities.filter(a => a.id !== activityToDelete.id));
      } else {
        setActivities(activities.map(a => 
          a.id === activityToDelete.id ? { ...a, isDeleted: true } : a
        ));
      }
      
      setShowDeleteModal(false);
      setActivityToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa nội dung", error);
      alert("Đã xảy ra lỗi khi xóa nội dung này.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredActivities = activities.filter(a => {
    const matchesSearch = 
      (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (a.authorName && a.authorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.documentTitle && a.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesFilter = filterType === 'ALL' || a.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-blue-600" />
            Quản lý cộng đồng
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Theo dõi đánh giá và thảo luận hỏi đáp của người dùng.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="ALL">Tất cả loại</option>
            <option value="COMMENT">Đánh giá (Bình luận)</option>
            <option value="DISCUSSION">Hỏi đáp (Thảo luận)</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm nội dung hoặc người dùng..." 
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
                <th className="px-6 py-4 font-medium w-1/4">Người dùng & Ngày</th>
                <th className="px-6 py-4 font-medium w-1/6">Loại / Đối tượng</th>
                <th className="px-6 py-4 font-medium w-1/2">Nội dung</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Không có hoạt động cộng đồng nào.</td>
                </tr>
              ) : filteredActivities.map((activity) => (
                <tr key={activity.id} className={`border-b border-slate-100 transition-colors ${activity.isDeleted ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                        {activity.authorPhotoUrl ? (
                          <img src={activity.authorPhotoUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {activity.authorName?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{activity.authorName}</div>
                        <div className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString('vi-VN')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    {activity.type === 'COMMENT' ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 w-max">
                          <Star size={12} className="fill-amber-500 text-amber-500" />
                          Đánh giá ({activity.rating}/5)
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[150px]" title={activity.documentTitle}>
                          Trên: {activity.documentTitle}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 w-max">
                          <HelpCircle size={12} />
                          Hỏi đáp
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[150px]" title={activity.documentTitle}>
                          Trên: {activity.documentTitle}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="text-slate-700 max-h-24 overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap text-sm leading-relaxed">
                      {activity.isDeleted ? (
                        <span className="italic text-slate-400">Nội dung này đã bị xóa (Ẩn mềm).</span>
                      ) : (
                        activity.content
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center justify-end">
                      {!activity.isDeleted && (
                        <button 
                          onClick={() => confirmDelete(activity)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa nội dung"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
              <h3 className="text-xl font-bold text-slate-800">Xóa nội dung?</h3>
            </div>
            
            <p className="text-slate-600 mb-2">
              Bạn có chắc chắn muốn xóa {activityToDelete?.type === 'COMMENT' ? 'đánh giá' : 'câu hỏi thảo luận'} này của <strong>{activityToDelete?.authorName}</strong> không?
            </p>
            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6 italic line-clamp-3">
              "{activityToDelete?.content}"
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
                    Đang xử lý...
                  </>
                ) : (
                  'Xóa nội dung'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default AdminCommunity;