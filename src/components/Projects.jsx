import React from 'react'
import './Projects.css'

function Projects() {
  const projects = [
    {
      title: 'Tubitak Projesi',
      description: 'Pose Estimation yapılan bir proje.',
      technologies: ['Python', 'Mediapipe', 'OpenCV'],
      image: '🚀',
    },
    {
      title: 'Ambient Finance',
      description: 'Bir DeFi platformu projesi.',
      technologies: ['JavaScript', 'HTML', 'CSS', 'React'],
      image: '💻',
    },
  ]

  return (
    <section id="projects" className="projects">
      <h2 className="section-title">Projeler</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-image">
              <span className="project-emoji">{project.image}</span>
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
        ))}
      </div>
    </section>
  )
}

export default Projects
