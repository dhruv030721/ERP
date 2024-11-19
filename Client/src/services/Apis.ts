const BASE_URL = "/api/";

// Authentication Endpoints
export const AuthEndpoints = {
    LOGIN_API: BASE_URL + "auth/login",
    REGISTER: BASE_URL + "auth/register",
    GENERATE_PASSWORD: BASE_URL + "auth/generate_password"
}


// Academics Endpoints
export const AcademicsEndpoints = {
    DOWNLOAD_SAMPLE_EXCEL: BASE_URL + "academics/Download_Import_Student_Sample_file",
    IMPORT_STUDENT_DATA: BASE_URL + "academics/ImportStudentdata",
    IMPORT_SUBJECT_DATA: BASE_URL + "academics/ImportSubjectdata",
    GET_TIMETABLE: BASE_URL + "academics/get_timetable/",
    GET_STUDENTS: BASE_URL + "academics/get_students",
    MARK_ATTENDANCE: BASE_URL + "academics/mark_attendance",
    DOWNLOAD_REPORT: BASE_URL + "academics/attendance_report",
    GET_SUBJECTS: BASE_URL + "academics/get_subjects",
    GET_FACULTY: BASE_URL + "academics/get_faculty",
    GET_BRANCH: BASE_URL + "academics/get_branch",
    ASSIGN_SUBJECT: BASE_URL + "academics/assign_subject",
    GET_ASSIGN_SUBJECT: BASE_URL + "academics/get_assign_subject",
    DOWNLOAD_TIMETABLE_SAMPLE_FILE: BASE_URL + "academics/Download_Timetable_Sample_file",
    SET_TIMETABLE: BASE_URL + "academics/set_timetable"
}


// Faculty Services Endpoints
export const FacultyServicesEndpoints = {

}
