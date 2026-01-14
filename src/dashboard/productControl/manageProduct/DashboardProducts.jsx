import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getAllProductsApi from "@/services/dashboard/product/getAllProductsApi";
import deleteProductApi from "@/services/dashboard/product/deleteProductApi";

function DashboardProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const queryClient = useQueryClient();

  // Fetch products - handle different response structures
  const { 
    data: apiResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProductsApi(),
    refetchOnWindowFocus: false,
  });

  // Extract products from API response
  const products = apiResponse?.data?.products || apiResponse?.data || apiResponse || [];
  
  // Ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Delete product mutation
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (productId) => deleteProductApi(productId),
    onSuccess: () => {
      window.showToast("Product deleted successfully", "success");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      window.showToast("Error deleting product", "error");
    },
  });

  // Filter and sort products
  const filteredProducts = safeProducts
    .filter(product => {
      if (!product || typeof product !== 'object') return false;
      
      const title = product.title || '';
      const productId = product.productId || '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           productId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || 
                           (filterStatus === "inStock" && (product.stockQuantity || 0) > 0) ||
                           (filterStatus === "outOfStock" && (product.stockQuantity || 0) === 0) ||
                           (filterStatus === "lowStock" && (product.stockQuantity || 0) < 10 && (product.stockQuantity || 0) > 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        const aTitle = a.title || '';
        const bTitle = b.title || '';
        return sortOrder === "asc" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      }
      if (sortBy === "stockQuantity") {
        const aStock = a.stockQuantity || 0;
        const bStock = b.stockQuantity || 0;
        return sortOrder === "asc" ? aStock - bStock : bStock - aStock;
      }
      if (sortBy === "finalPrice") {
        const aPrice = a.finalPrice || 0;
        const bPrice = b.finalPrice || 0;
        return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }
      if (sortBy === "createdAt") {
        const aDate = new Date(a.createdAt || 0);
        const bDate = new Date(b.createdAt || 0);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });

  // Calculate dashboard stats
  const stats = {
    totalProducts: safeProducts.length,
    totalStock: safeProducts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0),
    totalValue: safeProducts.reduce((sum, p) => sum + ((p.stockQuantity || 0) * (p.finalPrice || 0)), 0),
    lowStockProducts: safeProducts.filter(p => (p.stockQuantity || 0) < 10 && (p.stockQuantity || 0) > 0).length,
    outOfStockProducts: safeProducts.filter(p => (p.stockQuantity || 0) === 0).length,
  };

  // Handle product selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      window.showToast("Select products to delete", "warning");
      return;
    }
    
    if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
      selectedProducts.forEach(productId => {
        deleteProduct(productId);
      });
      setSelectedProducts([]);
    }
  };

  // Handle delete single product
  const handleDeleteProduct = (productId, productTitle) => {
    if (window.confirm(`Delete "${productTitle || 'this product'}"?`)) {
      deleteProduct(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Debug: Check API response structure
  // console.log('API Response:', apiResponse);
  // console.log('Products:', products);
  // console.log('Safe Products:', safeProducts);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your products, stock, and pricing</p>
              <div className="mt-2 text-sm text-gray-500">
                Showing {safeProducts.length} product(s)
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/dashboard/products/add"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Add New Product
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Stock</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalStock}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock (&lt;10)</option>
                <option value="outOfStock">Out of Stock</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="title">Sort by Name</option>
                <option value="stockQuantity">Sort by Stock</option>
                <option value="finalPrice">Sort by Price</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>

              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedProducts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    {filteredProducts.length > 0 && (
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(filteredProducts.map(p => p._id || p.id).filter(id => id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-lg">No products found</p>
                        <p className="text-sm mt-1">
                          {searchTerm ? "Try a different search term" : "Add your first product"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const productId = product._id || product.id;
                    const productTitle = product.title || 'Untitled Product';
                    
                    return (
                      <tr key={productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(productId)}
                            onChange={() => handleSelectProduct(productId)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={productTitle}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{productTitle}</p>
                              <p className="text-sm text-gray-500">ID: {product.productId || 'N/A'}</p>
                              {product.subTitle && (
                                <p className="text-xs text-gray-400 mt-1">{product.subTitle}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (product.stockQuantity || 0) === 0
                                ? "bg-red-100 text-red-800"
                                : (product.stockQuantity || 0) < 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {(product.stockQuantity || 0)} units
                            </span>
                            {(product.stockQuantity || 0) < 10 && (product.stockQuantity || 0) > 0 && (
                              <span className="text-xs text-yellow-600">Low Stock</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              ৳{(product.finalPrice || 0).toFixed(2)}
                            </p>
                            {(product.discountAmount || 0) > 0 && (
                              <div className="text-sm text-gray-500">
                                <span className="line-through">৳{(product.mainPrice || 0).toFixed(2)}</span>
                                <span className="text-green-600 ml-2">
                                  -৳{(product.discountAmount || 0).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (product.stockQuantity || 0) === 0
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {(product.stockQuantity || 0) === 0 ? "Out of Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`edit-product/${productId}`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(productId, productTitle)}
                              disabled={isDeleting}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (if needed) */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {safeProducts.length} products
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  1
                </button>
                <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardProducts;