import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Add/remove dark class on html element for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'linear-gradient(135deg, #45366E, #2D2050, #3D10BC)';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.color = '#f9fafb'; // gray-50
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = 'linear-gradient(135deg, #916DE6, #E94A99, #F27D1D)';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.color = '#111827'; // gray-900
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
