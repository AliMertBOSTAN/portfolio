import React, { useState, useEffect } from 'react'
import './Header.css'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <span className="logo-text">Portfolio</span>
        </div>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#home" onClick={handleNavClick}>Ana Sayfa</a>
          <a href="#about" onClick={handleNavClick}>Hakkımda</a>
          <a href="#skills" onClick={handleNavClick}>Yetenekler</a>
          <a href="#projects" onClick={handleNavClick}>Projeler</a>
          <a href="#contact" onClick={handleNavClick}>İletişim</a>
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
