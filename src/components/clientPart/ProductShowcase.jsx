import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Truck, Clock, Award, ChevronRight, ShoppingBag, Package } from "lucide-react";

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("all");

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  const products = [
    {
      id: "elaimei-urea",
      name: "ELAIMEI 60% UREA FOOT CREAM STICK",
      subtitle: "এলাাইমেই ৬০% ইউরিয়া ফুট ক্রিম স্টিক",
      description: "For dry cracked heels & callus removal - 40g",
      features: [
        "৬০% ইউরিয়া ফর্মুলা",
        "শক্ত গোড়ালি ও ক্যালাস অপসারণ",
        "প্রবল শুষ্কতা দূর করে",
        "নরম ও মসৃণ ত্বক",
        "প্রতিদিন ১-২ বার ব্যবহার করুন"
      ],
      ingredients: ["Urea", "Aloe Vera", "Coconut Oil", "Tea Tree Oil"],
      price: 799,
      originalPrice: 1199,
      discount: 33,
      badge: "BESTSELLER",
      color: "from-blue-500 to-teal-500",
      type: "urea",
      specs: {
        weight: "40g",
        format: "Stick",
        madeIn: "Guangdong, China",
        shelfLife: "3 Years",
        certification: "CE MSDS"
      }
    },
    {
      id: "ikzee-natural",
      name: "IKZEE NATURAL FOOT CARE BALM",
      subtitle: "আইকজি প্রাকৃতিক ফুট কেয়ার বাম",
      description: "Honey & Shea Butter formula - 40g",
      features: [
        "মধু ও শিয়াবাটার এক্সট্রাক্ট",
        "গভীর ময়েশ্চারাইজিং",
        "প্রাকৃতিক পুষ্টি সরবরাহ",
        "ত্বক সুরক্ষা",
        "সারাদিন নরমতা"
      ],
      ingredients: ["Honey", "Shea Butter", "Aloe Vera", "Green Tea"],
      price: 699,
      originalPrice: 1099,
      discount: 36,
      badge: "POPULAR",
      color: "from-amber-500 to-orange-500",
      type: "natural",
      specs: {
        weight: "40g",
        format: "Balm Stick",
        madeIn: "Guangdong, China",
        shelfLife: "3 Years",
        certification: "Organic Certified"
      }
    },
    {
      id: "elaimei-aloe",
      name: "ELAIMEI ALOE VERA FOOT CREAM",
      subtitle: "এলাাইমেই অ্যালোভেরা ফুট ক্রিম",
      description: "Aloe Vera & Peach formula - 40g",
      features: [
        "অ্যালোভেরা এক্সট্রাক্ট",
        "পীচ এসেন্স",
        "ফাটা গোড়ালি সারায়",
        "কুলিং ইফেক্ট",
        "দ্রুত শোষণ"
      ],
      ingredients: ["Aloe Vera", "Peach", "Urea", "Natural Oils"],
      price: 649,
      originalPrice: 999,
      discount: 35,
      color: "from-green-500 to-emerald-500",
      type: "aloe",
      specs: {
        weight: "40g",
        format: "Cream Stick",
        madeIn: "Guangdong, China",
        shelfLife: "3 Years",
        certification: "Quality Tested"
      }
    },
    {
      id: "elaimei-peach",
      name: "ELAIMEI PEACH ALOE FOOT STICK",
      subtitle: "এলাাইমেই পীচ অ্যালোভেরা ফুট স্টিক",
      description: "Peach & Aloe variant - 40g",
      features: [
        "সুগন্ধি পীচ এসেন্স",
        "অ্যালোভেরা জেল",
        "ত্বক হাইড্রেশন",
        "দ্রুত ফলাফল",
        "সহজ প্রয়োগ"
      ],
      ingredients: ["Peach Extract", "Aloe Vera", "Urea"],
      price: 649,
      originalPrice: 999,
      discount: 35,
      color: "from-pink-500 to-rose-500",
      type: "peach",
      specs: {
        weight: "40g",
        format: "Stick",
        madeIn: "Guangdong, China",
        shelfLife: "3 Years",
        certification: "Skin Safe"
      }
    }
  ];

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(p => p.type === activeTab);

  const familyPack = {
    price: 1799,
    originalPrice: 3297,
    savings: 1498,
    savingsPercent: 45
  };

  const benefits = [
    { icon: Truck, text: "ফ্রি হোম ডেলিভারি", color: "text-blue-500" },
    { icon: Clock, text: "৪৮ ঘন্টার মধ্যে শিপিং", color: "text-amber-500" },
    { icon: Award, text: "মান নিশ্চিতকরণ", color: "text-purple-500" }
  ];

  return (
    <section id="products" className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
            <span className="text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
              প্রিমিয়াম ফুট কেয়ার সলিউশন
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            আমাদের <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">বিশেষায়িত</span> পণ্য সমূহ
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            মেডিকেলি টেস্টেড ফুট কেয়ার প্রোডাক্ট, যা আপনার পায়ের যত্নে নতুন মাত্রা যোগ করবে
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
            {[
              { id: "all", label: "সব পণ্য" },
              { id: "urea", label: "৬০% ইউরিয়া" },
              { id: "natural", label: "প্রাকৃতিক" },
              { id: "aloe", label: "অ্যালোভেরা" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Badge */}
              {product.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <div className={`bg-gradient-to-r ${product.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                    {product.badge}
                  </div>
                </div>
              )}

              {/* Product Image Area */}
              <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-20"></div>
                </div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg flex items-center justify-center">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 md:p-6">
                <div className="mb-3">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.subtitle}</p>
                  <p className="text-xs text-gray-500">{product.description}</p>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className="text-sm font-medium text-gray-700">মূল বৈশিষ্ট্য:</span>
                  </div>
                  <ul className="space-y-1.5">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">
                      ৳{product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ৳{product.originalPrice}
                    </span>
                    <span className="ml-auto text-sm font-bold text-green-600">
                      {product.discount}% ছাড়
                    </span>
                  </div>
                </div>

                {/* Product Specs */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                  <span>{product.specs.weight}</span>
                  <span>•</span>
                  <span>{product.specs.format}</span>
                  <span>•</span>
                  <span>{product.specs.shelfLife}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 mb-3">
                  <benefit.icon className={`w-6 h-6 md:w-8 md:h-8 ${benefit.color}`} />
                </div>
                <span className="text-sm md:text-base font-medium text-gray-800">
                  {benefit.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Family Pack Section */}
        <div className="mb-12 md:mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl p-6 md:p-8 border-2 border-blue-100">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Info */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-4">
                  <span className="text-sm font-bold text-white">সেরা মানি-সেভিং অফার</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  কমপ্লিট ফ্যামিলি ফুট কেয়ার প্যাক
                </h3>
                
                <p className="text-gray-600 mb-6">
                  পুরো পরিবারের সকলের পায়ের যত্নের পূর্ণাঙ্গ সমাধান।
                </p>

                <p className="text-gray-600 mb-6">
                  ৪টি প্রিমিয়াম প্রোডাক্ট একত্রে সবচেয়ে সাশ্রয়ী দামে।
                </p>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">
                      ৳{familyPack.price}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ৳{familyPack.originalPrice}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-full">
                      {familyPack.savingsPercent}% ছাড়
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    সাশ্রয় করুন ৳{familyPack.savings}
                  </p>
                </div>

                {/* Included Products */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">এই প্যাকেজে যা পাচ্ছেন:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {products.slice(0, 4).map(product => (
                      <li key={product.id} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{product.name.split(" ")[0]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={scrollToOrder}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>ফ্যামিলি প্যাক অর্ডার করুন</span>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Right Side - Visual */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                          <Package className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 text-center">
                          {product.name.split(" ")[0]}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          ৳{product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Savings Badge */}
                <div className="absolute -top-4 -right-4">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                    <div className="text-sm font-bold">সেভ ৳{familyPack.savings}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Social Proof */}
        <div className="text-center mb-12 md:mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-teal-500" />
                  <span className="text-lg font-bold text-gray-900">১০০% মান নিশ্চিতকরণ</span>
                </div>
                <p className="text-gray-600">
                  প্রতি পণ্য রিগ্রোস টেস্টিং-এর মাধ্যমে যাচাইকৃত
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">৫,০০০+</div>
                  <div className="text-sm text-gray-600">সন্তুষ্ট গ্রাহক</div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-amber-400 text-amber-400" />
                  ))}
                  <div className="ml-2">
                    <div className="text-lg font-bold text-gray-900">৪.৮/৫</div>
                    <div className="text-xs text-gray-600">গড় রেটিং</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              আপনার পায়ের স্বাস্থ্যকর যত্ন শুরু করুন আজই
            </h3>
          </div>
          
          <Button
            onClick={scrollToOrder}
            className="px-10 py-5 md:px-14 md:py-6 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-lg md:text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            এখনই অর্ডার করুন - বিশেষ অফার পেতে ক্লিক করুন
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            স্টক সীমিত • অর্ডার নিশ্চিত করতে ২৪-৪৮ ঘন্টা সময় লাগে
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;