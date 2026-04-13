import { features, pricingPlans } from "../assets/data";
import CTASection from "../components/landing/CTASection";
import FeatureSection from "../components/landing/FeatureSection";
import Footer from "../components/landing/Footer";
import HeroSection from "../components/landing/HeroSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";

const Landing = () => {
    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <HeroSection />
            {/* Feature Section */}
            <FeatureSection features={features}/>
            {/* Pricing Section */}
            <PricingSection pricingPlans={pricingPlans}/>
            {/* Testimonials Section */}
            <TestimonialsSection/>
            {/* CTA Section */}
            <CTASection/>
            {/* Footer Section */}
            <Footer/>
        </div>
    )
}

export default Landing;