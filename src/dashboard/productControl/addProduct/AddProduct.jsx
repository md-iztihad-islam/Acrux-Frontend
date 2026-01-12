import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import addProductApi from "@/services/dashboard/product/addProductApi";

function AddProduct() {
    const [productData, setProductData] = useState({
        title: "",
        subTitle: "",
        image: null,
        stockQuantity: 0,
        mainPrice: 0,
        discountAmount: 0,
        finalPrice: 0
    });

    // Calculate final price when main price or discount changes
    const calculateFinalPrice = (mainPrice, discountAmount) => {
        return Math.max(0, mainPrice - discountAmount);
    };

    // ---------------- MUTATION ----------------
    const { mutate: addProduct, isPending } = useMutation({
        mutationFn: (formData) => addProductApi(formData),
        onSuccess: () => {
            window.showToast("Product added successfully", "success");
            // Reset form on success
            setProductData({
                title: "",
                subTitle: "",
                image: null,
                stockQuantity: 0,
                mainPrice: 0,
                discountAmount: 0,
                finalPrice: 0
            });
        },
        onError: () => {
            window.showToast("Error adding product", "error");
        },
    });

    // ---------------- HANDLERS ----------------
    const handleInputChange = (field, value) => {
        if (field === "mainPrice" || field === "discountAmount") {
            const newMainPrice = field === "mainPrice" ? Number(value) || 0 : productData.mainPrice;
            const newDiscountAmount = field === "discountAmount" ? Number(value) || 0 : productData.discountAmount;
            const newFinalPrice = calculateFinalPrice(newMainPrice, newDiscountAmount);
            
            setProductData(prev => ({
                ...prev,
                [field]: Number(value) || 0,
                finalPrice: newFinalPrice
            }));
        } else {
            setProductData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleAddProduct = () => {
        // Validation
        if (!productData.title.trim()) {
            window.showToast("Title is required", "error");
            return;
        }

        if (productData.stockQuantity <= 0) {
            window.showToast("Stock quantity must be greater than 0", "error");
            return;
        }

        if (productData.mainPrice <= 0) {
            window.showToast("Main price must be greater than 0", "error");
            return;
        }

        const formData = new FormData();
        formData.append("title", productData.title);
        formData.append("subTitle", productData.subTitle);
        if (productData.image) formData.append("image", productData.image);
        formData.append("stockQuantity", productData.stockQuantity);
        formData.append("mainPrice", productData.mainPrice);
        formData.append("discountAmount", productData.discountAmount);
        formData.append("finalPrice", productData.finalPrice);

        addProduct(formData);
    };

    // ---------------- UI ----------------
    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                        Add New Product
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Fill in the details below to add a new product to your store
                    </p>
                </div>

                {/* Product Form */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6">
                            <InputRow 
                                label="Title *" 
                                value={productData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Enter product title"
                            />
                            
                            <InputRow 
                                label="Sub Title" 
                                value={productData.subTitle}
                                onChange={(e) => handleInputChange("subTitle", e.target.value)}
                                placeholder="Enter product sub title (optional)"
                            />
                            
                            <FileInputRow 
                                label="Product Image" 
                                onChange={(e) => handleInputChange("image", e.target.files?.[0])}
                            />
                            
                            <InputRow 
                                label="Stock Quantity *" 
                                type="number"
                                value={productData.stockQuantity}
                                onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                                min="0"
                                placeholder="Enter stock quantity"
                            />
                        </div>

                        {/* Right Column - Pricing */}
                        <div className="space-y-6">
                            <InputRow 
                                label="Main Price (৳) *" 
                                type="number"
                                value={productData.mainPrice}
                                onChange={(e) => handleInputChange("mainPrice", e.target.value)}
                                min="0"
                                step="0.01"
                                placeholder="Enter main price"
                            />
                            
                            <InputRow 
                                label="Discount Amount (৳)" 
                                type="number"
                                value={productData.discountAmount}
                                onChange={(e) => handleInputChange("discountAmount", e.target.value)}
                                min="0"
                                max={productData.mainPrice}
                                step="0.01"
                                placeholder="Enter discount amount"
                            />
                            
                            {/* Final Price Display - Read Only */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">
                                    Final Price (৳)
                                </label>
                                <div className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                    <div className="text-2xl md:text-3xl font-bold text-green-700">
                                        ৳{productData.finalPrice.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                        {productData.discountAmount > 0 ? (
                                            <span>
                                                Saved ৳{productData.discountAmount} ({((productData.discountAmount / productData.mainPrice) * 100).toFixed(1)}% off)
                                            </span>
                                        ) : (
                                            <span>No discount applied</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Discount Buttons */}
                            <div className="space-y-2">
                                <label className="block text-lg font-semibold text-gray-700">
                                    Quick Discount
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[10, 20, 30, 50].map(percent => (
                                        <button
                                            key={percent}
                                            type="button"
                                            onClick={() => {
                                                const discount = (productData.mainPrice * percent) / 100;
                                                handleInputChange("discountAmount", discount);
                                            }}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                                        >
                                            {percent}% Off
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("discountAmount", 0)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 md:mt-12 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleAddProduct}
                            disabled={isPending}
                            className="w-full md:w-auto px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Product...
                                </>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                        
                        {/* Form Validation Tips */}
                        <div className="mt-4 text-center text-sm text-gray-500">
                            <p>Fields marked with * are required. Product ID will be auto-generated.</p>
                        </div>
                    </div>
                </div>

                {/* Preview Card */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Product Preview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Basic Info</h3>
                            <p className="text-sm"><span className="font-medium">Title:</span> {productData.title || "Not set"}</p>
                            <p className="text-sm"><span className="font-medium">Sub Title:</span> {productData.subTitle || "Not set"}</p>
                            <p className="text-sm"><span className="font-medium">Stock:</span> {productData.stockQuantity} units</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Pricing</h3>
                            <p className="text-sm"><span className="font-medium">Main Price:</span> ৳{productData.mainPrice.toFixed(2)}</p>
                            <p className="text-sm"><span className="font-medium">Discount:</span> ৳{productData.discountAmount.toFixed(2)}</p>
                            <p className="text-sm font-bold text-green-700">Final Price: ৳{productData.finalPrice.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Image</h3>
                            {productData.image ? (
                                <p className="text-sm text-green-600">✓ Image selected</p>
                            ) : (
                                <p className="text-sm text-gray-500">No image selected</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;

// ---------------- REUSABLE COMPONENTS ----------------
function InputRow({ label, value, onChange, type = "text", placeholder = "", min, max, step }) {
    return (
        <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">
                {label}
            </label>
            <input
                value={value}
                onChange={onChange}
                type={type}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition text-base md:text-lg"
            />
        </div>
    );
}

function FileInputRow({ label, onChange }) {
    return (
        <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    onChange={onChange}
                    type="file"
                    accept="image/*"
                    className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
            </div>
            <p className="text-sm text-gray-500 mt-1">
                Supports: JPG, PNG, WEBP (Max 5MB)
            </p>
        </div>
    );
}