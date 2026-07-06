import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Unlock
} from 'lucide-react';
import { getAdminUsers, toggleUserBan } from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';

const AdminUsers = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = await getAdminUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (clerkId) => {
    try {
      const token = await getToken();
      await toggleUserBan(clerkId, token);
      // Update local state to reflect change without full refetch
      setUsers(users.map(u => 
        u.clerkId === clerkId ? { ...u, banned: !u.banned } : u
      ));
    } catch (error) {
      console.error("Failed to toggle user ban status", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái người dùng.");
    }
  };

  const filteredUsers = users.filter(user => 
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-blue-600" />
            User Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage user accounts and access permissions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">User Info</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-center">Uploads</th>
                <th className="px-6 py-4 font-medium text-center">Downloads</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.clerkId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.photoUrl || "https://ui-avatars.com/api/?name=" + user.fullName} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{user.fullName || 'Unnamed User'}</div>
                        <div className="text-slate-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {user.totalUploads}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {user.totalDownloads}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.banned ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <ShieldAlert size={14} />
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <ShieldCheck size={14} />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleBan(user.clerkId)}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                          user.banned 
                          ? 'text-emerald-600 hover:bg-emerald-50' 
                          : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={user.banned ? "Unban User" : "Ban User"}
                      >
                        {user.banned ? <Unlock size={18} /> : <Ban size={18} />}
                        <span className="hidden lg:inline">{user.banned ? "Unban" : "Ban"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
