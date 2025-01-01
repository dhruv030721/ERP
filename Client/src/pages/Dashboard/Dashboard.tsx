import SwitchItem from '../Switchboard/SwitchItem';
import { FaUserCheck } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { FaBusinessTime } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { useEffect } from 'react';
import { academicServices } from '../../services';
import { useDispatch } from 'react-redux';
import { setBranchData } from '../../slices/academics';

interface DashboardItem {
  name: string;
  route: string;
  icon: JSX.Element;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  const DashboardItems: DashboardItem[] = [
    {
      name: "Mark Attendance",
      route: "/academics/mark_attendance",
      icon: <FaUserCheck size={25} className="md:text-3xl" />
    },
    {
      name: "Proxy Attendance",
      route: "/academics/proxy_attendance",
      icon: <FaUserCheck size={25} className="md:text-3xl" />
    },
    {
      name: "Add Student",
      route: "/academics/add_student",
      icon: <BsPersonFillAdd size={25} className="md:text-3xl" />
    },
    {
      name: "Add Faculty",
      route: "/academics/add_faculty",
      icon: <BsPersonFillAdd size={25} className="md:text-3xl" />
    },
    {
      name: "Edit Student Details",
      route: "/academics/edit_student_details",
      icon: <FaUserEdit size={25} className="md:text-3xl" />
    },
    {
      name: "Attendance Report",
      route: "/academics/attendance_report",
      icon: <TbReportSearch size={25} className="md:text-3xl" />
    },
    {
      name: "Subject",
      route: "/academics/add_subject",
      icon: <ImBook size={25} className="md:text-3xl" />
    },
    {
      name: "Assign Subject",
      route: "/academics/assign_subject",
      icon: <FaBookOpenReader size={25} className="md:text-3xl" />
    },
    {
      name: "Manage TimeTable",
      route: "/academics/manage_timetable",
      icon: <FaBusinessTime size={25} className="md:text-3xl" />
    }
  ];

  useEffect(() => {
    (async () => {
      const response = await academicServices.GetBranch();
      dispatch(setBranchData(response.data.data));
    })();
  }, []);

  return (
    <div className='w-full'>
      <div className='h-full md:h-[630px] flex flex-col md:flex-row items-center justify-around p-4 md:p-0'>
        {/* Profile Section */}
        {/* <div className='w-full md:w-[30%] p-4 md:p-8 flex flex-col justify-center items-center rounded-lg bg-transparent space-y-3 md:h-[95%]'>
          <h1 className='font-bold text-xl md:text-2xl text-center'>Coming Soon....</h1>
        </div> */}

        {/* Divider - Hidden on mobile */}
        {/* <div className='hidden md:block bg-gradient-to-b from-white via-zinc-400 to-white h-[90%] w-[1px]'></div> */}

        {/* Mobile Divider */}
        {/* <div className='my-6 md:hidden bg-gradient-to-r from-white via-zinc-400 to-white h-[1px] w-full'></div> */}

        {/* Dashboard Section */}
        <div className='w-full md:w-[80%] rounded-lg md:h-[95%] flex flex-col space-y-5 p-2 md:p-5 font-poppins'>
          <h2 className='font-black text-lg md:text-xl text-center'>Dashboard</h2>

          <div className='px-2 md:px-10'>
            <ul className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-x-10 md:gap-y-10 justify-center items-center'>
              {DashboardItems.map((item) => (
                <SwitchItem
                  key={item.name}
                  name={item.name}
                  url={item.route}
                  icon={item.icon}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;