import React from 'react'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Portfolio</h3>
          <p className="footer-description">
            Modern ve yenilikçi web çözümleri geliştiriyorum.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Hızlı Linkler</h4>
          <ul className="footer-links">
            <li><a href="#home">Ana Sayfa</a></li>
            <li><a href="#about">Hakkımda</a></li>
            <li><a href="#skills">Yetenekler</a></li>
            <li><a href="#projects">Projeler</a></li>
            <li><a href="#contact">İletişim</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Sosyal Medya & Blog</h4>
          <div className="social-links">
            <a href="https://github.com/AliMertBOSTAN" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
            <a href="https://www.linkedin.com/in/ali-mert-bostan/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
            <a href="https://medium.com/@BOSTANmert" target="_blank" rel="noopener noreferrer" className="social-link">📝 Medium Blog</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Portfolio. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  )
}

export default Footer
