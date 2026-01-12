import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import video from "@/assets/video.MOV";
import { Footprints, Shield, Zap, Award, ChevronRight, Play, Pause, Check } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
    const [isVisible, setIsVisible] = useState(true);

    const scrollToOrder = () => {
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    };



    useEffect(() => {
        const handleScroll = () => {
        setIsVisible(window.scrollY < 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
        icon: Footprints,
        title: "ফাটা গোড়ালি সারায়",
        description: "দ্রুত ও স্থায়ী সমাধান"
        },
        {
        icon: Award,
        title: "প্রাকৃতিক উপাদান",
        description: "১০০% নিরাপদ ফর্মুলা"
        },        
        {
        icon: Zap,
        title: "দ্রুত ফলাফল",
        description: "৩-৭ দিনের মধ্যে উন্নতি"
        },
        {
        icon: Shield,
        title: "৬০% ইউরিয়া",
        description: "মেডিকেল-গ্রেড উপাদান"
        }
    ];

    const benefits = [
        "মেডিকেলি টেস্টেড",
        "হাইজেনিক প্যাকেজিং",
    ];

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-gold/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-teal/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gold/5 via-transparent to-teal/5 rounded-full blur-3xl" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
                        style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                {/* Logo and Tagline */}
                <div className="flex flex-col items-center text-center mb-8 md:mb-12 lg:mb-16">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-gold/20 to-teal/20 backdrop-blur-sm rounded-2xl mb-4">
                            <img src={logo} className="w-[200px]" alt="" />
                        </div>
                        <p className="text-sm md:text-base text-gray-300 mt-2 tracking-widest uppercase">
                            PREMIUM FOOT CARE SOLUTIONS
                        </p>
                    </div>

                    {/* Main Headline */}
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                            আপনার পায়ের{" "}
                            <span className="text-yellow-400 bg-clip-text text-transparent">
                                স্বাস্থ্যকর যত্ন
                            </span>
                            <br />
                            শুরু করুন আজই
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto">
                            মেডিকেল-গ্রেড ফুট কেয়ার প্রোডাক্ট যা আপনার পায়ের যত্নে
                            বিপ্লব ঘটাবে
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 md:p-6 hover:border-gold/50 transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-teal/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-gold to-amber-500 flex items-center justify-center shadow-lg">
                                        <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-300">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits List */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 md:px-5 md:py-3"
                        >
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm md:text-base text-gray-300">
                                {benefit}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="flex flex-col items-center mb-8 md:mb-12 lg:mb-16">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-gold via-amber-500 to-yellow-400 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300" />
                            <Button
                                onClick={scrollToOrder}
                                className="relative px-8 md:px-12 py-6 md:py-7 bg-gradient-to-r from-gold to-amber-500 text-white text-lg md:text-xl lg:text-2xl font-bold rounded-2xl hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
                            >
                            <span>এখনই অর্ডার করুন</span>
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                        </Button>
                    </div>
                </div>

                {/* Video Section */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="flex justify-center items-center rounded-3xl overflow-hidden shadow-2xl group">
                        <video
                            src={video}
                            autoPlay
                            loop
                            className="w-[400px] h-auto "
                        />
                    
                        {/* Video Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />

                        

                        {/* Stats Overlay */}
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 hidden md:block">
                            <div className="flex gap-4">
                                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                    <div className="text-2xl font-bold text-white">৫,০০০+</div>
                                    <div className="text-xs text-gray-300">সন্তুষ্ট গ্রাহক</div>
                                </div>
                                <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                    <div className="text-2xl font-bold text-white">৯৮%</div>
                                    <div className="text-xs text-gray-300">সফলতা হার</div>
                                </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Stats */}
                <div className="flex justify-center gap-4 mt-4 md:hidden">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 flex-1 text-center">
                        <div className="text-xl font-bold text-white">৫,০০০+</div>
                        <div className="text-xs text-gray-300">সন্তুষ্ট গ্রাহক</div>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 flex-1 text-center">
                        <div className="text-xl font-bold text-white">৯৮%</div>
                        <div className="text-xs text-gray-300">সফলতা হার</div>
                    </div>
                </div>
                </div>

                {/* Scroll Indicator */}
                <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-400 mb-2">স্ক্রল করুন</span>
                        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-bounce" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;