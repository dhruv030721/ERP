import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../../slices/store';

function MarkAttendance() {
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(Date()));

  const TimetableData: any = useSelector((state: RootState) => state.academic.Timetable);

  const DateHandler = (date: Dayjs | null) => {
    setDateValue(date);
  };

  const getDayName = (dayNumber: number): string => {
    const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dayNumber < 0 || dayNumber >= 7) {
      throw new Error('Invalid day number. It must be between 0 and 6.');
    }
    return daysOfWeek[dayNumber];
  };

  const dayName = dateValue ? getDayName(dateValue.day()) : 'Invalid date';

  return (
    <>
      <div className='flex gap-x-10 pt-10 px-10'>
        <div className=''>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={dateValue} onChange={DateHandler} />
          </LocalizationProvider>
        </div>
        <div className='bg-gradient-to-b from-white via-black to-white max-h-96 w-[1px]'></div>
        <section>
          <div>
            <h1 className='text-l font-bold'>Day: {dayName}</h1>
            <h1 className='text-l font-bold'>Date: {dateValue ? `${dateValue.date()} / ${dateValue.month() + 1} / ${dateValue.year()}` : 'Invalid date'}</h1>
          </div>
          <div className='grid grid-cols-3 gap-x-5 gap-y-5 mt-5 font-bold text-sm'>
            {dayName === 'Sunday' || dayName === 'Saturday' ? (
              <h1>No Lecture!</h1>
            ) : (
              TimetableData[dayName]?.map((session: any, index: number) => (
                <div key={index} className='cursor-pointer border-2 border-blue-950 border-dotted px-8 py-2 flex flex-col justify-center hover:bg-blue-50'>
                  <h1>Time: {session.time}</h1>
                  <h1>{session.subject}</h1>
                  <h1>Faculty: {session.facultyId}</h1>
                  {session.batch ? (<h1>Batch: {session.batch}</h1>) : null}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default MarkAttendance;


