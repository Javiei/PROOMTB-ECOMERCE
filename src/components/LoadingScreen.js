import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
// Import the Lottie animation JSON file
import logoAnimation from '../assets/Logo-2-[remix].json';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAnimationComplete = () => {
    // Wait a bit after animation completes, then hide loading screen
    setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      {/* Fullscreen Lottie Animation */}
      <Lottie 
        animationData={logoAnimation}
        loop={false}
        autoplay={true}
        onComplete={handleAnimationComplete}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default LoadingScreen;
