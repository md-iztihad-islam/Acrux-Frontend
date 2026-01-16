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
      

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          

          
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