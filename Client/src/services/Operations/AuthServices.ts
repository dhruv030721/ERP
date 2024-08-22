import { AuthEndpoints } from "../Apis";
import { apiConnector } from "../ApiConnector";

class AuthServices {
    async login(data: any) {
        const body = {
            mobileNumber: data.username,
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

    async generate_password(data: any) {
        const response = await apiConnector({
            method: "POST",
            url: AuthEndpoints.GENERATE_PASSWORD,
            bodyData: data
        })

        console.log(response)

        return response;
    }
}

const authServices = new AuthServices();

export default authServices;
