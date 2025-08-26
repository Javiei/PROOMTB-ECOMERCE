import React, { createContext, useState, useContext } from 'react';

export const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const openAuthModal = (tab = 'login') => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    activeTab,
    openAuthModal,
    closeAuthModal,
    setActiveTab
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
