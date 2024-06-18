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
                loading: "Processing.........",
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
        <div className='flex overflow-hidden'>
            {/* media */}
            <div className='w-[50%] h-[100vh] relative flex justify-center items-center'>
                <div className='bg-orangeCircle w-[150%] h-[100%] object-fill opacity-55 bg-center bg-no-repeat z-0 absolute right-0 top-20'></div>
                <div className='bg-blueCircle w-[100%] h-[100%] object-fill bg-no-repeat z-10 absolute left-40 bottom-20'></div>
                <div className='w-[50%] h-[70%] bg-black-500 relative z-20 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80 shadow-xl'>
                    <img src={logo} alt="College Logo" className='w-72 z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                </div>
            </div>
            {/* form */}
            <div className='w-[50%] relative flex justify-center items-center font-poppins'>
                <div className='w-[50%] h-[70%] bg-black-500 relative z-0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80'>
                    <div className='flex flex-col z-10'>
                        <h1 className='font-poppins text-4xl font-extrabold text-center'>Welcome to SPCE Admin</h1>
                        <p className='font-poppins font-bold text-xl text-center mt-10'>Login Here</p>
                        <form className='flex flex-col space-y-3 mt-10' onSubmit={handleSubmit(loginHandler)}>
                            <Input
                                label="Username"
                                type="text"
                                {...register("username", { required: true })}
                            />
                            {errors.username && <p className='text-red-500 font-bold'>*Please check the username</p>}
                            <Input
                                label="Password"
                                type="password"
                                {...register("password", {
                                    required: true,
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                })}
                            />
                            {errors.password && <p className='text-red-500 font-bold'>*Please check the password</p>}
                            <button className='bg-orange-400 rounded-md py-3 text-white font-bold hover:bg-orange-500' type="submit">Login &rarr;</button>
                        </form>
                        <div className='flex justify-end'>
                            <Link to="forgotpassword" className='text-orange-500 underline font-bold mt-5 text-md hover:scale-105 duration-100'>forgot password?</Link>
                        </div>
                        {/* <Link to="registeradmin" className='text-orange-500 font-bold text-center mt-5 hover:scale-105 duration-75'>Register new Admin?</Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
