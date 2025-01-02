import { SubmitHandler, useForm } from "react-hook-form"
import { Header, Input } from "../components"
import { ring2 } from "ldrs";
import toast from "react-hot-toast";
import { authServices } from "../services";
import { toastDesign } from "../components/GlobalVariables";
import { useNavigate } from "react-router-dom";

ring2.register();

interface ForgotPasswordForm {
    mobileNumber: string;
}

const ForgotPassword = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordForm>();
    const navigate = useNavigate();

    const ForgotPasswordHandler: SubmitHandler<ForgotPasswordForm> = async (data) => {

        await toast.promise(
            authServices.forgot_password(data.mobileNumber),
            {
                loading: "Processing",
                success: (response) => {
                    reset();
                    navigate('/login');
                    return `${response.data.message}`;
                },
                error: (error) => {
                    console.log(error);
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        )
    }


    return <>
        <Header />
        <div>
            <div className="flex-1 flex flex-col font-poppins items-center p-4 md:p-8" >
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-xl font-semibold md:text-2xl text-center mb-6 md:mb-10">
                        Forgot Password
                    </h1>
                    <form
                        className="flex flex-col gap-y-4 md:gap-y-5 w-full"
                        onSubmit={handleSubmit(ForgotPasswordHandler)}
                    >
                        <div className="w-full">
                            <Input
                                label="Contact Number"
                                divclassName="w-full"
                                {...register("mobileNumber", {
                                    required: true,
                                    pattern: /^(?:\+91|91|0)?[6-9]\d{9}$/,
                                })}
                                type="number"
                                placeholder="Enter your Mobile Number here"
                            />
                            <p className="text-gray-600 text-xs pt-5">Note : Enter your registered mobile number to forgot password and the re-generation password link you will get on your <b>registered email</b>.</p>
                            {errors.mobileNumber && (
                                <p className="text-red-500 font-DmSans text-xs md:text-sm font-bold mt-1">
                                    *Please enter valid Contact Number
                                </p>
                            )}
                        </div>

                        <button
                            className="bg-orange-500 font-DmSans rounded-md py-3 text-white w-full mt-4 hover:bg-orange-600 transition-colors duration-200"
                            type="submit"
                        >
                            Forgot Password
                        </button>
                    </form>
                </div>
            </div >
        </div >
    </>
}

export default ForgotPassword
