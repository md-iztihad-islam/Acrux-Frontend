import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Package, Check, Shield, Truck, Info } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import getAllProductsApi from "@/services/clientPart/allProducts/getAllProductsApi";
import addOrderApi from "@/services/clientPart/order/addOrderApi";

// Districts with Dhaka on top and rest alphabetically
const districts = [
  // Dhaka at top (as requested)
  "Dhaka",
  
  // Rest in alphabetical order
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon"
];

const OrderForm = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: productApiResponse } = useQuery({
        queryKey: ["products"],
        queryFn: () => getAllProductsApi(),
        enabled: true,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
    });

    // Process API data to match your form structure
    const processProductsFromApi = () => {
        if (!productApiResponse?.data?.products) return [];
        
        return productApiResponse.data.products.map((product, index) => {
            // Calculate discount percentage
            const discountPercentage = product.mainPrice > 0 ? Math.round((product.discountAmount / product.mainPrice) * 100) : 0;
            
            // Determine product features based on title/subtitle
            const getFeatures = () => {
                if (product.title.includes("ELAIMEI") && product.subTitle.includes("Anti Crack")) {
                    return ["৬০% ইউরিয়া", "ফাটা গোড়ালি সারায়", "৩ বছরের expiry তারিখ"];
                } else if (product.subTitle.includes("Natural")) {
                    return ["মধু এক্সট্রাক্ট", "গভীর ময়েশ্চারাইজিং", "প্রাকৃতিক পুষ্টি"];
                } else if (product.subTitle.includes("Aloe")) {
                    return ["কুলিং ইফেক্ট", "দ্রুত শোষণ", "সুগন্ধি ভ্যানিলা"];
                } else {
                    return ["হাইড্রেশন বাড়ায়", "দ্রুত ফলাফল", "৩ বছরের expiry তারিখ"];
                }
            };

            return {
                key: `product_${product._id}`,
                id: product._id,
                productId: product.productId,
                name: product.title,
                description: product.subTitle,
                price: product.finalPrice,
                originalPrice: product.mainPrice,
                discountAmount: product.discountAmount,
                discountPercentage,
                image: product.image,
                stockQuantity: product.stockQuantity,
                features: getFeatures(),
                weight: "40 গ্রাম",
                category: "individual",
                isPopular: discountPercentage > 40,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
        });
    };

    // Add family pack product
    // const getFamilyPackProduct = () => {
    //     const apiProducts = processProductsFromApi();
    //     if (apiProducts.length < 4) return null;
        
    //     const totalOriginalPrice = apiProducts.slice(0, 4).reduce((sum, p) => sum + p.originalPrice, 0);
    //     const totalFinalPrice = apiProducts.reduce((sum, product) => sum + product.price, 0);
    //     const familyPackPrice = totalFinalPrice - 750;
    //     const savings = totalOriginalPrice - familyPackPrice;
        
    //     return {
    //         key: "family_pack",
    //         name: "কমপ্লিট ফ্যামিলি প্যাক",
    //         description: "সব ৪টি প্রিমিয়াম প্রোডাক্ট একসাথে, বিশেষ ছাড়ে!",
    //         price: familyPackPrice,
    //         originalPrice: totalOriginalPrice,
    //         discountAmount: savings,
    //         discountPercentage: Math.round((savings / totalOriginalPrice) * 100),
    //         image: apiProducts[0]?.image || "",
    //         stockQuantity: Math.min(...apiProducts.slice(0, 4).map(p => p.stockQuantity)),
    //         weight: "160 গ্রাম (৪টি স্টিক)",
    //         features: ["সব ৪টি স্টিক", "ফ্রি ক্যারি ব্যাগ", `${Math.round((savings / totalOriginalPrice) * 100)}% ছাড়`, "লাইফটাইম সাপোর্ট"],
    //         category: "family",
    //         isPopular: true,
    //         savings: savings,
    //         isFamilyPack: true
    //     };
    // };

    // Combine API products with family pack
    const products = () => {
        const apiProducts = processProductsFromApi();
        // const familyPack = getFamilyPackProduct();
        
        // if (familyPack) {
        //     return [...apiProducts, familyPack];
        // }
        return apiProducts;
    };

    // Initialize quantities state
    const initializeQuantities = () => {
        const productList = products();
        const initialQuantities = {};
        
        productList.forEach(product => {
            initialQuantities[product.key] = 0;
        });
        
        return initialQuantities;
    };

    const [quantities, setQuantities] = useState(initializeQuantities);
    const [formData, setFormData] = useState({
        customerName: "",
        deliverAddress: "",
        customerPhone: "",
        area: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    // Re-initialize quantities when products change
    useEffect(() => {
        setQuantities(initializeQuantities());
    }, [productApiResponse]);

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.customerName.trim()) {
            newErrors.customerName = "নাম আবশ্যক";
        }
        
        if (!formData.deliverAddress.trim()) {
            newErrors.deliverAddress = "ঠিকানা আবশ্যক";
        }
        
        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = "মোবাইল নাম্বার আবশ্যক";
        } else if (!/^(01[3-9]\d{8})$/.test(formData.customerPhone.replace(/\D/g, ''))) {
            newErrors.customerPhone = "সঠিক মোবাইল নাম্বার দিন (01XXXXXXXXX)";
        }
        
        if (!formData.area) {
            newErrors.area = "এলাকা নির্বাচন করুন";
        }
        
        return newErrors;
    };

    // Update quantity with constraints
    const updateQuantity = (key, delta) => {
        setQuantities((prev) => {
            const newValue = Math.max(0, prev[key] + delta);
            
            // If family pack is selected, reset individual products
            // if (key === "family_pack" && newValue > 0) {
            //     const updated = { ...prev };
            //     products().forEach(product => {
            //         if (product.key !== "family_pack") {
            //             updated[product.key] = 0;
            //         }
            //     });
            //     updated[key] = newValue;
            //     return updated;
            // }
            
            // If any individual product is selected, reset family pack
            if (key !== "family_pack" && newValue > 0) {
                return { ...prev, [key]: newValue, family_pack: 0 };
            }
            
            return { ...prev, [key]: newValue };
        });
    };

    // Calculate subtotal
    const subtotal = products().reduce((sum, product) => sum + (product.price * quantities[product.key] || 0), 0);

    // Calculate savings
    const totalSavings = products().reduce((sum, product) => sum + ((product.originalPrice - product.price) * quantities[product.key] || 0), 0);

    // Total items count
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);


    // Add the mutation hook at the top level
    const { mutate, isPending } = useMutation({
        mutationFn: (orderData) => addOrderApi(orderData),
        onSuccess: (data) => {
            window.showToast("অর্ডার সফল হয়েছে! 🎉", `আপনার অর্ডার #${data.orderId} গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`, "success");
            
            // Reset form on success
            setQuantities(initializeQuantities());
            setFormData({ 
                customerName: "", 
                deliverAddress: "", 
                customerPhone: "", 
                area: "", 
                notes: "" 
            });
            setErrors({});
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsSubmitting(false);
        },
        onError: (error) => {
            // console.error("Order submission error:", error);
            toast({
                title: "ত্রুটি",
                description: error.message || "অর্ডার জমা দিতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন",
                variant: "destructive",
            });
            setIsSubmitting(false);
        },
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast({
                title: "ত্রুটি",
                description: "দয়া করে সকল তথ্য সঠিকভাবে পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        // Check if at least one product is selected
        if (subtotal === 0) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে অন্তত একটি পণ্য নির্বাচন করুন",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Prepare order data according to your Mongoose schema
        const orderData = {
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            deliverAddress: formData.deliverAddress,
            area: formData.area,
            totalAmount: subtotal,
            orderStatus: "Pending",
            products: products()
                .filter(product => quantities[product.key] > 0)
                .map(product => ({
                productId: product.id, // MongoDB ObjectId
                productName: product.name,
                productPrice: product.price,
                productQuantity: quantities[product.key]
                })),
            notes: formData.notes // Additional notes (not in schema, but we can add if needed)
        };

        // console.log("Submitting order:", orderData);

        // Send to your backend API using mutation
        mutate(orderData);
    };

    // Handle phone input
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            setFormData({ ...formData, customerPhone: value });
        }
    };

    // Loading state
    if (!productApiResponse) {
        return (
            <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-6"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                                ))}
                            </div>
                            <div className="lg:col-span-1 space-y-4">
                                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="order" className="py-12 md:py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
                        <Package className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold text-white">
                            সরাসরি অর্ডার করুন
                        </span>
                    </div>
                
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                            আপনার পছন্দের পণ্য অর্ডার করুন
                        </span>
                    </h2>
                
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        নিচের ফর্মটি পূরণ করে সহজেই আপনার পছন্দের পণ্য অর্ডার সম্পন্ন করুন
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Products Selection */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    পণ্য নির্বাচন করুন
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {totalItems} টি পণ্য নির্বাচিত
                                </div>
                            </div>

                        <div className="space-y-4">
                            {products().map((product) => (
                                <div
                                    key={product.key}
                                    className={`relative group rounded-xl p-4 md:p-6 transition-all duration-300 ${
                                    quantities[product.key] > 0
                                        ? product.isPopular
                                        ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-700"
                                        : "bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-700"
                                        : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500"
                                    }`}
                                >
                                    {product.isPopular && (
                                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full">
                                            {product.discountPercentage}% OFF
                                        </div>
                                    )}

                                    {/* Stock warning */}
                                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                                        <div className="absolute -top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                                            শেষ {product.stockQuantity} টি
                                        </div>
                                    )}

                                    {product.stockQuantity === 0 && (
                                        <div className="absolute -top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full">
                                            স্টক শেষ
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Product Image */}
                                        <div className="relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/150?text=FootCare";
                                                }}
                                            />
                                            {product.category === "family" && (
                                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    4 in 1
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                <div>
                                                    <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                        {product.name}
                                                    </h4>
                                                    {/* <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                        {product.description}
                                                    </p> */}
                                                    {/* <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                                            {product.weight}
                                                        </span>
                                                        {product.features.slice(0, 2).map((feature, idx) => (
                                                            <span key={idx} className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-1 rounded">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                        {product.stockQuantity > 0 && (
                                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                                                {product.stockQuantity} টি স্টকে আছে
                                                            </span>
                                                        )}
                                                    </div> */}
                                                </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="flex items-baseline gap-2 justify-end">
                                                    {product.originalPrice > product.price && (
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                            ৳{product.originalPrice}
                                                        </span>
                                                    )}
                                                    <span className={`text-xl font-bold ${
                                                        product.isPopular ? "text-amber-600 dark:text-amber-400" : "text-teal-600 dark:text-teal-400"
                                                    }`}>
                                                        ৳{product.price}
                                                    </span>
                                                </div>
                                                {product.discountAmount > 0 && (
                                                    <div className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                                                        সাশ্রয় ৳{product.discountAmount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className={`h-8 w-8 rounded-full ${
                                                    quantities[product.key] === 0 ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                onClick={() => updateQuantity(product.key, -1)}
                                                disabled={quantities[product.key] === 0 || product.stockQuantity === 0}
                                                >
                                                <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-12 text-center font-bold text-lg">
                                                {quantities[product.key]}
                                                </span>
                                                <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30"
                                                onClick={() => updateQuantity(product.key, 1)}
                                                disabled={product.stockQuantity === 0 || quantities[product.key] >= product.stockQuantity}
                                                >
                                                <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="text-sm font-medium">
                                                <span className="text-gray-600 dark:text-gray-400">মোট: </span>
                                                <span className="text-teal-600 dark:text-teal-400 font-bold">
                                                ৳{product.price * quantities[product.key]}
                                                </span>
                                            </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning message for product conflicts
                                    {product.category === "family" && quantities[product.key] > 0 && (
                                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                                        <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        ফ্যামিলি প্যাক নির্বাচিত। আলাদা পণ্যগুলো অটো বন্ধ করা হয়েছে।
                                        </p>
                                    </div>
                                    )} */}
                                </div>
                            ))}
                        </div>

                        
                        </div>

                        {/* Billing Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            ডেলিভারি তথ্য
                        </h3>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName" className="text-black dark:text-gray-300">
                                পুরো নাম *
                                </Label>
                                <Input
                                id="customerName"
                                placeholder="আপনার পুরো নাম লিখুন"
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className={`bg-gray-50 text-black dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                                    errors.customerName ? "border-red-500 dark:border-red-500" : ""
                                }`}
                                />
                                {errors.customerName && (
                                <p className="text-sm text-red-500">{errors.customerName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customerPhone" className="text-black dark:text-gray-300">
                                মোবাইল নাম্বার *
                                </Label>
                                <Input
                                id="customerPhone"
                                placeholder="01XXXXXXXXX"
                                value={formData.customerPhone}
                                onChange={handlePhoneChange}
                                className={`bg-gray-50 text-black dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                                    errors.customerPhone ? "border-red-500 dark:border-red-500" : ""
                                }`}
                                maxLength={11}
                                />
                                {errors.customerPhone ? (
                                <p className="text-sm text-red-500">{errors.customerPhone}</p>
                                ) : (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ১১ ডিজিটের মোবাইল নাম্বার দিন
                                </p>
                                )}
                            </div>
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="deliverAddress" className="text-black dark:text-gray-300">
                                সম্পূর্ণ ঠিকানা *
                            </Label>
                            <Input
                                id="deliverAddress"
                                placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা"
                                value={formData.deliverAddress}
                                onChange={(e) => setFormData({ ...formData, deliverAddress: e.target.value })}
                                className={`bg-gray-50 text-black dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                                errors.deliverAddress ? "border-red-500 dark:border-red-500" : ""
                                }`}
                            />
                            {errors.deliverAddress && (
                                <p className="text-sm text-red-500">{errors.deliverAddress}</p>
                            )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area" className="text-black dark:text-gray-300">
                                এলাকা নির্বাচন *
                                </Label>
                                <Select
                                value={formData.area}
                                onValueChange={(value) => setFormData({ ...formData, area: value })}
                                >
                                <SelectTrigger className={`bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${
                                    errors.area ? "border-red-500 dark:border-red-500" : ""
                                }`}>
                                    <SelectValue placeholder="জেলা নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent className="max-h-96">
                                    {districts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                        {district}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                {errors.area && (
                                <p className="text-sm text-red-500">{errors.area}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-black dark:text-gray-300">
                                দেশ
                                </Label>
                                <Input
                                id="country"
                                value="বাংলাদেশ"
                                readOnly
                                className="bg-gray-100 text-black dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="notes" className="text-black dark:text-gray-300">
                                অতিরিক্ত নির্দেশনা (ঐচ্ছিক)
                            </Label>
                            <Input
                                id="notes"
                                placeholder="ডেলিভারির সময় বা অন্য কোন নির্দেশনা থাকলে লিখুন"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="bg-gray-50 text-black dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                            </div>
                        </form>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    ORDER SUMMARY
                                </h3>

                                {/* Selected Products */}
                                <div className="space-y-4 mb-6">
                                    {products().filter(product => quantities[product.key] > 0).map((product) => (
                                        <div key={product.key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                    {product.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {quantities[product.key]} × ৳{product.price}
                                                    </span>
                                                    {/* {product.isPopular && product.category === "family" && (
                                                        <span className="text-xs bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-0.5 rounded-full">
                                                            ফ্যামিলি প্যাক
                                                        </span>
                                                    )} */}
                                                </div>
                                                </div>
                                                <span className="font-bold text-teal-600 dark:text-teal-400">
                                                    ৳{product.price * quantities[product.key]}
                                                </span>
                                        </div>
                                    ))}

                                    {totalItems === 0 && (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                কোন পণ্য নির্বাচন করা হয়নি
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">SUB-TOTAL</span>
                                    <span className="font-medium">৳{subtotal}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">DELIVERY CHARGE</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">FREE</span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">SAVE</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                        ৳{totalSavings}
                                    </span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">TOTAL</span>
                                    <div>
                                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                        ৳{subtotal}
                                        </div>
                                        {totalSavings > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                            <span className="line-through">৳{subtotal + totalSavings}</span> থেকে
                                        </div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">COD</span>
                                    </div>
                                    <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ক্যাশ অন ডেলিভারি
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        পণ্য হাতে পেয়ে টাকা দিন
                                    </p>
                                    </div>
                                </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    variant="gold"
                                    size="xl"
                                    type="submit"
                                    className={`${totalItems > 0 ? "bg-black text-white" : "bg-gray-400"} w-full hover:bg-gray-600 mt-6 py-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || totalItems === 0}
                                >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                        প্রসেসিং...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                    <Check className="w-5 h-5" />
                                        অর্ডার কনফার্ম করুন - ৳{subtotal}
                                    </span>
                                )}
                                </Button>

                                {/* Terms */}
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                                    অর্ডার করলে আমাদের{" "}
                                    <button type="button" className="text-teal-600 dark:text-teal-400 hover:underline">
                                        Terms & Conditions
                                    </button>{" "}
                                    এবং{" "}
                                    <button type="button" className="text-teal-600 dark:text-teal-400 hover:underline">
                                        Privacy Policy
                                    </button>{" "}
                                    মেনে নিচ্ছেন
                                </p>
                            </div>

                            {/* Guarantee & Benefits */}
                            <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield className="w-6 h-6" />
                                    <h4 className="text-lg font-bold">আমাদের গ্যারান্টি</h4>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>ফ্রি হোম ডেলিভারি সারা দেশে</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>২৪-৪৮ ঘন্টার মধ্যে শিপিং</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>১০০% অরিজিনাল প্রোডাক্ট</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>২৪/৭ গ্রাহক সাপোর্ট</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
                                <h4 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3">
                                ডেলিভারি সময়সূচী
                                </h4>
                                <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
                                <li className="flex justify-between">
                                    <span>ঢাকা শহর</span>
                                    <span className="font-bold">২৪-৪৮ ঘন্টা</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>বিভাগীয় শহর</span>
                                    <span className="font-bold">৩-৫ দিন</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>জেলা শহর</span>
                                    <span className="font-bold">৪-৭ দিন</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>উপজেলা এলাকা</span>
                                    <span className="font-bold">৫-১০ দিন</span>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">0137678124648</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">সরাসরি কথা বলুন</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">acruxshop26@gmail.com</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">ইমেইল করুন ২৪/৭</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderForm;