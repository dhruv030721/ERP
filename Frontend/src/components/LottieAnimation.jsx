import React from 'react'
import Lottie from 'lottie-react'

    function LottieAnimation({ 
        json,
        divclassName = ''
     }) {
        return (
            <div className={`${divclassName}`}>
                <Lottie animationData={json} loop={true} />
            </div>
        )
    }

export default LottieAnimation
