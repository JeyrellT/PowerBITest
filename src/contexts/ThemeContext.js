import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedAccent = localStorage.getItem('accentColor') || 'blue';
    setTheme(savedTheme);
    setAccentColor(savedAccent);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-accent', savedAccent);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changeAccent = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    document.documentElement.setAttribute('data-accent', color);
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, changeAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};
