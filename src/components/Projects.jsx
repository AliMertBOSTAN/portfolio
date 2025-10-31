import React from 'react'
import { FaRocket, FaLaptopCode } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import './Projects.css'

function Projects() {
  const { t } = useLanguage()
  const projects = [
    {
      title: 'Tubitak Projesi',
      description: 'Pose Estimation yapılan bir proje.',
      technologies: ['Python', 'Mediapipe', 'OpenCV'],
      icon: FaRocket,
    },
    {
      title: 'Ambient Finance',
      description: 'Bir DeFi platformu projesi.',
      technologies: ['JavaScript', 'HTML', 'CSS', 'React'],
      icon: FaLaptopCode,
    },
  ]

  return (
    <section id="projects" className="projects">
      <h2 className="section-title">{t('projectsTitle')}</h2>
      <div className="projects-grid">
        {projects.map((project, index) => {
          const IconComponent = project.icon
          return (
            <div key={index} className="project-card">
              <div className="project-image">
                <IconComponent className="project-icon" style={{ fontSize: '3rem' }} />
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">Demo</a>
                  <a href="#" className="project-link">GitHub</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Projects
