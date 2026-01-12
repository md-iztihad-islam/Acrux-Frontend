import { useState, useMemo } from "react";
import { 
  Check, 
  Star, 
  Shield, 
  Truck, 
  Clock, 
  Award, 
  Zap, 
  Crown,
  ChevronRight,
  Package,
  Tag,
  Droplets,
  Heart,
  Leaf,
  Flower,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import getAllProductsApi from "@/services/clientPart/allProducts/getAllProductsApi";

const PricingCard = ({ 
  product, 
  icon: Icon,
  iconColor,
  features,
  isPopular,
  savings,
  savingsPercent,
  productCount,
  index,
  isFamilyPack = false,
  allProducts = []
}) => {
  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) return null;

  // Determine product type from title
  const productTitle = product.title?.toLowerCase() || "";
  let icon = Package;
  let color = "from-gray-500 to-gray-700";

  if (productTitle.includes("hand and foot") || productTitle.includes("oem")) {
    icon = Heart;
    color = "from-pink-500 to-rose-500";
  } else if (productTitle.includes("foot and heel")) {
    if (productTitle.includes("aloe") || productTitle.includes("vera")) {
      icon = Leaf;
      color = "from-green-500 to-emerald-500";
    } else {
      icon = Droplets;
      color = "from-blue-500 to-cyan-500";
    }
  }

  return (
    <div
      className={`group relative h-full rounded-3xl p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden ${
        isPopular
          ? "bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 shadow-2xl shadow-teal-500/30 border-0"
          : "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
      }`}
      onClick={scrollToOrder}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isPopular ? "bg-white" : "bg-gray-900 dark:bg-white"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0%)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Popular Badge */}
      {isPopular && (
        <>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg z-10 flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>ফ্যামিলি স্পেশাল</span>
          </div>
          <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-20 blur-xl" />
        </>
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header with Image */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {isFamilyPack ? (
              <div className="relative">
                {/* Image Collage for Family Pack */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-2xl">
                  {allProducts.slice(0, 4).map((prod, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/20 rounded-lg">
                              <Package class="w-8 h-8 text-white" />
                            </div>
                          `;
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    {allProducts.length} টি
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-1 md:p-2 rounded-2xl ${
                isPopular 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : `bg-gradient-to-br ${color}`
              }`}>
                {product.image ? (
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border-4 border-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center ${isPopular ? 'bg-white/20' : 'bg-gradient-to-br ' + color} rounded-xl">
                            <Icon class="w-12 h-12 md:w-16 md:h-16 text-white" />
                          </div>
                        `;
                      }}
                    />
                    {/* Discount Badge on Image */}
                    {savingsPercent > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {savingsPercent}% OFF
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-xl ${
                    isPopular ? 'bg-white/20' : `bg-gradient-to-br ${color}`
                  }`}>
                    <Icon className={`w-12 h-12 md:w-16 md:h-16 ${
                      isPopular ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                )}
              </div>
            )}
          </div>

          <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
            isPopular ? "text-white" : "text-gray-900 dark:text-white"
          }`}>
            {product.title}
          </h3>
          
          <p className={`text-sm md:text-base ${
            isPopular ? "text-white/90" : "text-gray-600 dark:text-gray-300"
          }`}>
            {product.subTitle}
          </p>

          {/* Stock Status */}
          {!isFamilyPack && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                  <span className="text-xs font-medium">
                    মাত্র {product.stockQuantity} টি অবশিষ্ট
                  </span>
                </div>
              )}

              {product.stockQuantity === 0 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                  <span className="text-xs font-medium">
                    স্টক শেষ
                  </span>
                </div>
              )}

              {product.stockQuantity > 10 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  <span className="text-xs font-medium">
                    পর্যাপ্ত স্টক
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="text-center mb-6">
          {product.discountAmount > 0 && (
            <div className={`text-sm mb-1 ${
              isPopular ? "text-white/80" : "text-gray-500 dark:text-gray-400"
            }`}>
              মূল্য{" "}
              <span className="line-through">৳{product.mainPrice.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-baseline justify-center gap-2">
            <div className={`text-4xl md:text-5xl font-bold ${
              isPopular ? "text-white" : "text-gray-900 dark:text-white"
            }`}>
              ৳{product.finalPrice.toLocaleString()}
            </div>
            {savingsPercent > 0 && (
              <div className={`text-sm font-bold px-2 py-1 rounded-full ${
                isPopular 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400'
              }`}>
                {savingsPercent}% ছাড়
              </div>
            )}
          </div>
          {savings > 0 && (
            <div className={`text-sm font-semibold mt-2 ${
              isPopular ? "text-white" : "text-green-600 dark:text-green-400"
            }`}>
              সাশ্রয় করুন ৳{savings.toLocaleString()}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`p-1 rounded-full flex-shrink-0 ${
                isPopular 
                  ? 'bg-white/20' 
                  : 'bg-teal-50 dark:bg-teal-900/30'
              }`}>
                <Check className={`w-3 h-3 md:w-4 md:h-4 ${
                  isPopular ? "text-white" : "text-teal-500 dark:text-teal-400"
                }`} />
              </div>
              <span className={`text-sm md:text-base ${
                isPopular ? "text-white/90" : "text-gray-700 dark:text-gray-300"
              }`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full py-3 md:py-4 text-sm md:text-base font-bold rounded-xl transition-all duration-300 ${
            isPopular
              ? 'bg-white text-teal-600 hover:bg-gray-50 hover:scale-105'
              : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white hover:scale-105'
          } shadow-lg hover:shadow-xl`}
          onClick={scrollToOrder}
          disabled={!isFamilyPack && product.stockQuantity === 0}
        >
          {isPopular ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              ফ্যামিলি প্যাক অর্ডার করুন
              <ChevronRight className="w-4 h-4" />
            </span>
          ) : !isFamilyPack && product.stockQuantity === 0 ? (
            <span className="flex items-center justify-center gap-2">
              স্টক শেষ
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              এই প্রোডাক্ট অর্ডার করুন
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

const PricingCards = () => {
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProductsApi(),
    enabled: true,
    cacheTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  });

  // Default features for products
  const getDefaultFeatures = (product) => {
    return [
      `স্টক: ${product.stockQuantity} টি`,
      `আসল মূল্য: ৳${product.mainPrice.toLocaleString()}`,
      `ছাড়ের মূল্য: ৳${product.finalPrice.toLocaleString()}`,
      product.discountAmount > 0 ? `${Math.round((product.discountAmount / product.mainPrice) * 100)}% সাশ্রয়` : "বিশেষ মূল্য",
      "ফ্রি হোম ডেলিভারি",
      "৩০ দিনের রিটার্ন পলিসি"
    ];
  };

  // Process products from API response
  const products = useMemo(() => {
    if (!apiResponse?.data?.products) return [];
    
    return apiResponse.data.products.map((product, index) => {
      // Calculate savings
      const savings = product.discountAmount || (product.mainPrice - product.finalPrice);
      const savingsPercent = product.mainPrice > 0 
        ? Math.round((savings / product.mainPrice) * 100) 
        : 0;

      return {
        ...product,
        savings,
        savingsPercent,
        features: getDefaultFeatures(product)
      };
    });
  }, [apiResponse]);

  // Create family pack from products
  const familyPack = useMemo(() => {
    if (products.length === 0) return null;

    const totalMainPrice = products.reduce((sum, product) => sum + product.mainPrice, 0);
    const totalFinalPrice = products.reduce((sum, product) => sum + product.finalPrice, 0);
    const familyPrice = Math.round(totalFinalPrice * 0.80); // 20% extra discount for family pack
    const savings = totalMainPrice - familyPrice;
    const savingsPercent = totalMainPrice > 0 ? Math.round((savings / totalMainPrice) * 100) : 0;
    const minStock = Math.min(...products.map(p => p.stockQuantity));

    return {
      title: "কমপ্লিট ফ্যামিলি প্যাক",
      subTitle: `সব ${products.length}টি প্রিমিয়াম প্রোডাক্ট`,
      mainPrice: totalMainPrice,
      finalPrice: familyPrice,
      discountAmount: savings,
      stockQuantity: minStock,
      savings,
      savingsPercent,
      productCount: products.length,
      features: [
        `সব ${products.length}টি প্রোডাক্ট অন্তর্ভুক্ত`,
        "পুরো পরিবারের জন্য উপযুক্ত",
        "সর্বোচ্চ সাশ্রয়ী প্যাকেজ",
        `এক্সট্রা ${Math.round((totalFinalPrice - familyPrice) / totalFinalPrice * 100)}% অতিরিক্ত ছাড়`,
        "ফ্রি প্রিমিয়াম ক্যারি ব্যাগ",
        "প্রিয়রিটি সাপোর্ট"
      ],
      isPopular: true
    };
  }, [products]);

  const benefits = [
    { icon: Shield, text: "প্রিমিয়াম কোয়ালিটি", color: "text-green-500" },
    { icon: Truck, text: "ফ্রি হোম ডেলিভারি", color: "text-blue-500" },
    { icon: Clock, text: "২৪ ঘন্টার মধ্যে শিপিং", color: "text-amber-500" },
    { icon: Award, text: "১০০% মান নিশ্চিতকরণ", color: "text-purple-500" },
    { icon: Star, text: "গ্রাহকদের পছন্দ", color: "text-yellow-500" }
  ];

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-gray-600">প্রোডাক্ট লোড হচ্ছে...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="max-w-md w-full text-center">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">
                  প্রোডাক্ট লোড করতে সমস্যা
                </h2>
                <p className="text-red-600 mb-4">
                  {error?.message || 'প্রোডাক্ট তথ্য লোড করতে সমস্যা হয়েছে'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!apiResponse?.data?.products || apiResponse.data.products.length === 0) {
    return (
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              কোন প্রোডাক্ট পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">
              নতুন প্রোডাক্ট শীঘ্রই আসছে
            </p>
          </div>
        </div>
      </section>
    );
  }

  const stats = apiResponse.data.stats || {};
  const totalProducts = apiResponse.data.totalProducts || products.length;

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
            <Tag className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              আমাদের সকল প্রোডাক্ট
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              {totalProducts}টি স্পেশালাইজড প্রোডাক্ট
            </span>
            {familyPack && " + ১টি ফ্যামিলি প্যাক"}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            আপনার প্রয়োজন অনুযায়ী প্রোডাক্ট নির্বাচন করুন, অথবা সবচেয়ে সাশ্রয়ী ফ্যামিলি প্যাক নিন
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">{totalProducts}</div>
              <div className="text-sm text-gray-600">মোট প্রোডাক্ট</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                ৳{stats.averagePrice?.toLocaleString() || "1,475"}
              </div>
              <div className="text-sm text-gray-600">গড় মূল্য</div>
            </div>
            {stats.lowStockProducts > 0 && (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-amber-600">{stats.lowStockProducts}</div>
                <div className="text-sm text-gray-600">লো স্টক</div>
              </div>
            )}
            {familyPack && (
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{familyPack.savingsPercent}%</div>
                <div className="text-sm text-gray-600">সর্বোচ্চ ছাড়</div>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 mb-2">
                <benefit.icon className={`w-5 h-5 md:w-6 md:h-6 ${benefit.color}`} />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-white">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>

        {/* Individual Products Grid */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ইন্ডিভিজুয়াল প্রোডাক্টস
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              আলাদাভাবে আপনার পছন্দের প্রোডাক্ট অর্ডার করুন
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(products.length, 4)} gap-6 md:gap-8 max-w-7xl mx-auto`}>
            {products.map((product, index) => {
              // Determine icon based on product title
              const productTitle = product.title?.toLowerCase() || "";
              let Icon = Package;
              
              if (productTitle.includes("hand and foot") || productTitle.includes("oem")) {
                Icon = Heart;
              } else if (productTitle.includes("foot and heel")) {
                if (productTitle.includes("aloe") || productTitle.includes("vera")) {
                  Icon = Leaf;
                } else {
                  Icon = Droplets;
                }
              }

              return (
                <PricingCard
                  key={product._id}
                  product={product}
                  index={index}
                  icon={Icon}
                  iconColor={productTitle.includes("hand and foot") ? "from-pink-500 to-rose-500" : 
                           productTitle.includes("aloe") ? "from-green-500 to-emerald-500" : 
                           "from-blue-500 to-cyan-500"}
                  features={product.features}
                  savings={product.savings}
                  savingsPercent={product.savingsPercent}
                  productCount={1}
                />
              );
            })}
          </div>
        </div>

        {/* Family Pack Section */}
        {familyPack && (
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                  স্পেশাল ফ্যামিলি অফার
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                সবচেয়ে সাশ্রয়ী - পুরো পরিবারের জন্য কমপ্লিট সলিউশন
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <PricingCard
                key="family-pack"
                product={familyPack}
                index={products.length}
                icon={Package}
                iconColor="from-purple-500 to-indigo-500"
                features={familyPack.features}
                isPopular={familyPack.isPopular}
                savings={familyPack.savings}
                savingsPercent={familyPack.savingsPercent}
                productCount={familyPack.productCount}
                isFamilyPack={true}
                allProducts={products}
              />
            </div>

            {/* Product Images Gallery */}
            <div className="max-w-3xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                  ফ্যামিলি প্যাকের প্রোডাক্টসমূহ
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.map((product, index) => (
                    <div key={product._id} className="text-center">
                      <div className="relative mb-2">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-32 md:h-40 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-32 md:h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <Package class="w-12 h-12 text-gray-400" />
                              </div>
                            `;
                          }}
                        />
                        <div className="absolute top-2 left-2 w-6 h-6 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        {product.savingsPercent > 0 && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.savingsPercent}%
                          </div>
                        )}
                      </div>
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {product.title}
                      </h5>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-sm line-through text-gray-500">
                          ৳{product.mainPrice.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          ৳{product.finalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Savings Comparison */}
            <div className="max-w-3xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      ফ্যামিলি প্যাকের সাশ্রয়
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      আলাদাভাবে {products.length}টি প্রোডাক্ট কিনলে খরচ:{" "}
                      <span className="font-bold line-through">৳{familyPack.mainPrice.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-green-600">
                        ৳{familyPack.savings.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">মোট সাশ্রয়</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-amber-600">
                        {familyPack.savingsPercent}%
                      </div>
                      <div className="text-sm text-gray-600">ছাড়</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guarantee Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl mb-4">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ৩০ দিনের ফুল মনি ব্যাক গ্যারান্টি
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            আপনি যদি সম্পূর্ণ সন্তুষ্ট না হন, আমরা ৩০ দিনের মধ্যে আপনার সম্পূর্ণ অর্থ ফেরত দেব
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;