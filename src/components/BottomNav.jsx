import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaScroll, FaCog } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import './BottomNav.css'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const [showSettings, setShowSettings] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme)
    // Tema değiştirildi
  }

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage)
    // Dil değiştirildi
  }

  return (
    <nav className="bottom-nav">
      {showSettings && (
        <div className="settings-dropdown">
          <div className="settings-section">
            <h4 className="settings-title">{t('theme')}</h4>
            <div className="settings-options">
              <button 
                className={`settings-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                🌙 {t('dark')}
              </button>
              <button 
                className={`settings-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                ☀️ {t('light')}
              </button>
            </div>
          </div>
          
          <div className="settings-section">
            <h4 className="settings-title">{t('language')}</h4>
            <div className="settings-options">
              <button 
                className={`settings-option ${language === 'tr' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('tr')}
              >
                🇹🇷 {t('turkish')}
              </button>
              <button 
                className={`settings-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                🇬🇧 {t('english')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bottom-nav-container">
        <button 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
          aria-label={t('homePage')}
          title={t('homePage')}
        >
          <FaHome className="nav-icon" />
        </button>
        
        <button 
          className={`nav-item ${isActive('/blog') ? 'active' : ''}`}
          onClick={() => navigate('/blog')}
          aria-label={t('articles')}
          title={t('articles')}
        >
          <FaScroll className="nav-icon" />
        </button>

        <button 
          className={`nav-item ${showSettings ? 'active' : ''}`}
          onClick={toggleSettings}
          aria-label={t('settings')}
          title={t('settings')}
        >
          <FaCog className="nav-icon" />
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
