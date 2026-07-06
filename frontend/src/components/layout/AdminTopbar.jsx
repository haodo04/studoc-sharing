import React from 'react';
import { Bell } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

const AdminTopbar = () => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10 transition-colors">
      {/* Motivational Slogan */}
      <div className="flex-1 flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <span className="font-medium text-sm md:text-base">
          Hôm nay cũng sẽ là một ngày thật năng suất
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Bell size={20} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
        
        {/* Clerk User Button */}
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 border border-slate-200"
            }
          }}
        />
      </div>
    </header>
  );
};

export default AdminTopbar;
