import React from 'react'
import { FaFileAlt, FaPenNib } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import './About.css'

function About() {
  const { t } = useLanguage()
  
  return (
    <section id="about" className="about">
      <h2 className="section-title">{t('aboutTitle')}</h2>
      <div className="about-content">
        <div className="about-text">
          <p className="about-paragraph">
            {t('aboutParagraph1')}
          </p>
          <p className="about-paragraph">
            {t('aboutParagraph2')}
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">4+</span>
              <span className="stat-label">{t('yearsExperience')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">{t('completedProjects')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
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
        <div className="about-image">
          <div className="photo-frame">
            <div className="photo-ring photo-ring-1" />
            <div className="photo-ring photo-ring-2" />
            <div className="photo-glow" />
            <img
              src="/image.png"
              alt="Ali Mert BOSTAN"
              className="profile-photo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
