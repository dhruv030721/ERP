import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IoSettings } from "react-icons/io5";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaBusAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/slices/store';
import SwitchItem from './SwitchItem';
import { resetAcademicState } from '@/slices/academics';
import { logout } from '@/slices/auth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const location = useLocation();
  const name = userData?.name.split(" ") || "User";
  const dispatch = useDispatch();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetAcademicState());
    localStorage.removeItem("erp_auth_token");
  };

  const navigationItems = [
    {
      name: 'Settings',
      icon: <IoSettings size={24} />,
      bgcolor: "hover:bg-orange-100"
    },
    {
      name: 'Academics',
      icon: <HiMiniAcademicCap size={24} />,
      bgcolor: "hover:bg-blue-100",
      url: "/academics/dashboard"
    },
    {
      name: 'Fees',
      icon: <FaIndianRupeeSign size={24} />,
      bgcolor: "hover:bg-green-100"
    },
    {
      name: 'Exam',
      icon: <PiExamFill size={24} />,
      bgcolor: "hover:bg-purple-100"
    },
    {
      name: 'User',
      icon: <FaUserCircle size={24} />,
      bgcolor: "hover:bg-gray-100"
    },
    {
      name: 'Payroll',
      icon: <FaShoppingBag size={24} />,
      bgcolor: "hover:bg-pink-100"
    },
    {
      name: 'Bank Office',
      icon: <GiHandBag size={24} />,
      bgcolor: "hover:bg-yellow-100"
    },
    {
      name: 'LMS',
      icon: <PiStudentFill size={24} />,
      bgcolor: "hover:bg-rose-100"
    },
    {
      name: 'Transportation',
      icon: <FaBusAlt size={24} />,
      bgcolor: "hover:bg-teal-100"
    }
  ];

  return (
    <div className="min-h-screen font-poppins bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-full bg-zinc-800 text-white w-10 h-10">
            {name[0][0]}{name[1][0]}
          </span>
          <div>
            <h3 className="font-semibold text-sm">{userData?.name}</h3>
            <p className="text-xs text-gray-500">{userData?.role}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar for desktop */}
        <aside
          className={`hidden lg:flex bg-white border-r border-zinc-200 transition-all duration-300 flex-col
            ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
        >
          {/* User Profile Section */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              {isCollapsed ? (
                <span className="p-2 rounded-full bg-zinc-800 text-white w-10 h-10">
                  {name[0][0]}{name[1][0]}
                </span>
              ) : (
                <img
                  src="https://t4.ftcdn.net/jpg/09/99/81/63/360_F_999816347_D2Ho0g6tpCKlJf5ytn67iZ9BynePJm87.jpg"
                  alt="Profile"
                  className="w-14 h-14 rounded-full p-1 object-cover"
                />
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{userData?.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{userData?.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4 flex flex-col">
            <div className="flex-1">
              {navigationItems.map((item) => (
                isCollapsed ? (
                  <div key={item.name} className="px-2 mb-2" title={item.name}>
                    <Link
                      to={item.url || `/${item.name.toLowerCase()}`}
                      className="flex justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {item.icon}
                    </Link>
                  </div>
                ) : (
                  <SwitchItem
                    key={item.name}
                    name={item.name}
                    icon={item.icon}
                    url={item.url}
                    bgcolor={item.bgcolor}
                  />
                )
              ))}
            </div>

            {/* Logout Option */}
            <div className="border-t border-zinc-200">
              {isCollapsed ? (
                <div className="px-2 pt-4" title="Logout">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LuLogOut size={24} />
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <SwitchItem
                    name="Logout"
                    icon={<LuLogOut size={24} className="text-red-600" />}
                    onClick={handleLogout}
                  />
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-zinc-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </aside>

        {/* Mobile Menu (Slide-out) */}
        <div
          className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-64 h-full bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://t4.ftcdn.net/jpg/09/99/81/63/360_F_999816347_D2Ho0g6tpCKlJf5ytn67iZ9BynePJm87.jpg"
                  alt="Profile"
                  className="w-14 h-14 rounded-full p-1 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{userData?.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{userData?.role}</p>
                </div>
              </div>
            </div>
            <nav className="py-4">
              {navigationItems.map((item) => (
                <SwitchItem
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  url={item.url}
                  bgcolor={item.bgcolor}
                />
              ))}
              <div className="border-t border-zinc-200 mt-4">
                <SwitchItem
                  name="Logout"
                  icon={<LuLogOut size={24} className="text-red-600" />}
                  onClick={handleLogout}
                />
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-30">
          <div className="flex justify-around p-2">
            {navigationItems.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                to={item.url || `/${item.name.toLowerCase()}`}
                className={`flex flex-col items-center ${location.pathname.includes(item.url?.split("/")[1] || "undefined") ? "text-orange-700" : ""}`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;