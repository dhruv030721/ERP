import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
    json: object;
    divclassName?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
    json,
    divclassName = '',
}) => {
    return (
        <div className={divclassName}>
            <Lottie animationData={json} loop={true} />
        </div>
    );
};

export default LottieAnimation;
