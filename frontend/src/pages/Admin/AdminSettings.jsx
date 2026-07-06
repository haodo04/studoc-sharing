import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { settingApi } from '../../api/settingApi';
import { toast } from 'react-hot-toast';
import { Save, Megaphone, Palette, SunMoon, Type, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function AdminSettings() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    bannerEnabled: false,
    bannerMessage: '',
    bannerColor: 'blue',
    bannerLink: ''
  });

  // Dark mode is handled by adding 'dark' class to html root
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('adminDarkMode') === 'true';
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adminDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adminDarkMode', 'false');
    }
  }, [isDarkMode]);

  const fetchSettings = async () => {
    try {
      const data = await settingApi.getSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();
      await settingApi.updateSettings(settings, token);
      toast.success('Lưu cài đặt thành công! Tải lại trang để xem Banner.');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cài đặt hệ thống</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Quản lý các cấu hình hiển thị và hoạt động của website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Dark Mode Config (Frontend Only) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <SunMoon size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Giao diện Admin</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Chế độ ban đêm (Dark Mode)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Giảm mỏi mắt khi làm việc ban đêm</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDarkMode} 
                  onChange={(e) => setIsDarkMode(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Global Banner Config */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Megaphone size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Banner Thông báo (Global Banner)</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="bannerEnabled"
                checked={settings.bannerEnabled} 
                onChange={handleChange} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
            </label>
          </div>
          
          <div className={`space-y-4 transition-all ${!settings.bannerEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                <Type size={16} /> Nội dung thông báo
              </label>
              <input 
                type="text" 
                name="bannerMessage"
                value={settings.bannerMessage}
                onChange={handleChange}
                placeholder="VD: Hệ thống sẽ bảo trì vào 12h đêm nay..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Palette size={16} /> Màu sắc (Theme)
                </label>
                <select 
                  name="bannerColor"
                  value={settings.bannerColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none"
                >
                  <option value="blue">Xanh dương (Thông tin)</option>
                  <option value="red">Đỏ (Cảnh báo)</option>
                  <option value="yellow">Vàng (Lưu ý)</option>
                  <option value="emerald">Xanh ngọc (Thành công)</option>
                  <option value="indigo">Tím (Sự kiện/Khuyến mãi)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <LinkIcon size={16} /> Đường dẫn liên kết (Tùy chọn)
                </label>
                <input 
                  type="text" 
                  name="bannerLink"
                  value={settings.bannerLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
