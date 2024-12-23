import React from 'react';
import { useDispatch } from 'react-redux';
import logo from '../assets/logo/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authServices } from '../services/index';
import { toastDesign } from '../components/GlobalVariables';
import { login } from '../slices/auth';

interface LoginFormInputs {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginHandler: SubmitHandler<LoginFormInputs> = async (data) => {
        await toast.promise(
            authServices.login(data),
            {
                loading: "Processing",
                success: (response) => {
                    dispatch(login(response.data.data));
                    navigate('/');
                    return `${response.data.message}`;
                },
                error: (error) => {
                    console.log(error);
                    return `${error.response.data.message}`;
                }
            },
            toastDesign
        );
    };

    return (
        <div className='flex flex-col md:flex-row min-h-screen overflow-hidden'>
            {/* Media Section */}
            <div className='w-full md:w-1/2 h-[30vh] md:h-screen relative flex justify-center items-center'>
                {/* Background Circles - Hidden on small screens */}
                <div className='hidden md:block bg-orangeCircle w-[150%] h-[100%] object-fill opacity-55 bg-center bg-no-repeat z-0 absolute right-0 top-20'></div>
                <div className='hidden md:block bg-blueCircle w-[100%] h-[100%] object-fill bg-no-repeat z-10 absolute left-40 bottom-20'></div>

                {/* Logo Container */}
                <div className='w-[80%] md:w-[50%] h-full md:h-[70%] relative z-20 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80 md:shadow-xl flex justify-center items-center'>
                    <img
                        src={logo}
                        alt="College Logo"
                        className='w-24 md:w-72 z-30 '
                    />
                </div>
            </div>

            {/* Form Section */}
            <div className='w-full md:w-1/2 p-4 md:p-0 flex justify-center items-center font-poppins'>
                <div className='w-full max-w-md md:w-[70%] lg:w-[50%] p-6 md:p-8 bg-white md:bg-transparent rounded-lg md:rounded-md  md:bg-clip-padding md:backdrop-filter md:backdrop-blur-3xl md:bg-opacity-80'>
                    <div className='flex flex-col z-10 space-y-6'>
                        {/* Header */}
                        <h1 className=' text-2xl md:text-3xl lg:text-4xl text-center'>
                            Welcome to SPCE Admin
                        </h1>
                        <p className=' font-semibold text-lg md:text-xl text-center'>
                            Login Here
                        </p>

                        {/* Form */}
                        <form
                            className='flex flex-col space-y-4'
                            onSubmit={handleSubmit(loginHandler)}
                        >
                            <div className='space-y-1'>
                                <Input
                                    label="Username"
                                    type="text"
                                    placeholder='Enter your mobile number'
                                    {...register("username", { required: true })}
                                />
                                {errors.username &&
                                    <p className='text-red-500 text-sm font-bold'>
                                        *Please check the username
                                    </p>
                                }
                            </div>
                            <div className='space-y-1'>
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder='Enter your password'
                                    {...register("password", {
                                        required: true,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                                    })}
                                />
                                {errors.password &&
                                    <p className='text-red-500 text-sm font-bold'>
                                        *Please check the password
                                    </p>
                                }
                            </div>

                            <button
                                className='bg-orange-400 rounded-md py-2.5 md:py-3 text-white font-bold hover:bg-orange-500 transition-colors duration-200'
                                type="submit"
                            >
                                Login &rarr;
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className='flex justify-end pt-2'>
                            <Link
                                to="forgotpassword"
                                className='text-orange-500 underline font-bold text-sm md:text-md hover:scale-105 duration-100'
                            >
                                forgot password?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;