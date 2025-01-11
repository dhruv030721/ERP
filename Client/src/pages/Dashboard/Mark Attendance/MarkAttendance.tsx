import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../slices/store';
import { academicServices } from '../../../services';
import { setTimetable } from '../../../slices/academics';
import toast from 'react-hot-toast';
import { Loading } from '../../../components';
import { toastDesign } from '../../../components/GlobalVariables';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import StudentAttendanceCard from './StudentAttendanceCard';
import CalendarSection from './Calender';

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
            <div className="bg-gray-50 overflow-y-hidden">
                <div className="w-7xl mx-auto md:px-4">
                    <div className="grid lg:grid-cols-[300px,2fr] mb-5 gap-8">

                        {/* Calendar Section */}
                        <CalendarSection dateValue={dateValue} DateHandler={DateHandler} />
                        <div className="space-y-6">
                            {/* Schedule Section */}
                            <Card className='mx-5'>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <div>
                                            <h2 className="font-semibold text-lg">{dayName}</h2>
                                            <p className="text-gray-600 text-sm">
                                                {dateValue ? `${dateValue.date()} / ${dateValue.month() + 1} / ${dateValue.year()}` : 'Invalid date'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-scroll h-44 md:h-fit px-4 py-2 md:w-full gap-4">
                                        {dayName === 'Sunday' || dayName === 'Saturday' || Object.entries(TimetableData).length === 0 ? (
                                            <div className="md:col-span-3 flex flex-col items-center justify-center py-12 text-gray-500">
                                                <Calendar className="w-12 h-12 mb-3 text-gray-400" />
                                                <p className="font-medium">No Lectures Scheduled</p>
                                            </div>
                                        ) : (
                                            TimetableData[dayName]?.map((session: any, index: number) => (
                                                <Card
                                                    key={index}
                                                    className={`transition-all cursor-pointer ${selectedSession === index
                                                        ? 'ring-2 ring-primary ring-offset-2'
                                                        : 'hover:shadow-md'
                                                        }`}
                                                    onClick={() => !isLectureLoading && selectLectureHandler(
                                                        index,
                                                        session.sem,
                                                        session.branchId,
                                                        session.subjectCode,
                                                        session.time,
                                                        session.day,
                                                        session.facultyId,
                                                        session.batch,
                                                        session.lectureType
                                                    )}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium">Semester {session.sem}</span>
                                                                <span className="text-primary text-sm">{session.time}</span>
                                                            </div>
                                                            <h3 className="font-medium truncate">{session.subject}</h3>
                                                            <p className="text-sm text-gray-600">Prof. {session.facultyName}</p>
                                                            {session.lectureType && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <span className="px-2 py-1 rounded-md bg-orange-100 text-black border border-orange-400">
                                                                        {session.lectureType}
                                                                    </span>
                                                                    {session.lectureType === "LAB" && session.batch && (
                                                                        <span className="px-2 py-1 rounded-md bg-orange-100 text-black border border-orange-400">
                                                                            Batch {session.batch}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                    {/* Students Section */}
                    <Card className="w-full overflow-x-hidden">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Users className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-semibold">Students</h2>
                            </div>

                            {selectedSession && studentData.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-gray-500">
                                    <Users className="w-10 h-10 md:w-12 md:h-12 mb-3 text-gray-400" />
                                    <p className="font-medium text-center">No lecture selected</p>
                                </div>
                            ) : studentData.length > 0 ? (
                                <div className="flex flex-col md:h-full">
                                    <div className="flex-1 overflow-y-auto px-2 md:px-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                        <div className="space-y-3 md:space-y-4 pb-4">
                                            {studentData.map((student: any) => (
                                                <StudentAttendanceCard
                                                    key={student.enrollmentNo}
                                                    List={student}
                                                    attendance={attendance[student.enrollmentNo]}
                                                    onAttendanceChange={handleAttendanceChange}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
                                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={cancelButtonHandler}
                                                className="w-full sm:w-auto min-w-[120px]"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={markAttendanceHandler}
                                                className="w-full sm:w-auto min-w-[120px]"
                                            >
                                                Mark Attendance
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-gray-500">
                                    <Users className="w-10 h-10 md:w-12 md:h-12 mb-3 text-gray-400" />
                                    <p className="font-medium text-center">No students available for the selected session</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    );
}

export default MarkAttendance;
