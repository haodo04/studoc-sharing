import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CTASection = ({ openSignUp }) => {
    const { isSignIn } = useUser();
    const navigate = useNavigate();

    const handleCtaClick = () => {
        if (isSignIn) {
            navigate("/dashboard");
        } else {
            openSignUp({
                afterSignUpUrl: "/",
                afterSignInUrl: "/",
                redirectUrl: "/"
            });
        }
    };

    return (
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span className="block mb-1">Ready to get started?</span>
                    <span className="block bg-gradient-to-r from-indigo-300 to-teal-300 bg-clip-text text-transparent">
                        Create your account today.
                    </span>
                </h2>
                <div className="mt-10 lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-xl shadow-md">
                        <button 
                            onClick={handleCtaClick}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-indigo-950 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-xl shadow-black/10 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            {isSignIn ? "Go to Dashboard" : "Sign up for free"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CTASection;