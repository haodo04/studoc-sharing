import { SIDE_MENU_DATA } from "../../assets/data";
import { useUser } from "@clerk/clerk-react";
import { User, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; 

const SideMenu = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <div className="w-64 h-[calc(100vh-73px)] bg-slate-900 border-r border-slate-800 p-5 sticky top-[73px] z-20 flex flex-col justify-between text-slate-300">
      
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-3 py-4 bg-slate-950/40 border border-slate-800/60 rounded-xl shadow-inner">
          {user?.imageUrl ? (
            <img
              src={user?.imageUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-indigo-500/50 object-cover shadow-md"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <User className="w-8 h-8 text-slate-400" />
            </div>
          )}
          <div className="text-center">
            <h5 className="text-sm font-semibold text-white tracking-wide truncate max-w-[200px]">
              {user?.fullName || "Học viên"}
            </h5>
            <span className="text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-900 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
              Thành viên chính thức
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {SIDE_MENU_DATA && SIDE_MENU_DATA.map((item) => {
            const isActive = location.pathname === item.path;
            
            const IconComponent = item.icon;

            return (
              <button
                key={item.id} 
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between gap-4 text-xs font-medium py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20 font-semibold"
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`}>
                    {IconComponent && <IconComponent size={16} />} 
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={12} className="text-indigo-200" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-4">
        Studoc Share v2.0 • Pro SaaS
      </div>
    </div>
  );
};

export default SideMenu;