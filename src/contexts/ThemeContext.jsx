import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // localStorage'dan tema tercihini oku
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    // Tema değiştiğinde localStorage'a kaydet
    localStorage.setItem('theme', theme)
    
    // Body'ye tema class'ı ekle
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme'
  }, [theme])

  const toggleTheme = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
