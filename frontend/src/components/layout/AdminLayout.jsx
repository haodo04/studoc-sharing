import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { useUser } from '@clerk/clerk-react';

const AdminLayout = ({ children }) => {
  const { isLoaded, user } = useUser();

  // Temporary pseudo-protection: 
  // Normally you would check user.publicMetadata.role === 'admin' 
  // but for now we just render it since we haven't set up roles yet.
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans text-slate-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
