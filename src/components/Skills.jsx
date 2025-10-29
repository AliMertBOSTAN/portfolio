import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Skills.css'

function Skills() {
  const { t } = useLanguage()
  const skills = [
    { name: 'React', level: 85 },
    { name: 'JavaScript', level: 85 },
    { name: 'Solidity', level: 90 },
    { name: 'Rust', level: 55 },
    { name: 'Node.js', level: 80 },
    { name: 'HTML/CSS', level: 95 },
    { name: 'TypeScript', level: 75 },
    { name: 'MongoDB', level: 70 },
    { name: 'Git', level: 85 },
    { name: 'Python', level: 65 },

  ]

  return (
    <section id="skills" className="skills">
      <h2 className="section-title">{t('skillsTitle')}</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <div className="skill-header">
              <h3 className="skill-name">{skill.name}</h3>
              <span className="skill-percentage">{skill.level}%</span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-progress" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
