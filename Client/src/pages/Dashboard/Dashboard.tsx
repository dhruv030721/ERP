// import React, { useEffect } from 'react';
import SwitchItem from '../Switchboard/SwitchItem';
import { FaUserCheck } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
// import { academicServices } from '../../services';
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from 'react-redux';
// import { setTimetable } from "../../slices/academics"
// import { RootState } from '../../slices/store';

interface DashboardItem {
  name: string;
  route: string;
  icon: JSX.Element;
}

const Dashboard: React.FC = () => {
  const DashboardItems: DashboardItem[] = [
    {
      name: "Mark Attendance",
      route: "/academics/mark_attendance",
      icon: <FaUserCheck size={25} />
    },
    {
      name: "Add Student",
      route: "/academics/add_student",
      icon: <BsPersonFillAdd size={25} />
    },
    {
      name: "Edit Student Details",
      route: "/academics/edit_student_details",
      icon: <FaUserEdit size={25} />
    },
    {
      name: "Attendance Report",
      route: "/academics/attendance_report",
      icon: <TbReportSearch size={25} />
    }
  ];

  return (
    <div className=''>
      <div className='h-[630px] flex items-center justify-around'>
        <div className='p-8 flex flex-col justify-center items-center rounded-lg bg-transparent space-y-3 w-[30%] h-[95%]'>
          {/* Profile */}
          <h1 className='font-bold text-2xl'>Coming Soon....</h1>
        </div>
        <div className='bg-gradient-to-b from-white via-black to-white h-[90%] w-[1px]'></div>
        <div className='rounded-lg w-[50%] h-[95%] flex flex-col space-y-5 p-5 font-poppins'>
          {/* Switchboard Option */}
          <h2 className='font-black text-xl text-center'>Dashboard</h2>
          <div className='bg-gradient-to-r from-white via-black to-white h-[1px]'></div>
          <div className='px-10'>
            <ul className='grid grid-cols-3 gap-x-10 gap-y-10 justify-center items-center'>
              {DashboardItems.map((item) => (
                <SwitchItem key={item.name} name={item.name} url={item.route} icon={item.icon} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
