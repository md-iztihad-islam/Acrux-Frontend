import { useNavigate, useLocation } from "react-router-dom";
import { 
  Tag, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  Home
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "productcontrol",
      label: "Product Control",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/productcontrol",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "ordercontrol",
      label: "Order Control",
      icon: <ShoppingCart className="w-5 h-5" />,
      path: "/dashboard/ordercontrol",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: "reportcontrol",
      label: "Analytics & Reports",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/dashboard/reportcontrol",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border"
      >
        {isMobileMenuOpen ? (
          <X className="w-2 h-2 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 lg:w-72
          bg-gradient-to-b from-gray-900 to-gray-800
          text-white
          transform transition-transform duration-300 ease-in-out
          z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ACRUX Admin</h1>
              <p className="text-xs text-gray-400">Foot Care Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-250px)]">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? `${item.bgColor} ${item.color} shadow-md` 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg
                  ${active ? 'bg-white' : 'bg-gray-700'}
                `}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-current"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/20 transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-gray-700">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <p className="text-xs text-gray-500 text-center">v2.1.0 • Dashboard</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;