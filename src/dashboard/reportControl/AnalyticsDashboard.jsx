import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import getAllOrdersApi from "@/services/dashboard/order/getAllOrdersApi";
import getPendingOrdersApi from "@/services/dashboard/order/getPendingOrdersApi";
import getAcceptedOrdersApi from "@/services/dashboard/order/getAcceptedOrdersApi";
import getCancelledOrdersApi from "@/services/dashboard/order/getCancelledOrdersApi";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
  Target,
  Percent,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck
} from "lucide-react";

function AnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState("month");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Fetch all orders (based on your console.log: 4 orders total)
  const { data: allOrdersResponse, isLoading: isLoadingAll, error: errorAll } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => getAllOrdersApi(),
    refetchOnWindowFocus: false
  });

  // Fetch pending orders (based on your console.log: 1 order)
  const { data: pendingOrdersResponse, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: () => getPendingOrdersApi(),
    refetchOnWindowFocus: false
  });

  // Fetch accepted orders (based on your console.log: 2 orders)
  const { data: acceptedOrdersResponse, isLoading: isLoadingAccepted } = useQuery({
    queryKey: ['acceptedOrders'],
    queryFn: () => getAcceptedOrdersApi(),
    refetchOnWindowFocus: false
  });

  // Fetch cancelled orders (based on your console.log: no cancelled orders)
  const { data: cancelledOrdersResponse, isLoading: isLoadingCancelled } = useQuery({
    queryKey: ['cancelledOrders'],
    queryFn: () => getCancelledOrdersApi(),
    refetchOnWindowFocus: false
  });

  // Extract data from responses
  const allOrders = allOrdersResponse?.data || [];
  const pendingOrders = pendingOrdersResponse?.data || [];
  const acceptedOrders = acceptedOrdersResponse?.data || [];
  const cancelledOrders = cancelledOrdersResponse?.data || [];

  // console.log("All Orders Data:", allOrdersResponse?.data);
  // console.log("Pending Orders Data:", pendingOrdersResponse?.data);
  // console.log("Accepted Orders Data:", acceptedOrdersResponse?.data);
  // console.log("Cancelled Orders Data:", cancelledOrdersResponse?.data);

  const isLoading = isLoadingAll || isLoadingPending || isLoadingAccepted || isLoadingCancelled;
  const error = errorAll;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatShortCurrency = (amount) => {
    if (amount >= 1000000) {
      return `৳${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `৳${(amount / 1000).toFixed(1)}K`;
    }
    return `৳${amount}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Calculate all analytics from the order lists
  const analytics = useMemo(() => {
    // Combine all orders for filtering
    const combinedOrders = [...allOrders];
    
    // Filter orders by date range
    const filteredOrders = combinedOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end date
      return orderDate >= start && orderDate <= end;
    });

    // Calculate metrics from filtered orders
    const totalOrders = filteredOrders.length;
    const totalSales = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Calculate total items sold
    const totalItems = filteredOrders.reduce((sum, order) => 
      sum + (order.products?.reduce((prodSum, prod) => prodSum + (prod.productQuantity || 0), 0) || 0), 0);
    
    // Profit calculation (assuming 30% profit margin)
    const profitMargin = 30; // Percentage
    const totalCost = totalSales * (1 - profitMargin/100);
    const totalProfit = totalSales - totalCost;
    
    // Orders by status
    const pendingCount = filteredOrders.filter(order => order.orderStatus === "Pending").length;
    const acceptedCount = filteredOrders.filter(order => order.orderStatus === "Accepted").length;
    const cancelledCount = filteredOrders.filter(order => order.orderStatus === "Cancelled").length;
    const deliveredCount = filteredOrders.filter(order => order.orderStatus === "Delivered").length;
    
    // Cancelled orders metrics
    const cancelledOrders = filteredOrders.filter(order => order.orderStatus === "Cancelled");
    const cancelledSales = cancelledOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const cancelledItems = cancelledOrders.reduce((sum, order) => 
      sum + (order.products?.reduce((prodSum, prod) => prodSum + (prod.productQuantity || 0), 0) || 0), 0);
    
    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Timeline data for charts - group by day
    const timelineData = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!timelineData[date]) {
        timelineData[date] = { sales: 0, orders: 0, items: 0 };
      }
      timelineData[date].sales += (order.totalAmount || 0);
      timelineData[date].orders += 1;
      timelineData[date].items += (order.products?.reduce((prodSum, prod) => prodSum + (prod.productQuantity || 0), 0) || 0);
    });
    
    // Top products
    const productSales = {};
    filteredOrders.forEach(order => {
      order.products?.forEach(product => {
        const productName = product.productName || `Product ${product.productId}`;
        const sales = (product.productPrice || 0) * (product.productQuantity || 0);
        if (!productSales[productName]) {
          productSales[productName] = { sales: 0, quantity: 0, orders: 0 };
        }
        productSales[productName].sales += sales;
        productSales[productName].quantity += (product.productQuantity || 0);
        productSales[productName].orders += 1;
      });
    });
    
    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    // Customer analysis
    const customers = {};
    filteredOrders.forEach(order => {
      const customerKey = order.customerPhone || order.customerName || 'Unknown';
      if (!customers[customerKey]) {
        customers[customerKey] = {
          name: order.customerName || 'Unknown',
          phone: order.customerPhone || 'N/A',
          orders: 0,
          totalSpent: 0
        };
      }
      customers[customerKey].orders += 1;
      customers[customerKey].totalSpent += (order.totalAmount || 0);
    });
    
    const topCustomers = Object.values(customers)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    
    // Calculate growth compared to previous period
    const prevPeriodStart = new Date(startDate);
    const prevPeriodEnd = new Date(startDate);
    const periodLength = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    prevPeriodStart.setDate(prevPeriodStart.getDate() - periodLength - 1);
    prevPeriodEnd.setDate(prevPeriodEnd.getDate() - 1);
    
    const prevPeriodOrders = combinedOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= prevPeriodStart && orderDate <= prevPeriodEnd;
    });
    
    const prevPeriodSales = prevPeriodOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const salesGrowth = prevPeriodSales > 0 ? ((totalSales - prevPeriodSales) / prevPeriodSales) * 100 : totalSales > 0 ? 100 : 0;
    
    // Calculate conversion rate (Accepted + Delivered / Total)
    const conversionRate = totalOrders > 0 
      ? ((acceptedCount + deliveredCount) / totalOrders) * 100 
      : 0;
    
    return {
      totalOrders,
      totalSales,
      totalItems,
      totalProfit,
      profitMargin,
      cancelledOrders: cancelledCount,
      cancelledSales,
      cancelledItems,
      avgOrderValue,
      pendingOrders: pendingCount,
      acceptedOrders: acceptedCount,
      deliveredOrders: deliveredCount,
      timelineData,
      topProducts,
      topCustomers,
      salesGrowth,
      conversionRate,
      filteredOrders,
      uniqueCustomers: Object.keys(customers).length
    };
  }, [allOrders, pendingOrders, acceptedOrders, cancelledOrders, startDate, endDate]);

  const timeFilters = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" }
  ];

  // Set date range based on time filter
  useEffect(() => {
    const today = new Date();
    let start = new Date();
    
    switch(timeFilter) {
      case 'today':
        start = today;
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return; // Don't change dates for custom
    }
    
    if (timeFilter !== 'custom') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  }, [timeFilter]);

  const refreshAllData = () => {
    const queryClient = require('@tanstack/react-query').useQueryClient();
    queryClient.invalidateQueries(['allOrders']);
    queryClient.invalidateQueries(['pendingOrders']);
    queryClient.invalidateQueries(['acceptedOrders']);
    queryClient.invalidateQueries(['cancelledOrders']);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Analytics
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'An error occurred while fetching data'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={refreshAllData}
                className="btn btn-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timelineEntries = Object.entries(analytics.timelineData).slice(0, 7);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time analytics calculated from your orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={refreshAllData}
                className="btn btn-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
              <button className="btn btn-outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Time Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Time Period:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeFilter === filter.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {timeFilter === "custom" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={refreshAllData}
                      className="btn btn-primary"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(analytics.totalSales)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {analytics.salesGrowth >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +{analytics.salesGrowth.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 font-medium">
                        {analytics.salesGrowth.toFixed(1)}%
                      </span>
                    </>
                  )}
                  <span className="text-sm text-gray-500">vs previous</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(analytics.totalOrders)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-700">
                    Avg: {formatCurrency(analytics.avgOrderValue)}
                  </span>
                  <span className="text-sm text-gray-500">per order</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Estimated Profit */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(analytics.totalProfit)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Percent className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Margin: {analytics.profitMargin}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatNumber(analytics.uniqueCustomers)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-teal-500" />
                  <span className="text-sm text-gray-700">
                    {analytics.filteredOrders.length > 0 
                      ? (analytics.filteredOrders.length / analytics.uniqueCustomers).toFixed(1) 
                      : 0} orders per customer
                  </span>
                </div>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {analytics.pendingOrders}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Accepted Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted Orders</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {analytics.acceptedOrders}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled Orders</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {analytics.cancelledOrders}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {analytics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                <p className="text-sm text-gray-600">Current order distribution</p>
              </div>
              <PieChart className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {[
                { status: "Pending", count: analytics.pendingOrders, color: "bg-yellow-500", icon: AlertTriangle },
                { status: "Accepted", count: analytics.acceptedOrders, color: "bg-blue-500", icon: CheckCircle },
                { status: "Delivered", count: analytics.deliveredOrders, color: "bg-green-500", icon: CheckCircle },
                { status: "Cancelled", count: analytics.cancelledOrders, color: "bg-red-500", icon: XCircle },
              ].map((item) => {
                const percentage = analytics.totalOrders > 0 
                  ? (item.count / analytics.totalOrders) * 100 
                  : 0;
                const Icon = item.icon;
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium text-gray-700">{item.status}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales Timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sales Timeline</h3>
                <p className="text-sm text-gray-600">Daily revenue over time</p>
              </div>
              <LineChart className="h-5 w-5 text-gray-500" />
            </div>
            {timelineEntries.length > 0 ? (
              <>
                <div className="h-64 flex flex-col justify-end">
                  <div className="flex items-end h-48 gap-2">
                    {timelineEntries.map(([date, data]) => {
                      const maxSales = Math.max(...timelineEntries.map(([_, d]) => d.sales));
                      const height = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
                      return (
                        <div key={date} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex justify-center">
                            <div 
                              className="w-3/4 bg-primary rounded-t-lg transition-all duration-300 hover:bg-primary-dark"
                              style={{ height: `${height}%` }}
                              title={`${date}: ${formatCurrency(data.sales)}`}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                            {date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {timelineEntries.slice(0, 3).map(([date, data]) => (
                    <div key={date} className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900">{date}</p>
                      <p className="text-sm text-primary font-semibold">
                        {formatShortCurrency(data.sales)}
                      </p>
                      <p className="text-xs text-gray-500">{data.orders} orders</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No data for selected period</p>
                  <p className="text-sm text-gray-400">Try a different time range</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <p className="text-sm text-gray-600">Best performing products</p>
              </div>
              <Target className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(product.quantity)} units • {product.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(product.sales)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {analytics.totalSales > 0 ? ((product.sales / analytics.totalSales) * 100).toFixed(1) : 0}% of sales
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
                <p className="text-sm text-gray-600">Most valuable customers</p>
              </div>
              <UserCheck className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {analytics.topCustomers.length > 0 ? (
                analytics.topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.phone} • {customer.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Avg: {formatCurrency(customer.totalSpent / customer.orders)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No customer data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Time Period</p>
              <p className="font-semibold text-gray-900">
                {timeFilters.find(f => f.value === timeFilter)?.label || timeFilter}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Package className="h-5 w-5 text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Items Sold</p>
              <p className="font-semibold text-gray-900">
                {formatNumber(analytics.totalItems)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Date Range</p>
              <p className="font-semibold text-gray-900">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-gray-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Avg Order Value</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(analytics.avgOrderValue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;