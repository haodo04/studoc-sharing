import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { FileText, Coins, Sparkles, Upload, UploadIcon } from 'lucide-react'; 
import { useUserCredits } from '../../context/UserCreditsContext';

const NavbarPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { credits } = useUserCredits();

  const getTabClass = (tabName, isPremium = false) => {
    if (isPremium) {
      return "text-amber-600 hover:text-amber-700 cursor-pointer transition-colors flex items-center gap-1 text-[13px] font-bold";
    }

    const baseClass = "cursor-pointer transition-colors border-b-2 py-5 text-[13px] font-bold";
    let isActive = false;

    if (tabName === 'trang-chu') {
      isActive = currentPath === '/home' || currentPath === '/explore';
    } else if (tabName === 'tai-lieu') {
      isActive = currentPath.startsWith('/document/');
    } else if (tabName === 'subscriptions') {
      isActive = currentPath === '/subscriptions';
    }

    if (isActive) {
      return `${baseClass} text-indigo-600 border-indigo-600`;
    }
    return `${baseClass} text-slate-600 border-transparent hover:text-indigo-600 hover:border-indigo-600`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div onClick={() => navigate('/home')} className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
            <FileText className="text-white stroke-[2.2]" size={19} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
            Studoc<span className="text-indigo-600">Share</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold">
          <span 
            onClick={() => navigate('/home')} 
            className={getTabClass('trang-chu')}
          >
            Trang chủ
          </span>

          <span 
            className={getTabClass('tai-lieu')}
            onClick={() => { if (!currentPath.startsWith('/document/')) navigate('/home'); }}
          >
            Tài liệu
          </span>

          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors py-5 border-b-2 border-transparent hover:border-indigo-600">
            Cộng đồng
          </span>

          <span className="text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors py-5 border-b-2 border-transparent hover:border-indigo-600">
            Bảng xếp hạng
          </span>

          <span 
            onClick={() => navigate('/subscriptions')} 
            className={getTabClass('subscriptions', true)}
          >
            <Sparkles className="w-4 h-4" /> Premium
          </span>
        </nav>

        <div className="flex items-center gap-4">
          
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-indigo-100 active:scale-95 transition-all duration-150"
          >
            <UploadIcon size={14} className="stroke-[2.5]" />
            <span>Tải lên</span>
          </button>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full shadow-sm">
            <Coins className="text-amber-500 fill-amber-400" size={16} />
            <span className="text-xs font-bold text-amber-700 tracking-wide">
              {credits ?? 0} Xu
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="hover:scale-105 transition-transform duration-200">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default NavbarPage;