import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import getProductByIdApi from "@/services/dashboard/product/getProductByIdApi";
import updateProductApi from "@/services/dashboard/product/updateProductApi";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);

  // Use a single formData object for all form fields
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    image: null,
    stockQuantity: 0,
    mainPrice: 0,
    discountAmount: 0,
    finalPrice: 0
  });

  // console.log("Product ID from URL:", productId);

  // Fetch product data
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductByIdApi({productId}),
    enabled: !!productId && productId !== "undefined",
    retry: 1,
  });

  // Extract product data from API response
  const productData = apiResponse?.data || apiResponse || null;
  
  // console.log("API Response:", apiResponse);
  // console.log("Product Data:", productData);

  // Populate form when product data loads
  useEffect(() => {
    if (productData) {
      // console.log("Populating form with:", productData);
      setFormData({
        title: productData.title || "",
        subTitle: productData.subTitle || "",
        image: null, // Keep as null for new file upload
        stockQuantity: productData.stockQuantity || 0,
        mainPrice: productData.mainPrice || 0,
        discountAmount: productData.discountAmount || 0,
        finalPrice: productData.finalPrice || 0
      });
      if (productData.image) {
        setImagePreview(productData.image);
      }
    }
  }, [productData]);

  // Calculate final price
  const calculateFinalPrice = (mainPrice, discountAmount) => {
    const final = Math.max(0, mainPrice - discountAmount);
    return parseFloat(final.toFixed(2));
  };

  // Update form data and calculate final price
  const handleFormChange = (field, value) => {
    if (field === "mainPrice" || field === "discountAmount") {
      const newMainPrice = field === "mainPrice" ? parseFloat(value) || 0 : formData.mainPrice;
      const newDiscountAmount = field === "discountAmount" ? parseFloat(value) || 0 : formData.discountAmount;
      const newFinalPrice = calculateFinalPrice(newMainPrice, newDiscountAmount);
      
      setFormData(prev => ({
        ...prev,
        [field]: parseFloat(value) || 0,
        finalPrice: newFinalPrice
      }));
    } else if (field === "image") {
      const file = value;
      setFormData(prev => ({ ...prev, image: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: field === "stockQuantity" ? parseInt(value) || 0 : value
      }));
    }
  };

  // Update product mutation
  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({ productId, formData }) => {
      // console.log("Mutation called with:", { productId, formData });
      return updateProductApi(productId, formData);
    },
    onSuccess: (response) => {
      // console.log("Update success:", response);
      window.showToast("Product updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      navigate("/dashboard/products");
    },
    onError: (error) => {
      // console.error("Update error:", error);
      window.showToast(`Error updating product: ${error.message}`, "error");
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // console.log("Submitting form for product:", productId);
    // console.log("Form data to submit:", formData);
    
    // Validation
    if (!formData.title.trim()) {
      window.showToast("Title is required", "error");
      return;
    }

    if (formData.stockQuantity < 0) {
      window.showToast("Stock quantity cannot be negative", "error");
      return;
    }

    if (formData.mainPrice < 0) {
      window.showToast("Main price cannot be negative", "error");
      return;
    }

    if (formData.discountAmount < 0) {
      window.showToast("Discount amount cannot be negative", "error");
      return;
    }

    if (formData.discountAmount > formData.mainPrice) {
      window.showToast("Discount cannot be greater than main price", "error");
      return;
    }

    // Prepare data for submission
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("subTitle", formData.subTitle);
    if (formData.image) {
      submitData.append("image", formData.image);
    }
    submitData.append("stockQuantity", formData.stockQuantity);
    submitData.append("mainPrice", formData.mainPrice);
    submitData.append("discountAmount", formData.discountAmount);
    submitData.append("finalPrice", formData.finalPrice);

    // Log form data for debugging
    // console.log("FormData entries:");
    for (let pair of submitData.entries()) {
      // console.log(pair[0] + ': ' + pair[1]);
    }

    updateProduct({ 
      productId: productId, 
      formData: submitData 
    });
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Quick stock increment
  const handleStockIncrement = (amount) => {
    setFormData(prev => ({
      ...prev,
      stockQuantity: prev.stockQuantity + amount
    }));
  };

  // Quick discount percentage
  const handleQuickDiscount = (percent) => {
    const discount = (formData.mainPrice * percent) / 100;
    const finalPrice = calculateFinalPrice(formData.mainPrice, discount);
    
    setFormData(prev => ({
      ...prev,
      discountAmount: parseFloat(discount.toFixed(2)),
      finalPrice: finalPrice
    }));
  };

  if (!productId || productId === "undefined") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Invalid Product ID</h3>
          <p className="text-gray-600 mb-4">The product ID is missing or invalid.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
          <p className="text-sm text-gray-500 mt-2">Product ID: {productId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p>Error loading product data</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-4">The product with ID "{productId}" was not found.</p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/dashboard/products")}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Update Product</h1>
              <p className="text-gray-600 mt-1">Edit product details and pricing</p>
              {productData?.productId && (
                <p className="text-sm text-gray-500 mt-1">Product ID: {productData.productId}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Database ID: {productId}</p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Title
                    </label>
                    <input
                      type="text"
                      value={formData.subTitle}
                      onChange={(e) => handleFormChange("subTitle", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter product sub title (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleFormChange("stockQuantity", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      {[10, 50, 100].map(num => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => handleStockIncrement(num)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h2>
                
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="text-xs text-gray-500 mt-2">
                        {productData.image ? "Current image will be replaced" : "New image will be added"}
                      </div>
                    </div>
                  ) : productData.image ? (
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <p className="text-gray-500 mb-2">Current image exists</p>
                        <p className="text-sm text-gray-400 mb-4">Upload new image to replace it</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Upload product image</p>
                      <p className="text-sm text-gray-400 mb-4">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFormChange("image", e.target.files[0])}
                      className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Price (৳) *
                    </label>
                    <input
                      type="number"
                      value={formData.mainPrice}
                      onChange={(e) => handleFormChange("mainPrice", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Amount (৳)
                    </label>
                    <input
                      type="number"
                      value={formData.discountAmount}
                      onChange={(e) => handleFormChange("discountAmount", e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max={formData.mainPrice}
                      step="0.01"
                    />
                    
                    {/* Quick Discount Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[10, 20, 30, 50].map(percent => (
                        <button
                          type="button"
                          key={percent}
                          onClick={() => handleQuickDiscount(percent)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"
                        >
                          {percent}% Off
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleFormChange("discountAmount", 0)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded"
                      >
                        Clear Discount
                      </button>
                    </div>
                  </div>

                  {/* Final Price Display */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Final Price</p>
                        <p className="text-2xl font-bold text-green-800">
                          ৳{formData.finalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        {formData.discountAmount > 0 ? (
                          <>
                            <p className="text-sm text-green-600">
                              Saved: ৳{formData.discountAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-green-500">
                              ({((formData.discountAmount / formData.mainPrice) * 100).toFixed(1)}% off)
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-green-600">No discount applied</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{formData.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${
                      formData.stockQuantity === 0
                        ? "text-red-600"
                        : formData.stockQuantity < 10
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                      {formData.stockQuantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Main Price:</span>
                    <span className="font-medium">৳{formData.mainPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium">৳{formData.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-800 font-semibold">Final Price:</span>
                      <span className="text-green-700 font-bold">৳{formData.finalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    <Save className="w-5 h-5" />
                    {isUpdating ? "Updating..." : "Update Product"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/products")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Last updated: {productData?.updatedAt ? new Date(productData.updatedAt).toLocaleDateString() : "Never"}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;