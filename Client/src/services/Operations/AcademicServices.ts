import { apiConnector } from '../ApiConnector';
import { AcademicsEndpoints } from '../Apis';

const { IMPORT_STUDENT_DATA, GET_TIMETABLE, GET_STUDENTS, MARK_ATTENDANCE, IMPORT_SUBJECT_DATA } = AcademicsEndpoints;

class AcademicsServices {
  async ImportStudentData(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiConnector({
      method: 'POST',
      url: IMPORT_STUDENT_DATA,
      bodyData: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  async ImportSubjectData(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiConnector({
      method: 'POST',
      url: IMPORT_SUBJECT_DATA,
      bodyData: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  async GetTimetable(employeedId: string) {
    const response = await apiConnector({
      method: 'GET',
      url: GET_TIMETABLE + employeedId
    })
    return response;

  }


  async GetStudents({ sem, branch }: any) {
    const body = {
      sem: sem,
      branch: branch
    }
    const response = await apiConnector({
      method: 'POST',
      url: GET_STUDENTS,
      bodyData: body
    })
    return response;
  }


  async MarkAttendance(lectureDetails: any, attendance: any) {
    // Create a new Date object to avoid mutating the original date
    const date = new Date(lectureDetails.date);
    date.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    const body = {
      sem: lectureDetails.sem,
      branch: lectureDetails.branch,
      subject: lectureDetails.subject,
      time: lectureDetails.time,
      day: lectureDetails.day,
      facultyId: lectureDetails.facultyId,
      attendance: attendance,
      date: date.toISOString() // Convert date to ISO string if needed
    };

    const response = await apiConnector({
      method: 'POST',
      url: MARK_ATTENDANCE,
      bodyData: body,
    });

    return response;
  }

  async GetSubjects() {
    const response = await apiConnector({
      method: 'GET',
      url: AcademicsEndpoints.GET_SUBJECTS
    })


    return response;
  }


  async DownloadReport(subjectCode: number, sem: number, month: number) {
    const response: any = await apiConnector({
      method: 'GET',
      url: `${AcademicsEndpoints.DOWNLOAD_REPORT + '/' + subjectCode + '/' + sem + '/' + month}`
    })

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.href = window.URL.createObjectURL(blob);
    link.download = 'MonthlyAttendanceReport.pdf';

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);

  }

  async GetFaculty() {
    const response: any = await apiConnector({
      method: "GET",
      url: `${AcademicsEndpoints.GET_FACULTY}`
    })

    return response;
  }

  async GetBranch() {
    const response: any = await apiConnector({
      method: "GET",
      url: `${AcademicsEndpoints.GET_BRANCH}`
    })

    return response;
  }

  async AssignSubject(AssignSubjectData: any) {
    const response = await apiConnector({
      method: "POST",
      url: `${AcademicsEndpoints.ASSIGN_SUBJECT}`,
      bodyData: AssignSubjectData
    })

    return response;
  }
}

const academicServices = new AcademicsServices();

export default academicServices;
