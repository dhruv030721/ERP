import React from 'react'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FaUserCheck } from "react-icons/fa";
import Button from '@mui/material/Button';
import { CiSearch } from "react-icons/ci";
import { Dropdown } from '../../../components';


function MarkAttendance() {

  const Department = [
    {
      value: 'Computer',
      label: 'Comp',
    },
    {
      value: 'Mechnical',
      label: 'Mech',
    },
    {
      value: 'Electrical',
      label: 'Elec',
    },
    {
      value: 'Information Technology',
      label: 'IT',
    },
  ];

  const Semester = [
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3',
      label: '3',
    },
    {
      value: '4',
      label: '4',
    },
    {
      value: '5',
      label: '5',
    },
    {
      value: '6',
      label: '6',
    },
    {
      value: '7',
      label: '7',
    },
  ]

  const AttendanceType = [
    {
      value: 'Lecture',
      label: 'Lecture'
    },
    {
      value: 'Lab',
      label: 'Lab'
    },
  ]

  const Batch = [
    {
      value: 'A',
      label: 'A',
    },
    {
      value: 'B',
      label: 'B',
    },
    {
      value: 'C',
      label: 'C',
    },
  ]

  const Subject = [
    {
      value : 'TOC',
      label : 'TOC',  
    },
    {
      value : 'OOP',
      label : 'OOP',
    },
    {
      value : 'Compiler Design',
      label : 'Compiler Design',
    },
    {
      value : 'PPS',
      label : 'PPS',
    },
  ]

  return (
    <div className='mx-10  border-black p-10 flex flex-col'>
      <div className='flex flex-col space-y-10'>
        <div className='flex space-x-5'>
          <FaUserCheck size={30} />
          <h1 className='font-bold text-xl'>Mark Attendance</h1>
        </div>

        {/* <div className='bg-gradient-to-r  from-black via-black to-white h-[1px]'></div> */}

        {/* Data Filter portion  */}
        
        <div className='flex items-center justify-between'>
          <div className='flex space-x-10'>
          <Dropdown label={"Department"} defaultValue={"Computer"} helperText={"Select Department"} List={Department}/>
          <Dropdown label={"Semester"} defaultValue={"1"} helperText={"Select Semester"} List={Semester}/>
          <Dropdown label={"Subject"} defaultValue={"TOC"} helperText={"Select Subject"} List={Subject}/>
          <Dropdown label={"Type"} defaultValue={"Lecture"} helperText={"Select type"} List={AttendanceType}/>
          </div>
          <div className='flex-2'>
            <Button variant="contained" color="info" endIcon={<CiSearch />} >
              <p className='normal-case'>Search</p>
            </Button>
          </div>
        </div>
        {/* <div className='bg-gradient-to-r  from-black via-black to-white h-[1px]'></div> */}
      </div>
    </div>
  )
}

export default MarkAttendance
