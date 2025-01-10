import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserCheck } from "react-icons/fa";
import { BsPersonFillAdd } from "react-icons/bs";
import { TbReportSearch } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { FaBusinessTime } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { setBranchData, setSubjectData } from '../../slices/academics';
import { RootState } from '../../slices/store';
import { academicServices } from '../../services';
import { Link } from 'react-router-dom';

interface DashboardItem {
  name: string;
  route: string;
  icon: JSX.Element;
  color: string;
  textColor: string;
  bgColor: string;
  description: string;
}

const DashboardItem: React.FC<DashboardItem> = ({ name, route, icon, color, textColor, bgColor, description }) => {
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <Link
      to={route}
      className={`
        relative group font-poppins flex flex-col items-center justify-center p-6 rounded-xl
        transition-all duration-300 border border-zinc-200 shadow-sm
        ${isActive ? color : bgColor}
      `}
    >
      <div className={`
        mb-4 text-current ${textColor}
      `}>
        {icon}
      </div>

      <span className={`
        text-sm font-semibold text-center 
        ${isActive ? 'text-white' : textColor}
      `}>
        {name}
      </span>
      <p className='text-xs text-center font-DmSans text-zinc-400'>
        {description}
      </p>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const Data_Branch = useSelector((state: RootState) => state.academic.BranchData);
  const Data_Subject = useSelector((state: RootState) => state.academic.SubjectData);

  const DashboardItems: DashboardItem[] = [
    {
      name: "Mark Attendance",
      description: "Record student attendance for classes.",
      route: "/academics/mark_attendance",
      icon: <FaUserCheck size={24} />,
      color: "bg-blue-500",
      textColor: "text-sky-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Proxy Attendance",
      description: "Handle proxy attendance cases.",
      route: "/academics/proxy_attendance",
      icon: <FaUserCheck size={24} />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Add Student",
      description: "Add new student details.",
      route: "/academics/add_student",
      icon: <BsPersonFillAdd size={24} />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      name: "Add Faculty",
      description: "Add new faculty details.",
      route: "/academics/add_faculty",
      icon: <BsPersonFillAdd size={24} />,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      name: "Edit Student Details",
      description: "Update student information.",
      route: "/academics/edit_student_details",
      icon: <FaUserEdit size={24} />,
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50"
    },
    {
      name: "Attendance Report",
      description: "View attendance records and analytics.",
      route: "/academics/attendance_report",
      icon: <TbReportSearch size={24} />,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      name: "Subject",
      description: "Manage subject details.",
      route: "/academics/add_subject",
      icon: <ImBook size={24} />,
      color: "bg-red-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Assign Subject",
      description: "Assign subjects to faculty.",
      route: "/academics/assign_subject",
      icon: <FaBookOpenReader size={24} />,
      color: "bg-teal-500",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      name: "Manage TimeTable",
      description: "Organize and edit class schedules.",
      route: "/academics/manage_timetable",
      icon: <FaBusinessTime size={24} />,
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50"
    }

  ];

  useEffect(() => {
    (async () => {
      const [branchResponse, subjectResponse] = await Promise.all([
        Data_Branch && Data_Branch.length ? null : academicServices.GetBranch(),
        Data_Subject && Data_Subject.length ? null : academicServices.GetSubjects(),
      ]);
      if (branchResponse) dispatch(setBranchData(branchResponse.data.data));
      if (subjectResponse) dispatch(setSubjectData(subjectResponse.data.data));
    })();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-2 border-b">
          <h1 className="text-2xl font-semibold text-gray-700">
            Academic Dashboard
          </h1>
          <div className=" rounded-lg px-4 py-2">
            <span className="text-sm text-gray-900">Academic Year 2024-25</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DashboardItems.map((item) => (
            <DashboardItem
              key={item.route}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;