import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Número de teléfono al que se enviarán los mensajes (mismo que en el Header)
  const phoneNumber = '18297163555'; // Número de WhatsApp de PMTB
  // Mensaje predeterminado que aparecerá en el chat
  const defaultMessage = 'Hola, me gustaría obtener más información sobre sus productos';
  
  // URL de WhatsApp con el número y mensaje predefinido
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        aria-label="Chatear por WhatsApp"
        style={{
          width: '60px',
          height: '60px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Pulsing effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        
        {/* WhatsApp icon */}
        <FaWhatsapp className="text-3xl relative z-10" />
        
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
        
        {/* Tooltip */}
        <span className="absolute right-14 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          ¡Chatea con nosotros!
        </span>
      </a>
      
      {/* Floating label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-medium py-1.5 px-3 rounded-full whitespace-nowrap shadow-md">
        ¿Necesitas ayuda?
      </div>
    </div>
  );
};

export default WhatsAppButton;
