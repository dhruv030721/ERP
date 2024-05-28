import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';




function MarkAttendance() {

  const [dateValue, setdateValue] = useState<Dayjs | any>(dayjs(Date()));


  const DateHandler = (date: Dayjs | null) => {
    console.log(date);
    setdateValue(date);
  }

  const getDayName = (dayNumber: number): string => {
    const daysOfWeek: string[] = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    if (dayNumber < 1 || dayNumber > 7) {
      throw new Error('Invalid day number. It must be between 1 and 7.');
    }

    return daysOfWeek[dayNumber];
  }




  return (
    <>
      <div className='flex gap-x-10 pt-10'>
        <div className='ml-20'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={dateValue} onChange={DateHandler} />
          </LocalizationProvider>
        </div>
        <div className='bg-gradient-to-b from-white via-black to-white max-h-96 w-[1px]'></div>
        <div>
          <h1 className='text-l font-bold'>Day: {dateValue ? getDayName(dateValue.$W) : 'Invalid date'}</h1>
          <h1 className='text-l font-bold'>Date: {dateValue ? `${dateValue.$d.getDate()} / ${dateValue.$d.getMonth() + 1} / ${dateValue.$d.getFullYear()}` : 'Invalid date'}</h1>
        </div>
      </div>
    </>
  );
}

export default MarkAttendance;






// DropDown Type : {
//   const [semesterOptions, setSemesterOptions] = useState([]);
//   const [subjectOptions, setSubjectOptions] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   const subjectData = useSelector((state) => state.auth.userData.subjectData);

//   const departmentOptions = [
//     { value: 'Computer', label: 'Comp' },
//     { value: 'Mechanical', label: 'Mech' },
//     { value: 'Electrical', label: 'Elec' },
//     { value: 'Information Technology', label: 'IT' },
//   ];

//   useEffect(() => {
//       const semesters = new Set(subjectData.map(subject => subject.semesterSem));
//       const semOptions = [...semesters].map(semester => ({ value: semester, label: semester }))
//       setSemesterOptions(semOptions);
//       const subjects = new Set(subjectData.map(subject => subject.subjectName));
//       const subOptions = [...subjects].map(subject => ({ value: subject, label: subject }));
//       setSubjectOptions(subOptions);
//   }, []);

//   const semesterHandler = (selectedSemester) => {
//     const subjects = subjectData.filter(subject => subject.semesterSem === selectedSemester);
//     const subjectOptions = subjects.map(subject => ({ value: subject.subjectName, label: subject.subjectName }));
//     setSubjectOptions(subjectOptions);
//   };

//   const attendanceTypes = [
//     { value: 'Lecture', label: 'Lecture' },
//     { value: 'Lab', label: 'Lab' },
//   ];

//   const batches = [
//     { value: 'A', label: 'A' },
//     { value: 'B', label: 'B' },
//     { value: 'C', label: 'C' },
//   ];

//   return (
//     isLoading ? (
//       <div>
//         <h1>Loading...</h1>
//       </div>
//     ) : (
//       <div className='mx-10 border-black p-10 flex flex-col'>
//         <div className='flex flex-col space-y-10'>
//           <div className='flex space-x-5'>
//             <FaUserCheck size={30} />
//             <h1 className='font-bold text-xl'>Mark Attendance</h1>
//           </div>
//           <div className='flex items-center justify-between'>
//             <div className='flex space-x-10'>
//               <Dropdown label={"Department"} defaultValue={"Computer"} helperText={"Select Department"} list={departmentOptions} />
//               <Dropdown label={"Semester"} defaultValue={''} helperText={"Select Semester"} list={semesterOptions} onChange={semesterHandler} />
//               <Dropdown label={"Subject"} defaultValue={''} helperText={"Select Subject"} list={subjectOptions} />
//               <Dropdown label={"Type"} defaultValue={"Lecture"} helperText={"Select type"} list={attendanceTypes} />
//             </div>
//             <div className='flex-2'>
//               <Button variant="contained" color="info" endIcon={<CiSearch />} >
//                 <p className='normal-case'>Search</p>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }