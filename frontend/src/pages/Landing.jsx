import { features, pricingPlans, testimonials } from "../assets/data";
import {useClerk, useUser} from "@clerk/clerk-react"
import {useNavigate} from "react-router-dom"
import CTASection from "../components/landing/CTASection";
import FeatureSection from "../components/landing/FeatureSection";
import Footer from "../components/landing/Footer";
import HeroSection from "../components/landing/HeroSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import { useEffect } from "react";

const Landing = () => {
    const {openSignIn, openSignUp} = useClerk();
    const {isSignIn} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSignIn) {
            navigate("/dashboard")
        }
    }, [isSignIn, navigate])

    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp}/>
            {/* Feature Section */}
            <FeatureSection features={features}/>
            {/* Pricing Section */}
            <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
            {/* Testimonials Section */}
            <TestimonialsSection testimonials={testimonials}/>
            {/* CTA Section */}
            <CTASection openSignUp={openSignUp}/>
            {/* Footer Section */}
            <Footer/>
        </div>
    )
}

export default Landing;