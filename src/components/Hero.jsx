import React, { useEffect, useRef, useState } from 'react'
import { FaFileAlt } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import './Hero.css'

function Hero() {
  const { t, language } = useLanguage()
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const heroRef  = useRef(null)

  // ── Typewriter effect ──────────────────────────────────────
  const [displayTitle, setDisplayTitle] = useState('')

  useEffect(() => {
    const titles = language === 'tr'
      ? [
          'Full Stack Developer',
          'Blockchain Developer',
          'Frontend Engineer',
          'Akıllı Sözleşme Uzmanı',
          'Web3 Geliştirici',
        ]
      : [
          'Full Stack Developer',
          'Blockchain Developer',
          'Frontend Engineer',
          'Smart Contract Expert',
          'Web3 Developer',
        ]

    let titleIdx  = 0
    let charIdx   = 0
    let deleting  = false
    let timeoutId

    const tick = () => {
      const current = titles[titleIdx]

      if (!deleting) {
        charIdx++
        setDisplayTitle(current.slice(0, charIdx))

        if (charIdx === current.length) {
          // Pause at full word, then start deleting
          timeoutId = setTimeout(() => { deleting = true; tick() }, 1800)
        } else {
          timeoutId = setTimeout(tick, 72 + Math.random() * 28)
        }
      } else {
        charIdx--
        setDisplayTitle(current.slice(0, charIdx))

        if (charIdx === 0) {
          deleting   = false
          titleIdx   = (titleIdx + 1) % titles.length
          timeoutId  = setTimeout(tick, 380)
        } else {
          timeoutId = setTimeout(tick, 38)
        }
      }
    }

    timeoutId = setTimeout(tick, 400)
    return () => clearTimeout(timeoutId)
  }, [language])

  useEffect(() => {
    const canvas = canvasRef.current
    const hero   = heroRef.current
    if (!canvas || !hero) return

    const ctx     = canvas.getContext('2d')
    const mobile  = window.innerWidth < 768
    const COUNT   = mobile ? 40 : 80
    const REPEL_R = mobile ? 80 : 115   // repulsion radius px
    const CONN_D  = mobile ? 90 : 130   // connection draw distance

    // ── Resize ──────────────────────────────────────────────
    const resize = () => {
      canvas.width  = hero.offsetWidth
      canvas.height = hero.offsetHeight
    }
    resize()

    // ── Persistent particles ─────────────────────────────────
    const pts = Array.from({ length: COUNT }, () => {
      const bvx = (Math.random() - 0.5) * 0.45
      const bvy = (Math.random() - 0.5) * 0.45
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: bvx, vy: bvy,
        bvx, bvy,                         // base (resting) velocity
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.18,
      }
    })

    // ── Burst particles (click) ──────────────────────────────
    const bursts = []

    // ── Mouse position (canvas-relative) ────────────────────
    const mouse = { x: -9999, y: -9999 }

    // ── Event handlers ───────────────────────────────────────
    const onMove = (e) => {
      const r = hero.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      hero.style.setProperty('--mx', `${mouse.x}px`)
      hero.style.setProperty('--my', `${mouse.y}px`)
      hero.classList.add('spotlit')
    }

    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      hero.classList.remove('spotlit')
    }

    const onClick = (e) => {
      const r  = hero.getBoundingClientRect()
      const cx = e.clientX - r.left
      const cy = e.clientY - r.top
      const N  = 14
      for (let i = 0; i < N; i++) {
        const ang   = (Math.PI * 2 / N) * i + (Math.random() - 0.5) * 0.7
        const spd   = Math.random() * 3.5 + 1.5
        bursts.push({
          x: cx, y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          r: Math.random() * 2.2 + 1,
          life: 1.0,
          decay: 0.020 + Math.random() * 0.012,
        })
      }
    }

    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    hero.addEventListener('click', onClick)

    // ── Animation loop ────────────────────────────────────────
    let animId

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dark = document.body.classList.contains('dark-theme')
      const c    = dark ? '0,119,255' : '0,86,179'

      // — Connections between persistent particles —
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < CONN_D) {
            ctx.strokeStyle = `rgba(${c},${(0.22 * (1 - d / CONN_D)).toFixed(3)})`
            ctx.lineWidth   = 0.55
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // — Persistent particles (with mouse repulsion) —
      pts.forEach(p => {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy

        if (d2 < REPEL_R * REPEL_R && d2 > 0) {
          const d = Math.sqrt(d2)
          const f = ((REPEL_R - d) / REPEL_R) * 0.55
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }

        // Gradually drift back to base velocity
        p.vx = p.vx * 0.94 + p.bvx * 0.06
        p.vy = p.vy * 0.94 + p.bvy * 0.06

        p.x += p.vx
        p.y += p.vy

        // Bounce walls; also flip base velocity so particle doesn't get stuck
        if (p.x < 0 || p.x > canvas.width)  { p.vx  *= -1; p.bvx *= -1 }
        if (p.y < 0 || p.y > canvas.height) { p.vy  *= -1; p.bvy *= -1 }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},${p.a})`
        ctx.fill()
      })

      // — Burst particles (click trail) —
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.life -= b.decay
        if (b.life <= 0) { bursts.splice(i, 1); continue }

        b.vx *= 0.95
        b.vy *= 0.95
        b.x  += b.vx
        b.y  += b.vy

        const alpha = b.life * 0.9

        // Glow halo
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * b.life * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},${alpha * 0.1})`
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * Math.max(0.15, b.life), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      hero.removeEventListener('click', onClick)
    }
  }, [theme])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />
      <div className="hero-spotlight"         aria-hidden="true" />
      <div className="hero-spotlight-text"    aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-greeting">{t('greeting')}</span>
          <h1 className="hero-name">Ali Mert BOSTAN</h1>
          <p className="hero-title">
            <span className="typed-text">{displayTitle}</span>
            <span className="type-cursor" aria-hidden="true">|</span>
          </p>
          <p className="hero-description">{t('description')}</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">{t('viewProjects')}</a>
            <a href="#contact"  className="btn btn-secondary">{t('contactMe')}</a>
            <a href="/AliMertBOSTAN_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-resume">
              <FaFileAlt /> {t('downloadCV')}
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glowing-circle" />
          <div className="glowing-ring" />
          <div className="code-snippet">
            <div className="code-line">
              <span className="code-keyword">const</span>{' '}
              <span className="code-variable">developer</span> = {'{'}
            </div>
            <div className="code-line indent">
              <span className="code-property">name</span>:{' '}
              <span className="code-string">'Ali Mert BOSTAN'</span>,
            </div>
            <div className="code-line indent">
              <span className="code-property">skills</span>:{' '}
              <span className="code-bracket">[</span>
              <span className="code-string">'React'</span>
              <span className="code-punct">, </span>
              <span className="code-string">'Node'</span>
              <span className="code-punct">, </span>
              <span className="code-string">'Solidity'</span>
              <span className="code-punct">, </span>
              <span className="code-string">'Rust'</span>
              <span className="code-bracket">]</span>,
            </div>
            <div className="code-line indent">
              <span className="code-property">passion</span>:{' '}
              <span className="code-string">'Building the Future'</span>
            </div>
            <div className="code-line">{'}'}</div>
            <span className="code-cursor" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
