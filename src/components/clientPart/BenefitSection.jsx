import { Button } from "@/components/ui/button";
import { Footprints, Leaf, Shield, Package } from "lucide-react";

const benefits = [
  { 
    icon: Footprints, 
    title: "শক্ত ও ফাটা গোড়ালির চিকিৎসা", 
    description: "দ্রুত আরাম ও নিরাময় প্রদান করে"
  },
  { 
    icon: Leaf, 
    title: "প্রাকৃতিক ও পুষ্টিকর উপাদান", 
    description: "অ্যালোভেরা, ইউরিয়া, নারকেল তেল সমৃদ্ধ"
  },
  { 
    icon: Shield, 
    title: "গভীর ময়েশ্চারাইজিং", 
    title: "গভীর ময়েশ্চারাইজিং", 
    description: "শুষ্ক ত্বককে কোমল ও মসৃণ রাখে"
  },
  { 
    icon: Package, 
    title: "ব্যবহার ও বহনের সুবিধা", 
    description: "স্টিক ফরম্যাট, যেকোনো সময় যেকোনো যায়গায়"
  },
];

const BenefitsSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-serif text-center text-gradient-gold mb-12">
          কেন আমাদের পায়ের যত্নের পণ্য পছন্দ করবেন?
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="glass-card rounded-xl p-4 md:p-6 text-center hover:shadow-gold transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center">
                <benefit.icon className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">
                {benefit.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="teal" size="xl" onClick={scrollToOrder}>
            এখনই অর্ডার করুন
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;