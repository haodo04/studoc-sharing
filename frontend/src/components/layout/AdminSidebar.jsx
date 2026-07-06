import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Library, 
  ShieldAlert, 
  CreditCard,
  Settings,
  Tag,
  MessageSquare,
  BrainCircuit
} from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Documents', path: '/admin/documents' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: MessageSquare, label: 'Community', path: '/admin/community' },
    { icon: BrainCircuit, label: 'AI Tracking', path: '/admin/ai-tracking' },
    { icon: ShieldAlert, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-xl font-bold text-slate-800">Studoc Admin</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-400 text-center">
          Studoc Admin &copy; 2026
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
