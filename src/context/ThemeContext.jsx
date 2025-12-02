import { createContext, useContext, useState, useEffect } from 'react';

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
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isBusinessMode, setIsBusinessMode] = useState(() => {
    // Check localStorage for saved business mode preference
    const saved = localStorage.getItem('businessMode');
    return saved === 'true' ? true : false;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Update document class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Save business mode preference to localStorage
    localStorage.setItem('businessMode', isBusinessMode.toString());
  }, [isBusinessMode]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const toggleBusinessMode = () => setIsBusinessMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isBusinessMode, toggleBusinessMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
