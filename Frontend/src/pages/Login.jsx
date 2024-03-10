import React from 'react'
import logo from '../assets/logo/logo.png'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className='flex overflow-hidden'>
        {/* media  */}
        <div className='w-[50%] h-[100vh]  relative  flex justify-center items-center'>
            <div className='bg-orangeCircle w-[150%] h-[100%] object-fill opacity-55 bg-center bg-no-repeat z-0 absolute right-0 top-20'></div>
            <div className='bg-blueCircle w-[100%] h-[100%] object-fill bg-no-repeat z-10 absolute left-40 bottom-20'></div>
            <div className='w-[50%] h-[70%] bg-black-500  relative z-20 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80 shadow-xl'>
                <img src={logo} alt="College Logo" className='w-72 z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/>
            </div>
        </div>
        {/* form */}
        <div className='w-[50%] relative flex justify-center items-center font-poppins'>
            <div className='w-[50%] h-[70%] bg-black-500 relative z-0 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80'>
            <div className='flex flex-col z-10'>
                    <h1 className='font-poppins text-4xl font-extrabold text-center'>Welcome to SPCE Admin</h1>
                    <p className='font-poppins font-bold text-xl text-center mt-10'>Login Here</p>
                    <form action="" className='flex flex-col space-y-3 mt-10'>
                    <label htmlFor="username">Username</label>
                    <input type="text" className='border-b-2 border-black-500 focus:outline-none' id='username'/>
                    <label htmlFor="password">Password</label>
                    <input type="password" className='border-b-2 border-black-500 focus:outline-none' id='password'/> 
                    </form>
                    <Link to="forgotpassword" className='text-orange-500 underline font-bold text-end mt-5 text-md hover:scale-105'>forgot password?</Link>
                    <button className='mt-5 bg-orange-400 rounded-md py-3 text-white font-bold hover:bg-orange-500'>Login &rarr;</button>
                    <Link to="registeradmin" className='text-orange-500 font-bold text-center mt-5 hover:scale-105'>Register new Admin?</Link>
                </div>
            </div>
            
        </div>
        
    </div>
  )
}

export default Login
