import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import getOrderByOrderIdApi from "@/services/dashboard/order/getOrderByOrderIdApi";
import confirmOrderApi from "@/services/dashboard/order/confirmOrderApi";
import cancelOrderApi from "@/services/dashboard/order/cancelOrderApi";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  Tag,
  ShoppingBag,
  XCircle,
  FileText,
  MessageSquare,
  Download
} from "lucide-react";

function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [serialNumbers, setSerialNumbers] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: orderData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['orderDetails', orderId],
    queryFn: () => getOrderByOrderIdApi(orderId),
  });

  const { mutate: confirmMutate, isLoading: isConfirming } = useMutation({
    mutationFn: (serialData) => confirmOrderApi(orderId, serialData),
    onSuccess: (data) => {
      console.log("Order confirmed successfully:", data);
      window.showToast?.("Order confirmed successfully!", "success");
      refetch();
      navigate("/dashboard/ordercontrol/accepted-orders");
    },
    onError: (error) => {
      console.log("Error confirming order:", error);
      window.showToast?.("Error confirming order. Please try again.", "error");
    }
  });

  const { mutate: cancelMutate, isLoading: isCancelling } = useMutation({
    mutationFn: () => cancelOrderApi(orderId),
    onSuccess: (data) => {
      console.log("Order cancelled successfully:", data);
      window.showToast?.("Order cancelled successfully!", "success");
      refetch();
    },
    onError: (error) => {
      console.log("Error cancelling order:", error);
      window.showToast?.("Error cancelling order. Please try again.", "error");
    }
  });

// Download Invoice Handler - Direct Link Method
const handleDownloadInvoice = () => {
  const order = orderData?.data;
  if (!order || !order.invoiceUrl) {
    window.showToast?.("Invoice not available for this order", "error");
    return;
  }

  try {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = order.invoiceUrl;
    link.download = `invoice_${order.orderId}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.showToast?.("Invoice download started!", "success");
  } catch (error) {
    console.error("Error downloading invoice:", error);
    window.showToast?.("Failed to download invoice. Please try again.", "error");
  }
};

  // Open Invoice in New Tab
  const handleViewInvoice = () => {
    const order = orderData?.data;
    if (!order || !order.invoiceUrl) {
      window.showToast?.("Invoice not available for this order", "error");
      return;
    }
    window.open(order.invoiceUrl, '_blank');
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Order
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'An error occurred while fetching order details'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
                className="btn btn-outline"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const order = orderData?.data || {};
  const {
    customerName,
    customerPhone,
    customerEmail,
    deliverAddress,
    city,
    postalCode,
    paymentMethod,
    insideDhaka,
    shippingCost,
    products = [],
    orderStatus,
    discount,
    totalAmount,
    createdAt,
    updatedAt,
    notes,
    invoiceUrl
  } = order;

  const subtotal = totalAmount - shippingCost + (discount || 0);

  // Helper functions
  const formatDateTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (value) => {
    const num = Number(value || 0);
    return `৳${num.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
    Processing: { color: "bg-blue-100 text-blue-800", icon: Loader2 },
    Shipped: { color: "bg-indigo-100 text-indigo-800", icon: Truck },
    Delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    Cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    Confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle }
  };

  const StatusIcon = statusConfig[orderStatus]?.icon || AlertCircle;

  const handleConfirmOrder = () => {
    const confirmationData = {};
    console.log("Confirming order:", orderId);
    confirmMutate(confirmationData);
  };

  const handleCancelOrder = () => {
    if (window.confirm(`Are you sure you want to cancel order #${order.orderId}? This action cannot be undone.`)) {
      cancelMutate();
    }
  };

  const canCancel = ["Pending", "Confirmed", "Processing"].includes(orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Order #{order?.orderId}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(createdAt)}
                </span>
                {updatedAt && updatedAt !== createdAt && (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Updated: {formatDateTime(updatedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                <Package className="h-4 w-4" />
                {products.length} {products.length === 1 ? 'Item' : 'Items'}
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig[orderStatus]?.color || "bg-gray-100"}`}>
                <StatusIcon className="h-4 w-4" />
                {orderStatus}
              </div>
              
              {/* Invoice Download Button */}
              {invoiceUrl && (
                <div className="flex gap-2">
                  <button
                    onClick={handleViewInvoice}
                    className="btn btn-outline btn-sm"
                    title="View Invoice"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                    className="btn btn-primary btn-sm"
                    title="Download Invoice"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Customer, Notes & Shipping Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Customer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                    <p className="text-sm font-medium text-gray-900 mt-1">{customerName || "-"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customerPhone || "-"}
                    </p>
                  </div>
                </div>
                
                {customerEmail && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {customerEmail}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</label>
                  <p className="text-sm text-gray-900 mt-1 flex items-start gap-1">
                    <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>
                      {deliverAddress || "-"}
                      {city && `, ${city}`}
                      {postalCode && `, ${postalCode}`}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Order Notes</h2>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                  Customer Notes
                </label>
                {notes ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No notes provided</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</label>
                    <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Zone</label>
                    <p className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {insideDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatMoney(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Discount
                      </span>
                      <span className="text-green-600 font-medium">-{formatMoney(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="font-medium">{formatMoney(shippingCost)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatMoney(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              <p className="text-sm text-gray-600 mt-1">Total items: {products.length}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {products.map((p, idx) => {
                  const baseProduct = typeof p.productId === "object" ? p.productId : null;
                  const title = p.productName || baseProduct?.title || `Product ${idx + 1}`;
                  const unitPrice = p.productPrice || baseProduct?.finalPrice || 0;
                  const productImage = p.productId?.images?.[0];

                  return (
                    <div key={p._id || idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {productImage && (
                            <img
                              src={productImage}
                              alt={title}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-600 mt-1">Unit Price: {formatMoney(unitPrice)}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">Quantity: {p.productQuantity || 1}</span>
                              <span className="text-sm font-medium">
                                Total: {formatMoney(unitPrice * (p.productQuantity || 1))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              {/* Left side - Status dependent actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {orderStatus === "Pending" ? (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="btn btn-outline btn-error"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                ) : orderStatus === "Cancelled" ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">This order has been cancelled</span>
                  </div>
                ) : orderStatus === "Delivered" ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Order delivered successfully</span>
                  </div>
                ) : (
                  canCancel && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                      className="btn btn-outline btn-error"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )
                )}
              </div>

              {/* Right side - Navigation and Confirm */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Invoice Actions */}
                {invoiceUrl && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleViewInvoice}
                      className="btn btn-outline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                    </button>
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={isDownloading}
                      className="btn btn-outline"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => navigate("/dashboard/ordercontrol/accepted-orders")}
                  className="btn btn-outline px-6"
                >
                  Back to Orders
                </button>
                
                {orderStatus === "Pending" && (
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isConfirming}
                    className="btn btn-primary px-8"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;