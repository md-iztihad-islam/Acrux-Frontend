import HeroSection from "@/components/clientPart/HeroSection";
import PricingCards from "@/components/clientPart/PricingCard";
import OrderForm from "@/components/clientPart/OrderForm";
import BenefitsSection from "@/components/clientPart/BenefitSection";
import Footer from "@/components/clientPart/Footer";


function Home() {
    return (
        <div className="min-h-screen ">
            <HeroSection />
            <PricingCards />
            <OrderForm />
            <BenefitsSection />
            <Footer />
        </div>
    );
}

export default Home;