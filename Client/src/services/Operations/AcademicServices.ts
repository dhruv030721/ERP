
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

  async GetTimetable(mobileNumber: string) {
    console.log("Execute")
    const response = await apiConnector({
      method: 'GET',
      url: GET_TIMETABLE + mobileNumber
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
      type: lectureDetails.type,
      batch: lectureDetails.batch,
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
    // console.log("Get Subject API Hit..............")
    const response = await apiConnector({
      method: 'GET',
      url: AcademicsEndpoints.GET_SUBJECTS
    })


    return response;
  }


  async DownloadReport(reportParams: string) {

    const [subjectCode, sem, type, batch] = reportParams.split('_');

    const body = {
      subject_code: subjectCode,
      sem,
      type,
      batch
    }

    const response: any = await apiConnector({
      method: 'POST',
      url: `${AcademicsEndpoints.DOWNLOAD_REPORT}`,
      bodyData: body,
      responseType: 'blob'
    })

    // Create a new Blob object using the response data
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.href = window.URL.createObjectURL(blob);
    link.download = `${sem}_${subjectCode}_${Date.now()}.pdf`;

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
    // console.log("Get Branch API Hit..............")
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

  async GetAssignSubject(facultyId: any) {
    const response = await apiConnector({
      method: "GET",
      url: `${AcademicsEndpoints.GET_ASSIGN_SUBJECT}/${facultyId}`,
    })

    return response;
  }

  async DownloadTimeTableSampleFile() {
    const response = await apiConnector({
      method: "GET",
      url: `${AcademicsEndpoints.DOWNLOAD_TIMETABLE_SAMPLE_FILE}`
    })

    return response;
  }

  async SetTimetable(file: File) {

    const formData = new FormData();

    formData.append('file', file);

    const response = await apiConnector({
      method: "POST",
      url: `${AcademicsEndpoints.SET_TIMETABLE}`,
      bodyData: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response;
  }


}

const academicServices = new AcademicsServices();

export default academicServices;
