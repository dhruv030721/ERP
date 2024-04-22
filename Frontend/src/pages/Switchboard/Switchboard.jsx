import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Header, Loading } from '../../components/index'
import { IoSettings } from "react-icons/io5";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import { FaUserCircle, FaShoppingBag } from "react-icons/fa";
import { GiHandBag } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaBusAlt } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import User from '../../assets/utility/user.png'
import SwitchItem from './SwitchItem';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login } from '../../slices/auth';


function Switchboard() {

  const SwitchList = [{ name: 'Settings', icon: IoSettings, color: "hover:bg-orange-100" }, { name: 'Academics', icon: HiMiniAcademicCap, color: "hover:bg-blue-100", url: "/academics/dashboard" }, { name: 'Fees', icon: FaIndianRupeeSign, color: "hover:bg-green-100" }, { name: 'Exam', icon: PiExamFill, color: "hover:bg-purple-100" }, { name: 'User', icon: FaUserCircle, color: "hover:bg-gray-100" }, { name: 'Payroll', icon: FaShoppingBag, color: "hover:bg-pink-100" }, { name: 'Bank Office', icon: GiHandBag, color: "hover:bg-yellow-100" }, { name: 'LMS', icon: PiStudentFill, color: "hover:bg-rose-100" }, { name: 'Transportation', icon: FaBusAlt, color: "hover:bg-teal-100", }]

  const userData = useSelector((state) => state.auth.userData);
  const status = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue)
      }
    }

    return null
  }


  const decodedData = () => {
    const token = getCookie("token");
    if (token !== null) {
      console.log(token);
      const data = jwtDecode(token)
      return data
    }
    return null
  }

  useEffect(() => {
    (() => {
      if(!status){
        const data = decodedData();
        setLoading(false);
      if (data) {
        dispatch(login(data));
        setLoading(false);
      }
      }
    })();
  }, [status])


  return (
    <>
      <Header />
      {
        loading ?
          (<>
            <Loading size={"max-w-[20%]"} />
          </>)
          :
          (<div className='h-[630px] flex items-center justify-around'>
            <div className='p-8 flex flex-col items-center rounded-lg bg-transparent space-y-3 w-[30%] h-[95%]'>
              {/* Profile */}
              <div className='w-[35%]'>
                <img src={User} alt="User Image" className='rounded-full object-fill border-2' />
              </div>
              <h4 className='text-blue-950 text-xl font-bold tracking-wide font-oswald'>Welcome, {userData.name}</h4>
              <h4 className='text-blue-950 text-l font-bold tracking-wide font-oswald'>Employee ID : {userData.employee_id}</h4>
              <p className='text-black text-2xl font-oswald '>Coordinator Engineering</p>
              <div className='flex space-x-10'>
                <Link ><IoSettings size={30} /></Link>
                <Link to={`/`}><LuLogOut size={30} /></Link>
              </div>
            </div>
            <div className='bg-gradient-to-b from-white via-black to-white h-[90%] w-[1px]'></div>
            <div className=' rounded-lg w-[60%]  h-[95%] flex flex-col space-y-5 p-5  font-poppins'>
              {/* Swithboard Option */}
              <h2 className='font-black text-xl text-center'>Switchboard</h2>
              <div className='bg-gradient-to-r from-white via-black to-white h-[1px]'></div>
              <div className='px-10'>
                <ul className='grid grid-cols-4 gap-x-10 gap-y-10 justify-center items-center'>
                  {SwitchList.map((item) => {
                    const Icon = item.icon
                    return <SwitchItem name={item.name} key={item.name} icon={<Icon size={30} className='drop-shadow-lg' />} url={item.url} bgcolor={item.color} />
                  })}
                </ul>
              </div>
            </div>
          </div>)

      }
    </>
  )
}

export default Switchboard
