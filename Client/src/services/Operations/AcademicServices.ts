import { apiConnector } from '../ApiConnector';
import { AcademicsEndpoints } from '../Apis';

const { IMPORT_STUDENT_DATA, GET_TIMETABLE } = AcademicsEndpoints;

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
}

const academicServices = new AcademicsServices();

export default academicServices;
