import { apiConnector } from '../ApiConnector';
import { AcademicsEndpoints } from '../Apis';

const { IMPORT_STUDENT_DATA, GET_TIMETABLE, GET_STUDENTS, MARK_ATTENDANCE } = AcademicsEndpoints;

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
    const body = {
      sem: lectureDetails.sem,
      branch: lectureDetails.branch,
      subject: lectureDetails.subject,
      time: lectureDetails.time,
      day: lectureDetails.day,
      facultyId: lectureDetails.facultyId,
      attendance: attendance
    }

    const response = await apiConnector({
      method: 'POST',
      url: MARK_ATTENDANCE,
      bodyData: body,
    })

    return response;

  }


}

const academicServices = new AcademicsServices();

export default academicServices;
