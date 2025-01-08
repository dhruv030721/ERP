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
    const [isLectureLoading, setLectureLoading] = useState(false);
    const [TimetableData, setTimetableData] = useState<any>({});


    const dispatch = useDispatch();

    const Data_Timetable: any = useSelector((state: RootState) => state.academic.Timetable);
    const facultyMobileNumber: any = useSelector((state: RootState) => state.auth.userData?.mobileNumber);

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

    const selectLectureHandler = async (index: any, sem: any, branch: any, subject: any, time: any, day: any, facultyId: any, batch: string, lectureType: string) => {
        setLectureLoading(true);
        setSelectedSession(index);
        setlectureDetails({
            time: time,
            sem: sem,
            branch: branch,
            subject: subject,
            day: day,
            facultyId: facultyId,
            date: dateValue,
            batch,
            type: lectureType
        })

        try {
            await toast.promise(
                academicServices.GetStudents({ sem, branch }),
                {
                    loading: "Data Loading",
                    success: (response) => {
                        if (batch) {
                            setStudentData(() =>
                                response.data.data.filter((student: any) => student.batch === batch)
                            );

                        } else {
                            setStudentData(response.data.data);
                        }

                        return `${response.data.message}`;
                    },
                    error: (error) => {
                        return `${error.response.data.message}`;
                    }
                },
                toastDesign
            );
        } finally {
            setLectureLoading(false);
        }
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
                loading: "Attendance Marking",
                success: (response) => {
                    console.log(response.data.result_matrix);
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
                if (!Data_Timetable || Data_Timetable.length == 0) {
                    const response = await academicServices.GetTimetable(facultyMobileNumber);
                    dispatch(setTimetable(response.data.data));
                    setTimetableData(response.data.data);
                } else {
                    setTimetableData(Data_Timetable);
                }
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch timetable.", toastDesign);
            }
        })();



        if (studentData.length > 0) {
            const initialAttendance = studentData.reduce((acc: any, student: any) => {
                acc[student.enrollmentNo] = "PRESENT";
                return acc;
            }, {});

            setAttendance(initialAttendance);
        }

    }, [dispatch, facultyMobileNumber, Data_Timetable, studentData]);

    return (
        isLoading ? (
            <Loading message='' size='max-w-[20%]' />
        ) : (
            <div className=''>
                <div className='flex flex-col md:flex-row gap-x-10 pt-10 px-10'>
                    <div className=''>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar value={dateValue} onChange={DateHandler} />
                        </LocalizationProvider>
                    </div>
                    <div className='bg-gradient-to-b from-white via-zinc-400 to-a max-h-96 w-[1px]'></div>
                    <section className='w-full'>
                        <div>
                            <h1 className='text-l font-bold'>Day: {dayName}</h1>
                            <h1 className='text-l font-bold'>Date: {dateValue ? `${dateValue.date()} / ${dateValue.month() + 1} / ${dateValue.year()}` : 'Invalid date'}</h1>
                        </div>
                        <div className='grid md:grid-cols-3 gap-x-5 gap-y-5 mt-5 font-bold text-sm'>
                            {dayName === 'Sunday' || dayName === 'Saturday' || Object.entries(TimetableData).length == 0 ? (
                                <h1 className='text-center text-lg font-semibold font-DmSans mt-10'>No Lecture Found!</h1>
                            ) : (
                                TimetableData[dayName]?.map((session: any, index: any) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer border rounded-lg border-zinc-400 shadow px-4 py-2 flex flex-col justify-center ${selectedSession === index ? 'bg-orange-50' : 'hover:bg-orange-50'}`}
                                        onClick={() => !isLectureLoading && selectLectureHandler(index, session.sem, session.branchId, session.subjectCode, session.time, session.day, session.facultyId, session.batch, session.lectureType)}
                                    >
                                        <h1>Sem: {session.sem}</h1>
                                        <h1 className='text-orange-600'>Time: {session.time}</h1>
                                        <h1>{session.subject}</h1>
                                        <h1>Faculty: {session.facultyName}</h1>
                                        {session.lectureType == "LECTURE" ? (<h1>Type: {session.lectureType}</h1>) : null}
                                        {session.lectureType == "LAB" ? (<div className='flex gap-x-5'><h1>Type: LAB</h1><h1>Batch: {session.batch}</h1></div>) : null}
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
                    ) : studentData.length > 0 ? (
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
                                <div className='flex flex-col md:flex-row-reverse md:gap-x-5 gap-y-5 items-center p-10 w-full  '>
                                    <MuiButton btnName='Mark Attendance' color='#093163' type='button' eventHandler={markAttendanceHandler} />
                                    <MuiButton btnName='Cancel' type='button' color='red' eventHandler={cancelButtonHandler} />
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
