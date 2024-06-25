import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../slices/store';
import { academicServices } from '../../../services';
import { setTimetable } from '../../../slices/academics';
import toast from 'react-hot-toast';
import { Loading } from '../../../components';
import { toastDesign } from '../../../components/GlobalVariables';
import StudentAttendanceCard from "./StudentAttendanceCard.tsx"
import MuiButton from '../../../components/MuiButton.tsx';

const MarkAttendance = () => {
    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
    const [isLoading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const [studentData, setStudentData] = useState<any>([]);
    const [attendance, setAttendance] = useState<any>({});
    const [lectureDetails, setlectureDetails] = useState<any>({});


    const TimetableData: any = useSelector((state: RootState) => state.academic.Timetable);
    const dispatch = useDispatch();
    const employeeId: any = useSelector((state: RootState) => state.auth.userData?.employeeId);

    const DateHandler = (date: Dayjs | null) => {
        setDateValue(date);
        setSelectedSession(null);

        setStudentData([]);
        setAttendance({});
    };

    const getDayName = (dayNumber: number): string => {
        const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (dayNumber < 0 || dayNumber >= 7) {
            throw new Error('Invalid day number. It must be between 0 and 6.');
        }
        return daysOfWeek[dayNumber];
    };

    const dayName = dateValue ? getDayName(dateValue.day()) : 'Invalid date';

    const selectLectureHandler = async (index: any, sem: any, branch: any, subject: any, time: any, day: any, facultyId: any) => {
        setSelectedSession(index);
        setlectureDetails({
            time: time,
            sem: sem,
            branch: branch,
            subject: subject,
            day: day,
            facultyId: facultyId
        })
        await toast.promise(
            academicServices.GetStudents({ sem, branch }),
            {
                loading: "Data Loading.....",
                success: (response) => {
                    setStudentData(response.data.data);
                    console.log(studentData);
                    const initialAttendance = response.data.data.reduce((acc: any, student: any) => {
                        acc[student.enrollmentNo] = "Present";
                        return acc;
                    }, {});
                    setAttendance(initialAttendance);
                    return `${response.data.message}`;
                },
                error: (error) => {
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        );
    };

    const cancelButtonHandler = () => {
        setSelectedSession(null);
        setStudentData([]);
        setAttendance({});
    }

    const markAttendanceHandler = async () => {
        await toast.promise(
            academicServices.MarkAttendance(lectureDetails, attendance),
            {
                loading: "Attendance Marking.....",
                success: (response) => {

                    return `${response.data.message}`;
                },
                error: (error) => {
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        );
    }

    const handleAttendanceChange = (enrollmentNo: string, value: string) => {
        setAttendance((prev: any) => ({
            ...prev,
            [enrollmentNo]: value
        }));
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await academicServices.GetTimetable(employeeId);
                dispatch(setTimetable(response.data.data));
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch timetable.");
            }
        })();
    }, [dispatch, employeeId]);

    return (
        isLoading ? (
            <Loading message='' size='max-w-[20%]' />
        ) : (
            <div className=''>
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
                                TimetableData[dayName]?.map((session: any, index: any) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer border rounded-lg border-zinc-700 px-8 py-2 flex flex-col justify-center ${selectedSession === index ? 'bg-blue-100' : 'hover:bg-blue-50'}`}
                                        onClick={() => selectLectureHandler(index, session.sem, session.branch, session.subjectCode, session.time, session.day, session.facultyId)}
                                    >
                                        <h1>Sem: {session.sem}</h1>
                                        <h1>Time: {session.time}</h1>
                                        <h1>{session.subject}</h1>
                                        <h1>Faculty: {session.facultyName}</h1>
                                        {session.batch ? (<h1>Batch: {session.batch}</h1>) : null}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
                <div className='p-10 flex flex-col gap-y-3 font-bold'>
                    <h1 className='text-2xl '>Students : </h1>
                    {selectedSession && studentData.length === 0 ? (
                        <h1>No lecture selected!</h1>
                    ) :  studentData.length > 0 ? (
                        <>
                            <div className='flex gap-y-3 flex-col'>
                                {studentData.map((student: any) => (
                                    <StudentAttendanceCard
                                        key={student.enrollmentNo}
                                        List={student}
                                        attendance={attendance[student.enrollmentNo]}
                                        onAttendanceChange={handleAttendanceChange}
                                    />
                                ))}
                            </div>
                            <div className='flex justify-end'>
                                <div className='flex gap-x-5 p-10 '>
                                    <MuiButton btnName='Cancel' type='button' color='red' eventHandler={cancelButtonHandler} />
                                    <MuiButton btnName='Mark Attendance' color='#093163' type='button' eventHandler={markAttendanceHandler} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <h1>No students available for the selected session.</h1>
                    )}
                </div>
            </div>
        )
    );
}

export default MarkAttendance;
