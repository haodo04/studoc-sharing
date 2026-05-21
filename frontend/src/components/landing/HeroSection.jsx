import { assets } from "../../assets/assets.js";
import { useClerk, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const HeroSection = () => {
    const { openSignIn, openSignUp } = useClerk();
    const { user } = useUser(); // Chỉ dùng để lấy thông tin tên hiển thị
    const navigate = useNavigate();

    // Hàm xử lý mở modal đăng ký (khi CHƯA đăng nhập)
    const handleSignUpClick = () => {
        openSignUp({
            afterSignUpUrl: "/",
            afterSignInUrl: "/",
            redirectUrl: "/"
        });
    };

    // Hàm xử lý mở modal đăng nhập (khi CHƯA đăng nhập)
    const handleSignInClick = () => {
        openSignIn({
            afterSignInUrl: "/",
            afterSignUpUrl: "/",
            redirectUrl: "/"
        });
    };

    return (
        <div className="landing-page-content relative overflow-hidden bg-white pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
            
            {/* THANH HEADER NỔI Ở TRÊN CÙNG */}
            <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight">
                    <span className="p-2 bg-indigo-600 rounded-lg text-white text-sm w-8 h-8 flex items-center justify-center">S</span>
                    <span>StudocShare</span>
                </div>

                {/* Khu vực Auth: Sử dụng thẻ quản lý trực tiếp của Clerk */}
                <div className="flex items-center gap-4">
                    {/* TRẠNG THÁI 1: CHƯA ĐĂNG NHẬP (Session hết hạn hoặc chưa đăng nhập) */}
                    <SignedOut>
                        <button 
                            onClick={handleSignInClick}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                        >
                            <LogIn size={16} className="text-slate-500" />
                            <span>Sign In</span>
                        </button>
                    </SignedOut>

                    {/* TRẠNG THÁI 2: ĐÃ ĐĂNG NHẬP (Tài khoản được lưu hoặc vừa login thành công) */}
                    <SignedIn>
                        <div className="flex items-center gap-3 bg-slate-100/80 backdrop-blur-sm border border-slate-200/50 py-1.5 px-3 rounded-full shadow-sm">
                            <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                                Hi, <span className="font-semibold text-indigo-600">{user?.firstName || user?.fullName || "User"}</span>
                            </span>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </header>

            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-60 -left-20 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* NỘI DUNG CHÍNH Ở GIỮA */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl leading-none">
                        <span className="block mb-2">Share Files Securely with</span>
                        <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                            CloudShare
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-500 sm:text-xl md:mt-6">
                        Upload, manage, and share your files securely. Accessible anywhere, anytime. Experienced academic space built for modern workflows.
                    </p>
                    
                    <div className="mt-10 flex justify-center">
                        {/* Kiểm soát nút bấm lớn bằng cơ chế an toàn của Clerk */}
                        <SignedOut>
                            <button 
                                onClick={handleSignUpClick}
                                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </SignedOut>

                        <SignedIn>
                            <button 
                                onClick={() => navigate("/dashboard")}
                                className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5"
                            >
                                Go to Dashboard
                            </button>
                        </SignedIn>
                    </div>
                </div>

                {/* Preview Ảnh */}
                <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-slate-100 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-sm animate-fade-in-up">
                    <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-inner">
                        <img 
                            src={assets.dashboard} 
                            alt="cloud share dashboard" 
                            className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;