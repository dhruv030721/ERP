import React from 'react';
// import LottieAnimation from './LottieAnimation';
// import BoyStudy from '../assets/lottie/person_studying.json';
import { lineSpinner } from 'ldrs'

lineSpinner.register()
interface LoadingProps {
  message: string;
  size: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className='min-h-screen bg-bg-gray text-orange-500 flex flex-col items-center justify-center font-poppins text-4xl'>
      <h2 className='font-bold drop-shadow-3xl'>{message}</h2>
      {/* <LottieAnimation json={BoyStudy} /> */}
      <l-line-spinner
        size="40"
        stroke="3"
        speed="0.5"
        color="#853500"
      ></l-line-spinner>
    </div>
  );
};

export default Loading;
