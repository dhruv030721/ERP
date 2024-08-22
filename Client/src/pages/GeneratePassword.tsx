import { Header } from "../components";
import { Input } from "../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { authServices } from "../services";
import toast from "react-hot-toast";
import { toastDesign } from "../components/GlobalVariables";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix the import (it's a default export)

interface GeneratePasswordForm {
    password: string;
    confirmpassword: string;
    mobileNumber: string;
    token: string;
}

const GeneratePassword = () => {

    const { register, handleSubmit } = useForm<GeneratePasswordForm>();
    const { token }: any = useParams();

    // Decode and check the expiration
    let mobileNumber: string | undefined;

    try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); 

        if (decodedToken.exp < currentTime) {
            throw new Error("Token is expired");
        }

        mobileNumber = decodedToken.mobileNumber;

    } catch (error) {
        toast.error("Invalid or expired token");
        return null;
    }

    const GeneratePasswordHandler: SubmitHandler<GeneratePasswordForm> = async (data) => {
        data.mobileNumber = mobileNumber!;
        data.token = token;

        await toast.promise(
            authServices.generate_password(data),
            {
                loading: "Processing.........",
                success: (response) => {
                    return `${response.data.message}`;
                },
                error: (error) => {
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        );
    };

    return (
        <div className="font-poppins font-semibold">
            <Header />
            <div className="flex flex-col justify-center items-center h-96 gap-y-10">
                <h1 className="text-2xl">Generate Password</h1>
                <form className="flex flex-col justify-center items-center gap-y-5" onSubmit={handleSubmit(GeneratePasswordHandler)}>
                    <Input label="Password" className="w-80" {...register("password")} type="password" />
                    <Input label="Confirm Password" className="w-80" {...register("confirmpassword")} type="password" />
                    <button className="bg-orange-500 rounded-md py-3 text-white font-bold w-80" type="submit">Generate Password</button>
                </form>
            </div>
        </div>
    );
};

export default GeneratePassword;
