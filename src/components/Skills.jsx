import React, { useEffect, useRef } from 'react'
import anime from 'animejs/lib/anime.es.js'
import { useLanguage } from '../contexts/LanguageContext'
import './Skills.css'

function Skills() {
  const { language } = useLanguage()

  const sectionRef  = useRef(null)
  const slotsRef    = useRef([])
  const dotsRef     = useRef([])
  const counterRef  = useRef(null)
  const nameTagRef  = useRef(null)
  const ghostRef    = useRef(null)

  const all      = language === 'tr' ? 'Tüm projeler' : 'All projects'
  const personal = language === 'tr' ? 'Kişisel' : 'Personal'

  const skills = [
    {
      name: 'React', level: 85, cat: 'Frontend',
      desc: language === 'tr'
        ? 'Bileşen tabanlı modern arayüz geliştirme; durum, hook ve render mimarisinde rahatça çalışıyorum.'
        : 'Component-based modern UI development; comfortable with state, hooks, and rendering architecture.',
      used: ['Embedr', 'Ambient', 'Portfolio'],
    },
    {
      name: 'JavaScript', level: 85, cat: 'Language',
      desc: language === 'tr'
        ? 'ES2020+ özellikleri, asenkron akış ve fonksiyonel desenlerle akıcı şekilde kod yazıyorum.'
        : 'Fluent in ES2020+, async flows and functional patterns across the stack.',
      used: [all],
    },
    {
      name: 'Solidity', level: 90, cat: 'Web3',
      desc: language === 'tr'
        ? 'Güvenli akıllı sözleşmeler — token, vault, AMM ve özel mantık üzerine üretim deneyimi.'
        : 'Secure smart contracts — tokens, vaults, AMMs and custom logic with production experience.',
      used: ['Embedr', 'Ambient'],
    },
    {
      name: 'Rust', level: 55, cat: 'Systems',
      desc: language === 'tr'
        ? 'Yüksek performanslı sistem programlama; ownership ve concurrency üzerinde çalışıyorum.'
        : 'High-performance systems programming; building on ownership and concurrency models.',
      used: [personal],
    },
    {
      name: 'Node.js', level: 80, cat: 'Backend',
      desc: language === 'tr'
        ? 'REST/GraphQL API tasarımı, kimlik doğrulama, gerçek zamanlı socket katmanları.'
        : 'REST/GraphQL APIs, auth, real-time socket layers.',
      used: ['Embedr'],
    },
    {
      name: 'HTML / CSS', level: 95, cat: 'Frontend',
      desc: language === 'tr'
        ? 'Semantik yapı, modern düzen sistemleri (grid, flex), animasyon ve erişilebilirlik.'
        : 'Semantic markup, modern layout systems (grid, flex), animation and accessibility.',
      used: [all],
    },
    {
      name: 'TypeScript', level: 75, cat: 'Language',
      desc: language === 'tr'
        ? 'Tip güvenliğiyle ölçeklenebilir kod — generics, discriminated unions, strict configs.'
        : 'Scalable type-safe code — generics, discriminated unions, strict configs.',
      used: ['Embedr'],
    },
    {
      name: 'MongoDB', level: 70, cat: 'Database',
      desc: language === 'tr'
        ? 'Doküman tabanlı NoSQL — şema tasarımı, agregasyon pipeline ve indeksleme.'
        : 'Document-based NoSQL — schema design, aggregation pipelines and indexing.',
      used: ['Embedr'],
    },
    {
      name: 'Git', level: 85, cat: 'Workflow',
      desc: language === 'tr'
        ? 'Branch stratejileri, rebase, code review ve CI ile uyumlu temiz commit akışı.'
        : 'Branch strategies, rebase, code review, and CI-friendly clean commit flow.',
      used: [all],
    },
    {
      name: 'Python', level: 65, cat: 'Data / AI',
      desc: language === 'tr'
        ? 'Veri işleme, betikleme ve TÜBİTAK kapsamında bilgisayarlı görü araçlarıyla deneyim.'
        : 'Data processing, scripting and computer-vision tooling within the TÜBİTAK project.',
      used: ['TÜBİTAK'],
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    const slots   = slotsRef.current.filter(Boolean)
    const dots    = dotsRef.current.filter(Boolean)
    if (!section || slots.length === 0) return

    const N = slots.length
    const TOTAL = 1000
    const SLOT  = TOTAL / N

    // rank = current_slot - skill_index
    //   < 0 → below (not yet)
    //   = 0 → active (centered)
    //   > 0 → above (passed)
    const pos = (rank) => {
      if (rank < 0)  return { y:  70, op: 0 }
      if (rank === 0) return { y:   0, op: 1 }
      return                  { y: -70, op: 0 }
    }

    const tl = anime.timeline({
      autoplay: false,
      duration: TOTAL,
      easing: 'easeInOutQuart',
    })

    slots.forEach((el, i) => {
      const init = pos(0 - i)
      const yKF = [{ value: init.y,  duration: 0 }]
      const oKF = [{ value: init.op, duration: 0 }]

      for (let k = 1; k <= N; k++) {
        const next = pos(k - i)
        yKF.push({ value: next.y,  duration: SLOT })
        oKF.push({ value: next.op, duration: SLOT })
      }

      tl.add({
        targets: el,
        translateY: yKF,
        opacity: oKF,
      }, 0)
    })

    let raf = 0
    let lastP = -1
    let lastIdx = -1
    const update = () => {
      const rect  = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const p = total > 0
        ? Math.min(1, Math.max(0, -rect.top / total))
        : 0

      if (Math.abs(p - lastP) >= 0.0008) {
        lastP = p
        tl.seek(p * tl.duration)
      }

      const idx = Math.min(N - 1, Math.max(0, Math.floor(p * N + 0.0001)))
      if (idx !== lastIdx) {
        lastIdx = idx
        if (counterRef.current) {
          counterRef.current.textContent = String(idx + 1).padStart(2, '0')
        }
        if (nameTagRef.current) {
          nameTagRef.current.textContent = skills[idx].cat.toUpperCase()
        }
        if (ghostRef.current) {
          ghostRef.current.textContent = skills[idx].name
        }
        dots.forEach((d, j) => d.classList.toggle('active', j <= idx))
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      tl.pause()
    }
  }, [language])

  return (
    <section id="skills" ref={sectionRef} className="skills">
      <div className="sk-stage">
        {/* Background ghost name */}
        <div className="sk-ghost" ref={ghostRef} aria-hidden="true">
          {skills[0].name}
        </div>

        {/* Top bar */}
        <div className="sk-top">
          <div className="sk-top-l">
            <span className="sk-eyebrow">
              {language === 'tr' ? 'Yetenekler' : 'Skills'}
            </span>
            <span className="sk-tag" ref={nameTagRef}>
              {skills[0].cat.toUpperCase()}
            </span>
          </div>
          <div className="sk-top-r">
            <span className="sk-counter" ref={counterRef}>01</span>
            <span className="sk-slash">/</span>
            <span>{String(skills.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Skill panels */}
        <div className="sk-stack">
          {skills.map((s, i) => (
            <div
              key={s.name}
              ref={el => (slotsRef.current[i] = el)}
              className="sk-slot"
            >
              <div className="sk-left">
                <span className="sk-num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sk-name">{s.name}</h3>
                <div className="sk-level">
                  <span className="sk-pct">{s.level}<i>%</i></span>
                  <div className="sk-bar"><i style={{ width: `${s.level}%` }} /></div>
                </div>
              </div>

              <div className="sk-right">
                <p className="sk-desc">{s.desc}</p>
                <div className="sk-used">
                  <span className="sk-used-label">
                    {language === 'tr' ? 'Kullanım' : 'Used in'}
                  </span>
                  <div className="sk-chips">
                    {s.used.map(u => (
                      <span key={u} className="sk-chip">{u}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom progress dots */}
        <div className="sk-bottom">
          <div className="sk-dots">
            {skills.map((s, i) => (
              <span
                key={s.name}
                ref={el => (dotsRef.current[i] = el)}
                className={`sk-dot${i === 0 ? ' active' : ''}`}
              />
            ))}
          </div>
          <span className="sk-hint">
            {language === 'tr' ? 'kaydır' : 'scroll'} ▼
          </span>
        </div>
      </div>
    </section>
  )
}

export default Skills
