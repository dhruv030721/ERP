import { Endpoints } from "../Apis";
import { apiConnector } from "../ApiConnector";

const { LOGIN_API } = Endpoints;

interface LoginData {
    username: string;
    password: string;
}

class AuthServices {
    async login(data: LoginData) {
        const body = {
            employeeId: data.username,
            password: data.password,
        };

        const response = await apiConnector({
            method: "POST",
            url: LOGIN_API,
            bodyData: body,
        });

        return response;
    }
}

const authServices = new AuthServices();

export default authServices;
