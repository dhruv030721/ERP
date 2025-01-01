import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Header, Loading } from '../../components';
import { IoSettings } from "react-icons/io5";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaBusAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import User from '../../assets/utility/user.png';
import SwitchItem from './SwitchItem';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login, logout, UserDataType } from '../../slices/auth';
import { RootState } from '../../slices/store';

interface SwitchListItem {
  name: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  bgcolor: string;
  url?: string;
}

const Switchboard: React.FC = () => {
  const SwitchList: SwitchListItem[] = [
    { name: 'Settings', icon: IoSettings, bgcolor: "hover:bg-orange-100" },
    { name: 'Academics', icon: HiMiniAcademicCap, bgcolor: "hover:bg-blue-100", url: "/academics/dashboard" },
    { name: 'Fees', icon: FaIndianRupeeSign, bgcolor: "hover:bg-green-100" },
    { name: 'Exam', icon: PiExamFill, bgcolor: "hover:bg-purple-100" },
    { name: 'User', icon: FaUserCircle, bgcolor: "hover:bg-gray-100" },
    { name: 'Payroll', icon: FaShoppingBag, bgcolor: "hover:bg-pink-100" },
    { name: 'Bank Office', icon: GiHandBag, bgcolor: "hover:bg-yellow-100" },
    { name: 'LMS', icon: PiStudentFill, bgcolor: "hover:bg-rose-100" },
    { name: 'Transportation', icon: FaBusAlt, bgcolor: "hover:bg-teal-100" },
  ];

  const userData = useSelector((state: RootState) => state.auth.userData);
  const status = useSelector((state: RootState) => state.auth.status);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getCookie = useCallback((name: string): string | null => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  }, []);

  const decodedData = useCallback((): UserDataType | null => {
    const token = getCookie("token");
    if (token !== null) {
      const data = jwtDecode<UserDataType>(token);
      return data;
    }
    return null;
  }, [getCookie]);

  const logoutHandler = () => {
    setLoading(true);
    dispatch(logout());
    localStorage.removeItem("erp_auth_token")
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (!status) {
        const data = decodedData();
        if (data) {
          dispatch(login(data));
        }
      }
      setLoading(false);
    })();
  }, [status, dispatch, decodedData]);

  return (
    <>
      <Header />
      {loading ? (
        <Loading message='' size={"max-w-[20%]"} />
      ) : (
        <div className='p-4 md:h-[630px] flex flex-col md:flex-row md:items-center md:justify-around'>
          {/* Profile Section */}
          <div className='w-full md:w-[30%] p-4 md:p-8 flex flex-col items-center rounded-lg bg-transparent space-y-3 md:h-[95%]'>
            <div className='w-[120px] md:w-[35%]'>
              <img src={User} alt="User Image" className='rounded-full object-fill border-2' />
            </div>
            <h4 className='text-blue-950 text-lg md:text-xl font-bold tracking-wide font-oswald text-center'>
              Welcome, {userData?.name || "Guest"}
            </h4>
            <p className='text-black text-xl md:text-2xl font-oswald text-center'>Coordinator Engineering</p>
            <div className='flex space-x-6 md:space-x-10'>
              <Link to="/settings"><IoSettings size={25} className="md:text-3xl" /></Link>
              <Link to="/" onClick={logoutHandler}><LuLogOut size={25} className="md:text-3xl" /></Link>
            </div>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className='hidden md:block bg-gradient-to-b from-white via-zinc-400 to-white h-[90%] w-[1px]'></div>

          {/* Mobile Divider */}
          <div className='my-6 md:hidden bg-gradient-to-r from-white via-zinc-400 to-white h-[1px] w-full'></div>

          {/* Switchboard Section */}
          <div className='w-full md:w-[60%] rounded-lg md:h-[95%] flex flex-col space-y-5 p-2 md:p-5 font-poppins'>
            <h2 className='font-black text-lg md:text-xl text-center'>Switchboard</h2>
            <div className='px-2 md:px-10'>
              <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-x-10 md:gap-y-10 justify-center items-center'>
                {SwitchList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SwitchItem 
                      name={item.name} 
                      key={item.name} 
                      icon={<Icon size={25} className='drop-shadow-lg md:text-3xl' />} 
                      url={item.url} 
                      bgcolor={item.bgcolor} 
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Switchboard;