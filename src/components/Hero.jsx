import React from 'react'
import { FaFileAlt } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import './Hero.css'

function Hero() {
  const { t } = useLanguage()
  
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-greeting">{t('greeting')}</span>
          <h1 className="hero-name">Ali Mert BOSTAN</h1>
          <p className="hero-title">{t('title')}</p>
          <p className="hero-description">
            {t('description')}
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">{t('viewProjects')}</a>
            <a href="#contact" className="btn btn-secondary">{t('contactMe')}</a>
            <a href="/CV-Ali-Mert-BOSTAN.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-resume">
              <FaFileAlt /> {t('downloadCV')}
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glowing-circle"></div>
          <div className="code-snippet">
            <div className="code-line">
              <span className="code-keyword">const</span>{' '}
              <span className="code-variable">developer</span> = {'{'}
            </div>
            <div className="code-line indent">
              <span className="code-property">name</span>: 
              <span className="code-string">'Ali Mert BOSTAN'</span>,
            </div>
            <div className="code-line indent">
              <span className="code-property">skills</span>: 
              <span className="code-bracket">[</span>
              <span className="code-string">'React'</span>,
              <span className="code-string">'Node'</span>,
              <span className="code-string">'Solidity'</span>,
              <span className="code-string">'Rust'</span>
              <span className="code-bracket">]</span>,
            </div>
            <div className="code-line indent">
              <span className="code-property">passion</span>: 
              <span className="code-string">'Coding'</span>
            </div>
            <div className="code-line">{'}'}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
