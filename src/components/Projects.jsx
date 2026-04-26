import React, { useState, useRef, useEffect } from 'react'
import {
  FaChevronLeft, FaChevronRight,
  FaExternalLinkAlt, FaGithub,
  FaTh, FaList,
} from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import './Projects.css'

function Projects() {
  const { language, t } = useLanguage()
  const [active, setActive] = useState(0)
  const [viewMode, setViewMode] = useState('slider') // 'slider' | 'list'
  const touchStartX = useRef(null)
  const sliderRef = useRef(null)
  const wheelLockRef = useRef(false)
  const wheelAccumRef = useRef(0)

  const projects = [
    {
      id: 'tubitak',
      title: 'TÜBİTAK Projesi',
      tagline: language === 'tr' ? 'Poz Tahmini & Hareket Analizi' : 'Pose Estimation & Motion Analysis',
      description:
        language === 'tr'
          ? 'Mediapipe ve OpenCV kullanılarak gerçek zamanlı insan poz tahmini yapan TÜBİTAK destekli akademik araştırma projesi.'
          : 'TÜBİTAK-backed academic research project for real-time human pose estimation using Mediapipe and OpenCV.',
      technologies: ['Python', 'Mediapipe', 'OpenCV', 'NumPy'],
      category: language === 'tr' ? 'Yapay Zeka' : 'AI Research',
      accent: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(88,28,135,0.55), rgba(49,7,95,0.3))',
      orb: 'rgba(168,85,247,0.18)',
      demoLink: '#',
      githubLink: '#',
    },
    {
      id: 'ambient',
      title: 'Ambient Finance',
      tagline: language === 'tr' ? 'Merkezi Olmayan Finans' : 'Decentralized Finance',
      description:
        language === 'tr'
          ? 'Akıllı sözleşmeler ile güçlendirilmiş, şeffaf ve güvenli bir DeFi ekosistemi.'
          : 'Transparent and secure DeFi ecosystem powered by smart contracts and blockchain.',
      technologies: ['Solidity', 'React', 'Web3.js', 'JavaScript', 'CSS'],
      category: 'DeFi',
      accent: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(5,78,58,0.55), rgba(2,40,30,0.3))',
      orb: 'rgba(16,185,129,0.18)',
      demoLink: '#',
      githubLink: '#',
    },
    {
      id: 'embedr',
      title: 'Embedr Finance',
      tagline: language === 'tr' ? 'Sağlık Finansmanı Çözümleri' : 'Healthcare Finance Solutions',
      description:
        language === 'tr'
          ? 'Sağlık hizmetleri ödemelerini blokzincir teknolojisiyle şeffaflaştıran yenilikçi fintech platformu.'
          : 'Innovative fintech platform that transparentizes healthcare payments through blockchain technology.',
      technologies: ['React', 'TypeScript', 'Solidity', 'Node.js'],
      category: 'HealthTech',
      accent: '#0077ff',
      gradient: 'linear-gradient(135deg, rgba(0,40,100,0.55), rgba(0,12,40,0.3))',
      orb: 'rgba(0,119,255,0.18)',
      demoLink: '#',
      githubLink: '#',
    },
  ]

  const total = projects.length

  const go = (dir) => setActive(prev => (prev + dir + total) % total)

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  // Trackpad two-finger horizontal swipe → switch cards
  useEffect(() => {
    if (viewMode !== 'slider') return
    const el = sliderRef.current
    if (!el) return

    const THRESHOLD = 60          // px of accumulated horizontal scroll to trigger
    const COOLDOWN  = 450         // ms lock after a switch
    const RESET_MS  = 140         // idle ms before accumulator resets
    let resetTimer

    const onWheel = (e) => {
      // only react to dominantly horizontal gestures
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return

      e.preventDefault()
      if (wheelLockRef.current) return

      wheelAccumRef.current += e.deltaX
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { wheelAccumRef.current = 0 }, RESET_MS)

      if (Math.abs(wheelAccumRef.current) >= THRESHOLD) {
        const dir = wheelAccumRef.current > 0 ? 1 : -1
        go(dir)
        wheelAccumRef.current = 0
        wheelLockRef.current = true
        setTimeout(() => { wheelLockRef.current = false }, COOLDOWN)
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      clearTimeout(resetTimer)
    }
  }, [viewMode, total])

  const getPos = (i) => {
    if (i === active) return 'active'
    if (i === (active - 1 + total) % total) return 'prev'
    if (i === (active + 1) % total) return 'next'
    return 'hidden'
  }

  // Shared card content used in both views
  const CardContent = ({ p }) => (
    <>
      <div className="card-gradient" style={{ background: p.gradient }} />
      <div className="card-orb" />
      <div className="card-inner">
        <div className="card-header">
          <span className="card-category" style={{ color: p.accent, borderColor: `${p.accent}55` }}>
            {p.category}
          </span>
        </div>
        <h3 className="card-title">{p.title}</h3>
        <p className="card-tagline" style={{ color: p.accent }}>{p.tagline}</p>
        <p className="card-description">{p.description}</p>
        <div className="card-techs">
          {p.technologies.map((tech, ti) => (
            <span key={ti} className="card-tech" style={{ borderColor: `${p.accent}45`, color: p.accent }}>
              {tech}
            </span>
          ))}
        </div>
        <div className="card-links">
          <a href={p.demoLink} className="card-link" style={{ background: p.accent }}>
            <FaExternalLinkAlt /> Demo
          </a>
          <a href={p.githubLink} className="card-link outline" style={{ borderColor: `${p.accent}80`, color: p.accent }}>
            <FaGithub /> GitHub
          </a>
        </div>
      </div>
    </>
  )

  return (
    <section id="projects" className="projects">
      {/* Header row: title + view toggle */}
      <div className="projects-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>{t('projectsTitle')}</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn${viewMode === 'slider' ? ' active' : ''}`}
            onClick={() => setViewMode('slider')}
            title={language === 'tr' ? 'Slider görünümü' : 'Slider view'}
            aria-label="Slider view"
          >
            <FaTh />
          </button>
          <button
            className={`toggle-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            title={language === 'tr' ? 'Liste görünümü' : 'List view'}
            aria-label="List view"
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* ── SLIDER VIEW ── */}
      {viewMode === 'slider' && (
        <div className="slider-wrapper" ref={sliderRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="slider-viewport">
            {projects.map((p, i) => {
              const pos = getPos(i)
              return (
                <div
                  key={p.id}
                  className={`project-card ${pos}`}
                  style={{ '--accent': p.accent, '--orb': p.orb }}
                  onClick={() => pos !== 'active' && setActive(i)}
                  role={pos !== 'active' ? 'button' : undefined}
                  aria-label={pos !== 'active' ? p.title : undefined}
                >
                  <CardContent p={p} />
                </div>
              )
            })}
          </div>
          <div className="slider-controls">
            <button className="slider-arrow" onClick={() => go(-1)} aria-label="Previous project">
              <FaChevronLeft />
            </button>
            <div className="slider-dots">
              {projects.map((p, i) => (
                <button
                  key={i}
                  className={`dot ${i === active ? 'active' : ''}`}
                  style={{ '--dc': p.accent }}
                  onClick={() => setActive(i)}
                  aria-label={p.title}
                />
              ))}
            </div>
            <button className="slider-arrow" onClick={() => go(1)} aria-label="Next project">
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <div className="list-view">
          {projects.map((p) => (
            <div
              key={p.id}
              className="list-item"
              style={{ '--accent': p.accent, '--orb': p.orb }}
            >
              {/* Left accent bar */}
              <div className="list-bar" style={{ background: p.accent }} />

              {/* Category column */}
              <div className="list-icon-col">
                <span className="list-category" style={{ color: p.accent, borderColor: `${p.accent}55` }}>
                  {p.category}
                </span>
              </div>

              {/* Main content */}
              <div className="list-body">
                <h3 className="list-title">{p.title}</h3>
                <p className="list-tagline" style={{ color: p.accent }}>{p.tagline}</p>
                <p className="list-description">{p.description}</p>
                <div className="list-techs">
                  {p.technologies.map((tech, ti) => (
                    <span key={ti} className="card-tech" style={{ borderColor: `${p.accent}45`, color: p.accent }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="list-actions">
                <a href={p.demoLink} className="card-link" style={{ background: p.accent }}>
                  <FaExternalLinkAlt /> Demo
                </a>
                <a href={p.githubLink} className="card-link outline" style={{ borderColor: `${p.accent}80`, color: p.accent }}>
                  <FaGithub /> GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects
