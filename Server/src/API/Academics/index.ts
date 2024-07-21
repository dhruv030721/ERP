import { Router } from 'express'
import AddStudent from './Student/index'
import Attedance from "./Attendance/index"
import upload from '../../Utils/upload';

const   router = Router();

router.post("/ImportStudentdata", upload.single('file'), AddStudent.ImportStudentdata);
// router.post("/AddStudent", AddStudent.AddNewStudent);
router.get("/Download_Import_Student_Sample_file", AddStudent.DownloadImportStudentSampleFile);
router.get('/get_timetable/:employeeId', Attedance.GetTimeTable);
router.post('/get_students', Attedance.GetStudents)
router.post('/mark_attendance', Attedance.MarkAttendance);
router.get('/attendance_report/:subject_code/:sem/:month', Attedance.MonthlyAttendanceReport);

export default router;