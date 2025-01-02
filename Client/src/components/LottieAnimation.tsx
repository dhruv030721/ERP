import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
    json: object;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ json }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <Lottie
                animationData={json}
                loop={true}
                style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '300px', // Default for small screens
                }}
            />
            <style>{`
                @media (min-width: 640px) {
                    div :global(.lottie-container) {
                        max-width: 500px; /* Medium screens */
                    }
                }
                @media (min-width: 1024px) {
                    div :global(.lottie-container) {
                        max-width: 700px; /* Large screens */
                    }
                }
            `}</style>
        </div>
    );
};

export default LottieAnimation;
