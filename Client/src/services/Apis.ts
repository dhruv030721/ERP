const BASE_URL = "/api/";

// Authentication Endpoints
export const Endpoints = {
    LOGIN_API: BASE_URL + "auth/login",
}


// Academics Endpoints
export const AcademicsEndpoints = {
    DOWNLOAD_SAMPLE_EXCEL: BASE_URL + "academics/Download_Import_Student_Sample_file",
    IMPORT_STUDENT_DATA: BASE_URL + "academics/ImportStudentdata",
    GET_TIMETABLE: BASE_URL + "academics/get_timetable/",
    GET_STUDENTS: BASE_URL + "academics/get_students",
    MARK_ATTENDANCE: BASE_URL + "academics/mark_attendance",
    DOWNLOAD_REPORT: BASE_URL + "academics/attendance_report",
    GET_SUBJECTS: BASE_URL + "academics/get_subjects"
}
