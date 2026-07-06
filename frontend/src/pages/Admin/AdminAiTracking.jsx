import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { BrainCircuit, MessageSquare, FileText, LayoutList, Layers, TrendingUp } from 'lucide-react';
import { getAiStats, getAiLogs } from '../../api/aiTrackingApi';

export default function AdminAiTracking() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const [statsData, logsData] = await Promise.all([
        getAiStats(token),
        getAiLogs(token, 0, 50)
      ]);
      setStats(statsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to fetch AI tracking data', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = (type) => {
    switch (type) {
      case 'SUMMARY': return { icon: <FileText size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Tóm tắt' };
      case 'CONCEPTS': return { icon: <LayoutList size={16} />, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Khái niệm' };
      case 'FLASHCARD': return { icon: <Layers size={16} />, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Flashcard' };
      case 'CHAT': return { icon: <MessageSquare size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Chat' };
      default: return { icon: <BrainCircuit size={16} />, color: 'text-slate-600', bg: 'bg-slate-100', label: 'Khác' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-indigo-600" /> Quản lý AI Studio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Theo dõi mức độ sử dụng trợ lý AI trên toàn hệ thống</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng Request Hôm Nay</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.requestsToday}</h3>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Tổng số request từ trước tới nay: <span className="font-bold">{stats.totalRequests}</span>
            </div>
          </div>

          <StatCard icon={<FileText />} label="Tóm tắt" value={stats.summaryRequests} color="emerald" />
          <StatCard icon={<LayoutList />} label="Khái niệm" value={stats.conceptsRequests} color="blue" />
          <StatCard icon={<Layers />} label="Flashcard" value={stats.flashcardRequests} color="amber" />
          <StatCard icon={<MessageSquare />} label="Trò chuyện" value={stats.chatRequests} color="indigo" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Lịch sử truy vấn AI (50 logs gần nhất)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-3 font-medium">Thời gian</th>
                <th className="px-6 py-3 font-medium">Người dùng</th>
                <th className="px-6 py-3 font-medium">Hành động</th>
                <th className="px-6 py-3 font-medium">Chi tiết</th>
                <th className="px-6 py-3 font-medium">Tài liệu</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Chưa có dữ liệu sử dụng AI.</td>
                </tr>
              ) : (
                logs.map((log) => {
                  const conf = getActionConfig(log.actionType);
                  return (
                    <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(log.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit', minute: '2-digit',
                          day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{log.userFullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${conf.bg} ${conf.color}`}>
                          {conf.icon}
                          {conf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {log.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className="truncate max-w-[200px] inline-block text-slate-600 dark:text-slate-300">
                          {log.documentTitle}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800'
  };
  
  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} shadow-sm flex flex-col justify-center items-center text-center`}>
      <div className="mb-2 opacity-80">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide opacity-80 mt-1">{label}</div>
    </div>
  );
}
