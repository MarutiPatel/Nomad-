import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScreenshotProtectionContextType {
  isContentBlurred: boolean;
  isWindowVisible: boolean;
}

const ScreenshotProtectionContext = createContext<ScreenshotProtectionContextType | undefined>(undefined);

interface ScreenshotProtectionProviderProps {
  children: ReactNode;
}

export function ScreenshotProtectionProvider({ children }: ScreenshotProtectionProviderProps) {
  const [isContentBlurred, setIsContentBlurred] = useState(false);
  const [isWindowVisible, setIsWindowVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsWindowVisible(isVisible);
      setIsContentBlurred(!isVisible);
    };

    const handleWindowBlur = () => {
      setIsContentBlurred(true);
      setIsWindowVisible(false);
    };

    const handleWindowFocus = () => {
      setIsContentBlurred(false);
      setIsWindowVisible(true);
    };

    const handleBeforeUnload = () => {
      setIsContentBlurred(true);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Additional protection for mobile devices
    const handlePageHide = () => {
      setIsContentBlurred(true);
    };

    const handlePageShow = () => {
      setIsContentBlurred(false);
      setIsWindowVisible(true);
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    // Clean up event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <ScreenshotProtectionContext.Provider value={{ isContentBlurred, isWindowVisible }}>
      {children}
    </ScreenshotProtectionContext.Provider>
  );
}

export function useScreenshotProtection() {
  const context = useContext(ScreenshotProtectionContext);
  if (context === undefined) {
    throw new Error('useScreenshotProtection must be used within a ScreenshotProtectionProvider');
  }
  return context;
}