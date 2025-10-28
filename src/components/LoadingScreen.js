import React, { useState, useRef, useEffect } from 'react';
import verticalVideo from '../assets/VERTICAL.mp4';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleVideoEnd = () => {
      setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete();
      }, 500);
    };

    // Mostrar el video inmediatamente
    if (video) {
      video.play().catch(() => {}); // Intentar reproducir sin esperar
      video.addEventListener('ended', handleVideoEnd);
    }
    // Mostrar spinner solo si tarda en cargar
    const spinnerTimeout = setTimeout(() => setLoading(true), 1000);
    video && video.addEventListener('canplay', () => {
      setLoading(false);
      clearTimeout(spinnerTimeout);
    });

    return () => {
      if (video) video.removeEventListener('ended', handleVideoEnd);
      clearTimeout(spinnerTimeout);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      {/* Video vertical */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
        preload="auto"
      >
        <source src={verticalVideo} type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Pantalla de carga mientras se carga el video */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
