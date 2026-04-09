import React, { useRef } from 'react'
import { FaFileAlt, FaPenNib, FaUser } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import './About.css'

function About() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, [])
  
  return (
    <section id="about" className="about" ref={sectionRef}>
      <h2 className="section-title reveal">{t('aboutTitle')}</h2>
      <div className="about-content">
        <div className="about-text reveal-left">
          <p className="about-paragraph">
            {t('aboutParagraph1')}
          </p>
          <p className="about-paragraph">
            {t('aboutParagraph2')}
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">{t('yearsExperience')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">{t('completedProjects')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">20+</span>
              <span className="stat-label">{t('connections')}</span>
            </div>
          </div>
          
          <div className="about-actions">
            <a href="/AliMertBOSTAN_Resume.pdf" target="_blank" rel="noopener noreferrer" className="about-btn">
              <FaFileAlt /> {t('downloadCV')}
            </a>
            <a href="https://medium.com/@BOSTANmert" target="_blank" rel="noopener noreferrer" className="about-btn about-btn-outline">
              <FaPenNib /> {t('medium')}
            </a>
          </div>
        </div>
        <div className="about-image reveal-right">
          <div className="profile-card">
            <div className="profile-avatar">
              <FaUser className="avatar-icon" />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">Ali Mert BOSTAN</h3>
              <p className="profile-role">Full Stack &amp; Blockchain Developer</p>
              <div className="profile-tags">
                <span className="profile-tag">Web3</span>
                <span className="profile-tag">DeFi</span>
                <span className="profile-tag">React</span>
                <span className="profile-tag">Solidity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
