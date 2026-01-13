import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/proomtb-x-raymon.json';

const LoadingScreen = ({ onComplete, isFading }) => {
    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center bg-black transition-opacity duration-700 ease-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full h-full">
                <Lottie
                    animationData={animationData}
                    loop={false}
                    autoplay={true}
                    onComplete={onComplete}
                    className="w-full h-full"
                />
            </div>
        </div>
    );
};

export default LoadingScreen;
