import { SubmitHandler, useForm } from "react-hook-form"
import { Header, Input } from "../components"
import { ring2 } from "ldrs";
import { useState } from "react";

ring2.register();

interface ForgotPasswordForm {
    email: string;
}

const ForgotPassword = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordForm>();
    const [loading, setLoading] = useState(false);

    const ForgotPasswordHandler: SubmitHandler<ForgotPasswordForm> = (data) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }


    return <>
        <Header />
        {
            loading ? (
                <div className="flex flex-col space-y-5 justify-center items-center h-96">
                    <l-ring-2
                        size="40"
                        stroke="5"
                        stroke-length="0.25"
                        bg-opacity="0.1"
                        speed="0.5"
                        color="#CC5500"
                    ></l-ring-2>
                    <p className="font-poppins text-[#CC5500] font-semibold">Processing</p>
                </div>
            ) : (<div>
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
                                    label="Email"
                                    divclassName="w-full"
                                    {...register("email", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    })}
                                    type="email"
                                    placeholder="Enter your email here"
                                />
                                <p className="text-gray-600 text-xs pt-5">Note : Enter your registered email to forgot password.</p>
                                {errors.email && (
                                    <p className="text-red-500 font-DmSans text-xs md:text-sm font-bold mt-1">
                                        *Please enter valid email
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
            </div >)
        }
    </>
}

export default ForgotPassword
