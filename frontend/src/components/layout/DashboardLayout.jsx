import { useUser } from "@clerk/clerk-react";
import SideMenu from "../common/SideMenu";
import NavbarPage from "../common/NavbarPage";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useUser();
  
return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col w-full">
      <NavbarPage activeMenu={activeMenu}/>
      
      {user && (
        <div className="w-full flex grow">
          
          <div className="max-[1080px]:hidden shrink-0 w-64">
            <SideMenu activeMenu={activeMenu}/>
          </div>
          <div className="grow w-full bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm min-h-[calc(100vh-7rem)]">
            {children}
          </div>
          
        </div>
      )}
    </div>
  );
};


export default DashboardLayout;