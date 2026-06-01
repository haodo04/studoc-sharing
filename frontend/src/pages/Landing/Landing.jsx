import { features, pricingPlans, testimonials } from "../../assets/data";
import { useUser } from "@clerk/clerk-react";
import CTASection from "./components/CTASection";
import FeatureSection from "./components/FeatureSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";

const Landing = () => {
    const { isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="landing-page bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-indigo-500 selection:text-white relative">
            <HeroSection />
            
            <FeatureSection features={features} />
            
            <PricingSection pricingPlans={pricingPlans} />
            
            <TestimonialsSection testimonials={testimonials} />
            
            <CTASection />
            
            <Footer />
        </div>
    );
};

export default Landing;