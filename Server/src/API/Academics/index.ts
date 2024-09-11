import { Router } from 'express'
import AddStudent from './Student/index'
import Subject from "./Subject/index"
import Attedance from "./Attendance/index"
import Faculty from "./Faculty/index"
import upload from '../../Utils/upload';

const router = Router();

// <- Data fetching ->
router.get('/get_subjects', Attedance.GetSubjects);
router.get('/get_timetable/:employeeId', Attedance.GetTimeTable);
router.post('/get_students', Attedance.GetStudents)
router.get('/get_faculty', Faculty.GetFaculty)
router.get('/get_branch', Attedance.GetBranch)


// <- Data Importing using Excel ->
router.post("/ImportStudentdata", upload.single('file'), AddStudent.ImportStudentdata);
router.post("/ImportSubjectdata", upload.single('file'), Subject.AddSubject);

// <- Download sample file -> 
router.get("/Download_Import_Student_Sample_file", AddStudent.DownloadImportStudentSampleFile);
router.get("/Download_Add_Subject_Sample_file", Subject.DownloadAddSubjectSampleFile)


// router.post("/AddStudent", AddStudent.AddNewStudent);
router.post('/mark_attendance', Attedance.MarkAttendance);
router.get('/attendance_report/:subject_code/:sem/:month', Attedance.MonthlyAttendanceReport);


// <- Faculty Routes ->


export default router;