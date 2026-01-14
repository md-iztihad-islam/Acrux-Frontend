import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getAcceptedOrdersApi from "@/services/dashboard/order/getAcceptedOrdersApi";
import {
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Phone,
  ShoppingBag,
  AlertCircle,
  Loader2
} from "lucide-react";

function AcceptedOrders() {
  const navigate = useNavigate();

  const {
    data: accepteddata,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['acceptedOrdersData'],
    queryFn: () => getAcceptedOrdersApi(),
  });

  const orders = accepteddata?.data || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading accepted orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Unable to Load Orders
            </h2>
            <p className="text-red-600 mb-4">
              {error?.message || 'An error occurred while fetching orders'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-error"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.products?.length || 0), 0);
  const averageOrderValue = orders.length > 0 ? totalValue / orders.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Accepted Orders
              </h1>
              <p className="text-gray-600 mt-2">
                Orders that have been confirmed and are being processed
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full">
              <CheckCircle className="h-6 w-6" />
              <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalItems}
                  </p>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Order</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(averageOrderValue)}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Order #
            </div>
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Customer & Shipping
            </div>
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Products
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Order Details
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No accepted orders
                </h3>
                <p className="text-gray-500 mb-6">
                  All accepted orders will appear here. Check back later or review pending orders.
                </p>
                <button
                  onClick={() => navigate("/dashboard/ordercontrol/pending-orders")}
                  className="btn btn-primary"
                >
                  View Pending Orders
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order, idx) => (
                <div
                  key={order._id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Mobile View */}
                  <div className="lg:hidden space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                          <CheckCircle className="h-3 w-3" />
                          #{order.orderId}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Order {idx + 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        {order.createdAt && (
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                      {(order.customerName || order.customerPhone) && (
                        <div className="flex items-center gap-3">
                          {order.customerName && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">{order.customerName}</span>
                            </div>
                          )}
                          {order.customerPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{order.customerPhone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{order.deliverAddress}</span>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Products ({order.products?.length || 0})</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {order.products?.map((product, pIdx) => (
                          <div
                            key={product._id}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <div>
                              <p className="font-medium text-sm line-clamp-1">
                                {pIdx + 1}. {product.productId?.title || product.productName || 'Product'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {product.productQuantity}
                              </p>
                            </div>
                            {product.productPrice && (
                              <p className="text-sm font-semibold">
                                {formatCurrency(product.productPrice)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={() => navigate(`details/${order._id}`)}
                        className="btn btn-outline btn-primary flex-1"
                      >
                        View Details
                      </button>
                      <button
                        // onClick={() => console.log("Process order:", order._id)}
                        className="btn btn-success flex-1"
                      >
                        Process
                      </button>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    {/* Order ID */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          #{order.orderId}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Shipping */}
                    <div className="col-span-3 space-y-2">
                      {order.customerName && (
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {order.customerName}
                        </p>
                      )}
                      {order.customerPhone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {order.customerPhone}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliverAddress}</span>
                      </p>
                      {order.createdAt && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </p>
                      )}
                    </div>

                    {/* Products */}
                    <div className="col-span-3">
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {order.products?.map((product, pIdx) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium truncate max-w-xs">
                              {pIdx + 1}. {product.productId?.title || product.productName || 'Product'}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500">
                                Qty: {product.productQuantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="col-span-2 space-y-1">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Items: {order.products?.length || 0}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex gap-2">
                      <button
                        onClick={() => navigate(`details/${order._id}`)}
                        className="btn btn-outline btn-primary btn-sm flex-1"
                      >
                        Details
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {orders.length} accepted orders
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Total Value: {formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State Action */}
        {orders.length === 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/dashboard/ordercontrol/pending-orders")}
              className="btn btn-outline btn-primary"
            >
              <Package className="h-4 w-4 mr-2" />
              View Pending Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptedOrders;