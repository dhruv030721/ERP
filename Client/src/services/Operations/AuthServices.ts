import { AuthEndpoints } from "../Apis";
import { apiConnector } from "../ApiConnector";


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
            url: AuthEndpoints.LOGIN_API,
            bodyData: body,
        });

        return response;
    }


    async register(data: any) {
        const response = await apiConnector({
            method: 'POST',
            url: AuthEndpoints.REGISTER,
            bodyData: data
        })

        return response;
    }
}

const authServices = new AuthServices();

export default authServices;
