import React, { useRef } from 'react'
import { FaRocket, FaLaptopCode, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import './Projects.css'

function Projects() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, [])

  const projects = [
    {
      title: 'Tubitak Projesi',
      description: 'Python, Mediapipe ve OpenCV kullanarak gerçek zamanlı poz tespiti (Pose Estimation) gerçekleştiren akademik bir proje. Hareket analizi ve insan vücudu landmark tespiti üzerine odaklanmaktadır.',
      technologies: ['Python', 'Mediapipe', 'OpenCV'],
      icon: FaRocket,
      demo: '#',
      github: '#',
    },
    {
      title: 'Ambient Finance',
      description: 'React ve modern web teknolojileri ile geliştirilmiş, merkeziyetsiz finans (DeFi) alanında kullanıcı dostu bir platform. Gerçek zamanlı veri görselleştirme ve akıllı kontrat entegrasyonu içermektedir.',
      technologies: ['JavaScript', 'HTML', 'CSS', 'React'],
      icon: FaLaptopCode,
      demo: '#',
      github: '#',
    },
  ]

  return (
    <section id="projects" className="projects" ref={sectionRef}>
      <h2 className="section-title reveal">{t('projectsTitle')}</h2>
      <div className="projects-grid">
        {projects.map((project, index) => {
          const IconComponent = project.icon
          return (
            <div key={index} className={`project-card reveal reveal-delay-${index + 1}`}>
              <div className="project-image">
                <IconComponent className="project-icon" />
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
                  <a href={project.demo} className="project-link project-link-demo">
                    <FaExternalLinkAlt /> Demo
                  </a>
                  <a href={project.github} className="project-link project-link-github">
                    <FaGithub /> GitHub
                  </a>
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
