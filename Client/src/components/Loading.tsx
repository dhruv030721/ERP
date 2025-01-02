import React from 'react';
import LottieAnimation from './LottieAnimation';
import BoyStudy from '../assets/lottie/person_studying.json';

interface LoadingProps {
  message: string;
  size: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className='min-h-screen bg-bg-gray text-orange-500 flex flex-col items-center justify-center font-poppins text-4xl'>
      <h2 className='font-bold drop-shadow-3xl'>{message}</h2>
      <LottieAnimation json={BoyStudy} />
    </div>
  );
};

export default Loading;
