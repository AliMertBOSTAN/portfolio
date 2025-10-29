import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    
    // Eğer blog sayfasındaysak, önce ana sayfaya dön
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <span className="logo-text">Portfolio</span>
        </div>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a onClick={() => handleNavClick('home')}>Ana Sayfa</a>
          <a onClick={() => handleNavClick('about')}>Hakkımda</a>
          <a onClick={() => handleNavClick('skills')}>Yetenekler</a>
          <a onClick={() => handleNavClick('projects')}>Projeler</a>
          <a onClick={() => handleNavClick('contact')}>İletişim</a>
        </nav>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header
