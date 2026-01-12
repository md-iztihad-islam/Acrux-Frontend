import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar,
  Phone,
  User
} from "lucide-react";
import getPendingOrdersApi from "@/services/dashboard/order/getPendingOrdersApi";

function ReceivedOrders() {
  const navigate = useNavigate();

  const { 
    data: pendingOrdersData, 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ['pendingOrdersData'],
    queryFn: () => getPendingOrdersApi(),
  });

  console.log('Pending Orders Data:', pendingOrdersData?.data);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading pending orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
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

  const orders = pendingOrdersData?.data || [];

  // Calculate statistics
  const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.products?.length || 0), 0);
  const dhakaOrders = orders.filter(order => order.area === 'Dhaka').length;
  const latestOrderId = orders.length > 0 ? `#${orders[0].orderId}` : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Pending Orders
              </h1>
              <p className="text-gray-600 mt-2">
                Review and manage orders awaiting confirmation
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-gray-700">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
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
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalItems}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dhaka Area</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dhakaOrders}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latest Order</p>
                  <p className="text-lg font-bold text-gray-900">
                    {latestOrderId}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 hidden lg:grid grid-cols-12 gap-4">
            <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </div>
            <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Order Details
            </div>
            <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Products
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </div>
          </div>

          {/* Orders */}
          {orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No pending orders
              </h3>
              <p className="text-gray-500">
                All orders have been processed or there are no new orders
              </p>
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
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                          #{order.orderId}
                        </span>
                        <p className="text-sm text-gray-500">
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

                    <div className="space-y-3">
                      {order.customerName && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{order.customerName}</span>
                        </div>
                      )}
                      
                      {order.customerPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{order.customerPhone}</span>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{order.deliverAddress}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Products</h4>
                      <div className="space-y-2">
                        {order.products?.map((product, pIdx) => (
                          <div
                            key={product._id}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <div>
                              <p className="font-medium text-sm">
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

                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={() => navigate(`details/${order._id}`)}
                        className="btn btn-outline btn-primary flex-1"
                      >
                        View Details
                      </button>
                      <button className="btn btn-success flex-1">
                        Accept Order
                      </button>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {idx + 1}
                      </div>
                    </div>
                    
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          #{order.orderId}
                        </span>
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {order.customerName}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliverAddress}</span>
                      </p>
                      {order.createdAt && (
                        <p className="text-xs text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      )}
                    </div>
                    
                    <div className="col-span-4">
                      <div className="space-y-2">
                        {order.products?.map((product, pIdx) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium truncate max-w-xs">
                              {pIdx + 1}. {product.productId?.title || product.productName || 'Product'}
                            </span>
                            <div className="flex items-center gap-6">
                              <span className="text-gray-500 w-[40px]">
                                Qty: {product.productQuantity}
                              </span>
                              {product.productPrice && (
                                <span className="font-semibold">
                                  {formatCurrency(product.productPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                    
                    <div className="col-span-1">
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
                  Showing {orders.length} of {orders.length} pending orders
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Total: {formatCurrency(totalValue)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceivedOrders;