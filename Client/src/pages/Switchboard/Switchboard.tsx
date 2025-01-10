import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { IoSettings } from "react-icons/io5";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaBusAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/slices/store';
import SwitchItem from './SwitchItem';
import { resetAcademicState } from '@/slices/academics';
import { logout } from '@/slices/auth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.userData);

  const name = userData?.name.split(" ") || "User";

  const dispatch = useDispatch();

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
      {/* <Header /> */}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col
                        ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
        >
          {/* User Profile Section */}
          <div className="p-4 border-b border-zinc-200">
            <div className="flex items-center  gap-3">
              {
                isCollapsed ? <>
                  <span className='p-2 rounded-full bg-zinc-800 text-white w-10 h-10 '>{name[0][0]}{name[1][0]}</span>
                </> :
                  <img
                    src="https://t4.ftcdn.net/jpg/09/99/81/63/360_F_999816347_D2Ho0g6tpCKlJf5ytn67iZ9BynePJm87.jpg"
                    alt="Profile"
                    className="w-14 h-14 rounded-full p-1 object-cover"
                  />

              }
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {userData?.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {userData?.role}
                  </p>
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Your page content goes here */}
            {/* <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1> */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;