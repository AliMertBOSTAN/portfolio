import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Footer.css'

function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">{t('footerTitle')}</h3>
          <p className="footer-description">
            {t('footerDescription')}
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">{t('quickLinks')}</h4>
          <ul className="footer-links">
            <li><a href="#home">{t('home')}</a></li>
            <li><a href="#about">{t('about')}</a></li>
            <li><a href="#skills">{t('skills')}</a></li>
            <li><a href="#projects">{t('projects')}</a></li>
            <li><a href="#contact">{t('contact')}</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">{t('social')}</h4>
          <div className="social-links">
            <a href="https://github.com/AliMertBOSTAN" target="_blank" rel="noopener noreferrer" className="social-link">{t('github')}</a>
            <a href="https://www.linkedin.com/in/ali-mert-bostan/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
            <a href="https://medium.com/@BOSTANmert" target="_blank" rel="noopener noreferrer" className="social-link">📝 {t('medium')}</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} {t('footerTitle')}. {t('footerCopyright')}</p>
      </div>
    </footer>
  )
}

export default Footer
