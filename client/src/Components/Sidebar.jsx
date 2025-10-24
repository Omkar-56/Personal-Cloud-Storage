import { useState } from "react";
import {
  Home,
  Folder,
  Share2,
  Star,
  Trash2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "All Files", icon: Folder, path: "/files" },
    { label: "Shared Files", icon: Share2, path: "/shared" },
    { label: "Starred", icon: Star, path: "/starred" },
    { label: "Recycle Bin", icon: Trash2, path: "/recycle" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  // ✅ Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false); // close sidebar on mobile
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between bg-white shadow px-4 py-3">
        <h2 className="text-lg font-bold">In.Secure</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out w-64 p-6 flex flex-col justify-between
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <div className="flex items-center justify-between md:justify-center mb-6">
            <h2 className="text-xl font-bold">In.Secure</h2>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-500"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="space-y-4">
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(path)}
                  className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ✅ Logout Button */}
        <div className="pt-4 border-t mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-40"
        ></div>
      )}
    </>
  );
}
