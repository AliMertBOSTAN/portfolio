import React, { useRef } from 'react'
import {
  FaReact, FaNodeJs, FaPython, FaGitAlt, FaHtml5, FaCss3Alt, FaDatabase,
} from 'react-icons/fa'
import {
  SiTypescript, SiJavascript, SiSolidity, SiRust, SiMongodb, SiDocker,
  SiEthereum, SiWebpack,
} from 'react-icons/si'
import { useLanguage } from '../contexts/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import './Skills.css'

const skillCategories = [
  {
    key: 'frontend',
    color: '#0077ff',
    skills: [
      { name: 'React',       icon: FaReact },
      { name: 'TypeScript',  icon: SiTypescript },
      { name: 'JavaScript',  icon: SiJavascript },
      { name: 'HTML5',       icon: FaHtml5 },
      { name: 'CSS3',        icon: FaCss3Alt },
    ],
  },
  {
    key: 'backend',
    color: '#00b894',
    skills: [
      { name: 'Node.js',  icon: FaNodeJs },
      { name: 'Python',   icon: FaPython },
      { name: 'MongoDB',  icon: SiMongodb },
      { name: 'Docker',   icon: SiDocker },
    ],
  },
  {
    key: 'blockchain',
    color: '#a855f7',
    skills: [
      { name: 'Solidity',  icon: SiSolidity },
      { name: 'Rust',      icon: SiRust },
      { name: 'Ethereum',  icon: SiEthereum },
    ],
  },
  {
    key: 'tools',
    color: '#f59e0b',
    skills: [
      { name: 'Git',      icon: FaGitAlt },
      { name: 'Webpack',  icon: SiWebpack },
      { name: 'SQL',      icon: FaDatabase },
    ],
  },
]

const categoryLabels = {
  tr: {
    frontend:   'Frontend',
    backend:    'Backend',
    blockchain: 'Blockchain',
    tools:      'Araçlar',
  },
  en: {
    frontend:   'Frontend',
    backend:    'Backend',
    blockchain: 'Blockchain',
    tools:      'Tools',
  },
}

function Skills() {
  const { t, language } = useLanguage()
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, [])
  const labels = categoryLabels[language] || categoryLabels.en

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <h2 className="section-title reveal">{t('skillsTitle')}</h2>
      <div className="skills-categories">
        {skillCategories.map((cat, catIdx) => (
          <div
            key={cat.key}
            className={`skill-category reveal reveal-delay-${catIdx + 1}`}
            style={{ '--cat-color': cat.color }}
          >
            <h3 className="category-title">{labels[cat.key]}</h3>
            <div className="category-skills">
              {cat.skills.map((skill) => {
                const Icon = skill.icon
                return (
                  <div key={skill.name} className="skill-badge">
                    <Icon className="skill-badge-icon" />
                    <span>{skill.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
