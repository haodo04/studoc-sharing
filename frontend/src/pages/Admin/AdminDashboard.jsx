import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CreditCard, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getDashboardStats } from '../../api/adminApi';
import { useAuth } from '@clerk/clerk-react';

const AdminDashboard = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    recentUploads: [],
    userGrowth: [],
    documentsByCategory: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải số liệu thống kê admin", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return '0đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const statCards = [
    { title: 'Tổng người dùng', value: stats.totalUsers.toLocaleString('vi-VN'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Tổng tài liệu', value: stats.totalDocuments.toLocaleString('vi-VN'), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Tải lên gần đây', value: stats.recentUploads.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  if (loading) {
    return <div className="flex h-full items-center justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1 text-sm">Chào mừng trở lại, đây là tình hình hoạt động hôm nay.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          Xuất báo cáo
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Tăng trưởng người dùng</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line type="monotone" dataKey="value" name="Người dùng" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Tài liệu theo danh mục</h3>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.documentsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.documentsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 max-h-24 overflow-y-auto">
            {stats.documentsByCategory.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-600 truncate" title={entry.name}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Tài liệu tải lên gần đây</h3>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-3 font-medium">Thông tin tài liệu</th>
                <th className="px-6 py-3 font-medium">Danh mục</th>
                <th className="px-6 py-3 font-medium">Thời gian</th>
                <th className="px-6 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentUploads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Chưa có tài liệu nào được tải lên.</td>
                </tr>
              ) : stats.recentUploads.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText size={20} />
                      </div>
                      <span className="max-w-[250px] truncate" title={doc.title}>{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 truncate max-w-[150px] block">
                      {doc.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors" title="Xem trước">
                        <Eye size={18} />
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

export default AdminDashboard;