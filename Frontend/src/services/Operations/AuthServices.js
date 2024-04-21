import { Endpoints } from "../Apis";
import { apiConnector } from "../ApiConnector";

const { LOGIN_API } = Endpoints

class AuthServices {

    async Login(data) {
        try {
            const body = {
                employee_id: data.username,
                password: data.password,
            };

            const response = await apiConnector(
                "POST",
                LOGIN_API,
                body,
            )

            return response;

        } catch (error) {
            throw error
        }
    }

}

const authServices = new AuthServices();

export default authServices;