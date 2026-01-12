import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Bell, Search, ChevronDown, Moon, Sun, Clock, RefreshCw, User, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import getAllOrdersApi from "@/services/dashboard/order/getAllOrdersApi";
import getAllProductsApi from "@/services/clientPart/allProducts/getAllProductsApi";
import getAcceptedOrdersApi from "@/services/dashboard/order/getAcceptedOrdersApi";
import getPendingOrdersApi from "@/services/dashboard/order/getPendingOrdersApi";

function DashboardLayout() {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage or system preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return JSON.parse(saved);
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([]);
    const [newNotificationCount, setNewNotificationCount] = useState(3);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [liveStats, setLiveStats] = useState({
        totalRevenue: 245890,
        todayOrders: 127,
        activeProducts: 89,
        customerGrowth: 12.5,
        pendingOrders: 23,
        conversionRate: 78.5
    });
  
    const wsRef = useRef(null);
    const refreshIntervalRef = useRef(null);
    const timeIntervalRef = useRef(null);

    // Fetch real data
    const { data: ordersData, refetch: refetchOrders } = useQuery({
        queryKey: ['allOrdersDashboard'],
        queryFn: () => getAllOrdersApi(),
        cacheTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        // refetchInterval: 30000 // Refetch every 30 seconds
    });

    const { data: productsData, refetch: refetchProducts } = useQuery({
        queryKey: ['allProductsDashboard'],
        queryFn: () => getAllProductsApi(),
        cacheTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        // refetchInterval: 30000 // Refetch every 30 seconds
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


    console.log("Orders Data:", ordersData?.data);
    console.log("Products Data:", productsData);

    // Calculate real-time stats
    useEffect(() => {
        if (ordersData?.data) {
        const orders = ordersData.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        }).length;

        const pendingOrders = pendingOrdersResponse?.data.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        const acceptedOrders = acceptedOrdersResponse?.data.length;
        const conversionRate = orders.length > 0 ? (acceptedOrders / orders.length) * 100 : 0;

        setLiveStats(prev => ({
            ...prev,
            todayOrders,
            pendingOrders,
            totalRevenue,
            conversionRate
        }));
        }

        if (productsData?.data?.products) {
        const activeProducts = productsData.data.products.filter(product => product.stockQuantity > 0).length;
        setLiveStats(prev => ({
            ...prev,
            activeProducts
        }));
        }
    }, [ordersData, productsData]);

  // Page titles mapping
  const pageTitles = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/couponcontrol": "Coupon Management",
    "/dashboard/productcontrol": "Product Management",
    "/dashboard/ordercontrol": "Order Management",
    "/dashboard/customercontrol": "Customer Management",
    "/dashboard/reportcontrol": "Analytics & Reports",
    "/dashboard/settings": "Settings",
  };

  const getPageTitle = () => {
    const matchingRoute = Object.keys(pageTitles)
      .sort((a, b) => b.length - a.length)
      .find(route => location.pathname.startsWith(route));
    
    return pageTitles[matchingRoute] || "Dashboard";
  };

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Real-time clock
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Simulate WebSocket connection
    const simulateWebSocket = () => {
      const ws = {
        onmessage: null,
        close: () => {},
        send: () => {}
      };
      
      // Simulate receiving messages
      const messageInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of new notification
          const newNotification = {
            id: Date.now(),
            type: ['order', 'alert', 'info'][Math.floor(Math.random() * 3)],
            title: ['New Order Received', 'Low Stock Alert', 'System Update'][Math.floor(Math.random() * 3)],
            message: `Order #${Math.floor(Math.random() * 10000)} just placed`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
          setNewNotificationCount(prev => prev + 1);
        }
      }, 15000); // Check every 15 seconds

      return { ws: ws, interval: messageInterval };
    };

    const { ws, interval } = simulateWebSocket();
    wsRef.current = ws;

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Refresh interval for live stats
  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        // Simulate live updates
        setLiveStats(prev => ({
          ...prev,
          todayOrders: prev.todayOrders + Math.floor(Math.random() * 3),
          totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 5000),
          pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 3) - 1)
        }));
        
        // Add some variation to growth
        setLiveStats(prev => ({
          ...prev,
          customerGrowth: Math.max(0, prev.customerGrowth + (Math.random() - 0.5))
        }));

        setTimeout(() => setIsRefreshing(false), 500);
      }
    }, 10000); // Update every 10 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isRefreshing]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchOrders();
    refetchProducts();
    
    // Simulate refresh animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setNewNotificationCount(0);
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatTime(currentTime)}
              </span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white mt-1">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-700 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Desktop Header */}
          <header className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Page Title and Info */}
                <div className="flex items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {getGreeting()}, Admin 👋
                      </h1>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{formatTime(currentTime)}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 rotate-270 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{getPageTitle()}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        ৳{liveStats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {liveStats.todayOrders} orders
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    title="Refresh live data"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-700 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                      Refresh
                    </span>
                  </button>

                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search orders, products..."
                      className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </form>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-700" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <div className="relative group">
                    <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      {newNotificationCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </button>
                    
                    {/* Notifications Panel */}
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                          {newNotificationCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === 'order' ? 'bg-green-100 dark:bg-green-900/30' :
                                  notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                                  'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                  <Bell className={`w-4 h-4 ${
                                    notification.type === 'order' ? 'text-green-600 dark:text-green-400' :
                                    notification.type === 'alert' ? 'text-red-600 dark:text-red-400' :
                                    'text-blue-600 dark:text-blue-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 dark:text-white">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                      {notification.time}
                                    </span>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <p className="font-medium text-gray-800 dark:text-white">Admin User</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                        <span className="font-bold text-white">A</span>
                      </div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">Admin User</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              Profile Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              Account Settings
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Live Stats Bar */}
          <div className="hidden lg:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
            <div className="px-8 py-3">
              <div className="grid grid-cols-6 gap-4">
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                      ৳{liveStats.totalRevenue.toLocaleString()}
                    </p>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Updated in real-time</p>
                  </div>
                </div>
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Today's Orders</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {liveStats.todayOrders}
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Live count updating</p>
                  </div>
                </div>
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Products</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {liveStats.activeProducts}
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Based on current stock</p>
                  </div>
                </div>
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Growth</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      +{liveStats.customerGrowth.toFixed(1)}%
                    </p>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Month-over-month growth</p>
                  </div>
                </div>
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {liveStats.pendingOrders}
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting confirmation</p>
                  </div>
                </div>
                <div className="text-center group relative">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {liveStats.conversionRate.toFixed(1)}%
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Orders accepted vs total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 lg:p-8 mt-16 lg:mt-0">
            <div className="max-w-7xl mx-auto">
              {/* Mobile Stats */}
              <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow relative group">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Today's Orders</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {liveStats.todayOrders}
                  </p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow relative group">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {liveStats.pendingOrders}
                  </p>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Content Container */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg min-h-[calc(100vh-200px)] flex justify-center items-center relative">
                {/* Live Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Live Updates Active
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {formatTime(currentTime)}
                  </div>
                </div>
                
                <Outlet />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="hidden lg:block border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>System Status: Operational</span>
                  </div>
                  <span>•</span>
                  <span>Uptime: 99.9%</span>
                  <span>•</span>
                  <span>Response Time: 45ms</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>v2.1.0</span>
                  <span>•</span>
                  <span>Last sync: {formatTime(currentTime)}</span>
                  <span>•</span>
                  <span>© 2024 ACRUX Foot Care</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Refresh Button (Mobile) */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 z-40"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

export default DashboardLayout;