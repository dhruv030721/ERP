import { Header, Loading } from "../components";
import { Input } from "../components";
import { SubmitHandler, useForm } from "react-hook-form";
import { authServices } from "../services";
import toast from "react-hot-toast";
import { toastDesign } from "../components/GlobalVariables";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

interface GeneratePasswordForm {
    password: string;
    confirmpassword: string;
    mobileNumber: string;
    token: string;
}

const GeneratePassword = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<GeneratePasswordForm>();
    const { token }: any = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isExpired, setIsExpired] = useState(false);
    let mobileNumber: string = "";

    const tokenVerification = async () => {
        try {
            const decodedToken: any = jwtDecode(token);
            mobileNumber = decodedToken.mobileNumber;

            const response = await authServices.generate_password_token_verification(mobileNumber);

            if (response.data.status === "false") {
                throw new Error("Invalid Token");
            }
        } catch (error) {
            toast.error("Invalid or expired token", toastDesign);
            setIsExpired(true);
            setLoading(false);
        }
    };

    const GeneratePasswordHandler: SubmitHandler<GeneratePasswordForm> = async (data) => {
        data.mobileNumber = mobileNumber!;
        data.token = token;

        await toast.promise(
            authServices.generate_password(data),
            {
                loading: "Processing",
                success: (response) => {
                    reset();
                    navigate('/');
                    return `${response.data.message}`;
                },
                error: (error) => {
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        );
    };

    useEffect(() => {
        tokenVerification();
    });

    if (loading) {
        return (
            <Loading message='' size={"max-w-[20%]"} />
        );
    }

    return <>
        {
            isExpired ? <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center max-w-md mx-auto p-8 rounded-lg bg-gray-50 border">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Link Expired!
                        </h1>
                        <p className="text-gray-600 mb-6 font-poppins">
                            The password reset link has expired or is invalid. Please request a new password reset link.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-orange-500 rounded-md font-DmSans text-white py-3 px-6  hover:bg-orange-600 transition-colors duration-200"

                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div> : (<div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col font-poppins items-center p-4 md:p-8">
                    <div className="w-full max-w-md mx-auto">
                        <h1 className="text-xl font-semibold md:text-2xl text-center mb-6 md:mb-10">
                            Generate Password
                        </h1>
                        <form
                            className="flex flex-col gap-y-4 md:gap-y-5 w-full"
                            onSubmit={handleSubmit(GeneratePasswordHandler)}
                        >
                            <div className="w-full">
                                <Input
                                    label="Password"
                                    divclassName="w-full"
                                    {...register("password", {
                                        required: true,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    })}
                                    type="password"
                                    placeholder="Enter your password here"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-xs md:text-sm font-bold mt-1">
                                        *Please check the password requirements
                                    </p>
                                )}
                            </div>

                            <div className="w-full">
                                <Input
                                    label="Confirm Password"
                                    divclassName="w-full"
                                    {...register("confirmpassword", {
                                        required: true,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                                    })}
                                    type="password"
                                    placeholder="Enter your confirm password here"
                                />
                                {errors.confirmpassword && (
                                    <p className="text-red-500 text-xs md:text-sm font-bold mt-1">
                                        *Please check the password requirements
                                    </p>
                                )}
                            </div>

                            <div className="text-xs font-DmSans bg-gray-50 p-2 border rounded-md">
                                <ul className="flex flex-col space-y-1">
                                    <li>Must be at least <strong>8 characters</strong> long.</li>
                                    <li>Must include at least <strong>one lowercase letter</strong> (<code>a-z</code>).</li>
                                    <li>Must include at least <strong>one uppercase letter</strong> (<code>A-Z</code>).</li>
                                    <li>Must include at least <strong>one numeric digit</strong> (<code>0-9</code>).</li>
                                    <li>Must include at least <strong>one special character</strong> (<code>@$!%*?&</code>).</li>
                                    <li>Can only contain <strong>letters</strong>, <strong>digits</strong>, and the specified special characters (<code>A-Za-z0-9@$!%*?&</code>).</li>
                                </ul>
                            </div>

                            <button
                                className="bg-orange-500 rounded-md font-DmSans py-3 text-white w-full mt-4 hover:bg-orange-600 transition-colors duration-200"
                                type="submit"
                            >
                                Generate Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>)
        }
    </>
};


export default GeneratePassword;