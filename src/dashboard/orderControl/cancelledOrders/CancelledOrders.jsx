import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import getCancelledOrdersApi from "@/services/dashboard/order/getCancelledOrdersApi";
import {
  XCircle,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
  MessageSquare,
  Clock
} from "lucide-react";

function CancelledOrders() {
  const navigate = useNavigate();

  const {
    data: cancelledData,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['cancelledOrdersData'],
    queryFn: () => getCancelledOrdersApi(),
  });

  const orders = cancelledData?.data || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get cancellation time from updatedAt if orderStatus is Cancelled
  const getCancellationDate = (order) => {
    if (order.orderStatus === "Cancelled" && order.updatedAt) {
      return order.updatedAt;
    }
    return order.cancelledAt || order.updatedAt;
  };

  // Calculate statistics based on your data structure
  const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.products?.reduce((prodSum, prod) => prodSum + (prod.productQuantity || 0), 0) || 0), 0);
  const totalOrders = orders.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-lg text-gray-600">Loading cancelled orders...</p>
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
              {error?.message || 'An error occurred while fetching cancelled orders'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => refetch()}
                className="btn btn-outline btn-error"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
                className="btn btn-outline"
              >
                Back to Active Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Cancelled Orders
              </h1>
              <p className="text-gray-600 mt-2">
                View all cancelled orders
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-full">
              <XCircle className="h-6 w-6" />
              <span>{totalOrders} {totalOrders === 1 ? 'Cancelled Order' : 'Cancelled Orders'}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrders}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lost Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalItems}
                  </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Cancelled</p>
                  <p className="text-lg font-bold text-gray-900">
                    {orders.length > 0 ? `#${orders[0].orderId}` : 'N/A'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Cancelled Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Order Details
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Customer
            </div>
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Products
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Timeline
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <XCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No cancelled orders
                </h3>
                <p className="text-gray-500 mb-6">
                  There are no cancelled orders at the moment.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/dashboard/ordercontrol/pending-orders")}
                    className="btn btn-primary"
                  >
                    View Pending Orders
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
                    className="btn btn-outline"
                  >
                    View Accepted Orders
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order, idx) => {
                const cancellationDate = getCancellationDate(order);
                const totalItemsInOrder = order.products?.reduce((sum, prod) => sum + (prod.productQuantity || 0), 0) || 0;
                
                return (
                  <div
                    key={order._id}
                    className="p-4 md:p-6 hover:bg-red-50/30 transition-colors duration-150"
                  >
                    {/* Mobile View */}
                    <div className="lg:hidden space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                              <XCircle className="h-3 w-3" />
                              Cancelled
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">#{order.orderId}</p>
                            <p className="text-sm text-gray-500">Order {idx + 1}</p>
                          </div>
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
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">{order.customerName || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{order.customerPhone || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{order.deliverAddress || "N/A"}</span>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Products ({order.products?.length || 0})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                          {order.products?.map((product, pIdx) => (
                            <div
                              key={product._id}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm line-clamp-1">
                                  {pIdx + 1}. {product.productName || "Product"}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-xs text-gray-500">
                                    Qty: {product.productQuantity || 1}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Price: {formatCurrency(product.productPrice)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm font-semibold">
                                {formatCurrency((product.productPrice || 0) * (product.productQuantity || 1))}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline & Notes */}
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Timeline & Notes
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">
                              Ordered: {formatDate(order.createdAt)}
                            </span>
                          </div>
                          {cancellationDate && (
                            <div className="flex items-center gap-2 text-sm">
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span className="text-red-700 font-medium">
                                Cancelled: {formatDate(cancellationDate)}
                              </span>
                            </div>
                          )}
                          {order.notes && (
                            <div className="flex items-start gap-2 text-sm mt-2">
                              <MessageSquare className="h-3 w-3 text-gray-500 mt-1 flex-shrink-0" />
                              <div className="bg-gray-50 rounded p-2 flex-1">
                                <span className="text-gray-600">
                                  <span className="font-medium">Notes:</span> {order.notes}
                                </span>
                              </div>
                            </div>
                          )}
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
                          onClick={() => console.log("Restore order:", order._id)}
                          className="btn btn-outline btn-success flex-1"
                        >
                          Restore
                        </button>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                      {/* Serial Number */}
                      <div className="col-span-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-800 font-semibold">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="col-span-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            #{order.orderId}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancelled
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {totalItemsInOrder} items
                        </p>
                      </div>

                      {/* Customer */}
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {order.customerName || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customerPhone || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {order.deliverAddress || "N/A"}
                        </p>
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
                                {pIdx + 1}. {product.productName || "Product"}
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500">
                                  Qty: {product.productQuantity || 1}
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency((product.productPrice || 0) * (product.productQuantity || 1))}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="col-span-2 space-y-2">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Ordered: {formatDate(order.createdAt).split(',')[0]}</span>
                          </div>
                          {cancellationDate && (
                            <div className="flex items-center gap-1 text-red-600 mt-1">
                              <XCircle className="h-3 w-3" />
                              <span>Cancelled: {formatDate(cancellationDate).split(',')[0]}</span>
                            </div>
                          )}
                        </div>
                        {order.notes && (
                          <div className="text-xs text-gray-500 line-clamp-2">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={() => navigate(`details/${order._id}`)}
                          className="btn btn-outline btn-primary btn-sm flex-1"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => console.log("Restore order:", order._id)}
                          className="btn btn-outline btn-success btn-sm flex-1"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {orders.length} cancelled orders
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span>Total Lost Revenue: {formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {orders.length === 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard/ordercontrol/pending-orders")}
              className="btn btn-primary"
            >
              View Pending Orders
            </button>
            <button
              onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
              className="btn btn-outline"
            >
              View Accepted Orders
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CancelledOrders;