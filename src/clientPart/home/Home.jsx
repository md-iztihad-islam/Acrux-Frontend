import HeroSection from "@/components/clientPart/HeroSection";
import ProductShowcase from "@/components/clientPart/ProductShowcase";
import CountdownTimer from "@/components/clientPart/CountdownTimer";
import PricingCards from "@/components/clientPart/PricingCard";
import OrderForm from "@/components/clientPart/OrderForm";
import BenefitsSection from "@/components/clientPart/BenefitSection";
import CustomerReviews from "@/components/clientPart/CustomerReview";
import Footer from "@/components/clientPart/Footer";


function Home() {
    return (
        <div className="min-h-screen ">
            <HeroSection />
            {/* <ProductShowcase /> */}
            <PricingCards />
            <OrderForm />
            <BenefitsSection />
            {/* <CustomerReviews /> */}
            <Footer />
        </div>
    );
}

export default Home;