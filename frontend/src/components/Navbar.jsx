import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Menu, Share2, X, Coins } from "lucide-react";
import SideMenu from "./SideMenu";
import { UserCreditsContext } from "./context/UserCreditsContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { credits, fetchUserCredits } = useContext(UserCreditsContext);

  useEffect(() => {
    if (fetchUserCredits) {
      fetchUserCredits();
    }
  }, [fetchUserCredits]);

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-4 sm:px-7 sticky top-0 z-30 transition-all">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-5">
        
        {/* L- MENU MOBILE BUTTON & LOGO BRAND */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpenSideMenu(!openSideMenu)}
            className="block lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            {openSideMenu ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Share2 size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight block">
              Studoc<span className="text-indigo-600 font-medium">Share</span>
            </span>
          </Link>
        </div>

        {/* R- CREDITS BADGE & CLERK USER BUTTON */}
        <SignedIn>
          <div className="flex items-center gap-4">
            
            {/* UPGRADED COINS/CREDITS DISPLAY BADGE */}
            <Link to="/subscriptions">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/70 px-3.5 py-1.5 rounded-full shadow-sm transition-all duration-200 group active:scale-95">
                <Coins size={14} className="text-amber-500 group-hover:rotate-12 transition-transform stroke-[2.5]" />
                <span className="text-xs font-bold text-amber-700 font-mono">
                  {credits ?? 0}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider hidden sm:inline">
                  Credits
                </span>
              </div>
            </Link>

            {/* AVATAR USER CLERK */}
            <div className="relative p-0.5 rounded-full border border-slate-200 hover:border-indigo-500 transition-colors bg-slate-50 flex items-center justify-center">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonTrigger: "focus:shadow-none focus:outline-none",
                    avatarBox: "w-8 h-8 rounded-full"
                  }
                }}
              />
            </div>

          </div>
        </SignedIn>

      </div>

      {openSideMenu && (
        <div className="fixed top-[65px] left-0 right-0 bg-slate-900/40 backdrop-blur-sm h-[calc(100vh-65px)] lg:hidden z-20 animate-in fade-in duration-200">
          <div className="w-64 bg-white h-full border-r border-slate-200 shadow-xl animate-in slide-in-from-left duration-200">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setOpenSideMenu(false)} />
        </div>
      )}

    </div>
  );
};

export default Navbar;