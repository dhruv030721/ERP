import axios from "axios";
import { apiConnector } from '../ApiConnector';
import { AcademicsEndpoints } from "../Apis";

const { DOWNLOAD_SAMPLE_EXCEL } = AcademicsEndpoints;

class AcademicsServices {
    async ImportStudentData(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiConnector(
                post,
                DOWNLOAD_SAMPLE_EXCEL,
                formData,
                {
                    "Content-Type": "multipart/form-data"
                }
            )

            return { message: response.data.message };


        } catch (error) {
            throw error;
        }


    }
}

const academicServices = new AcademicsServices();

export default academicServices;