import React, { useState, useEffect, useRef } from 'react'
import { FaFileAlt, FaGithub, FaLinkedin, FaArrowDown } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import './Hero.css'

const TYPING_TITLES = [
  'Full Stack Developer',
  'Blockchain Engineer',
  'Web3 Builder',
  'Smart Contract Dev',
]

function useTypewriter(words, typingSpeed = 100, deletingSpeed = 60, pauseMs = 2000) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const current = words[wordIndex]
    let timer

    if (!isDeleting && charIndex < current.length) {
      timer = setTimeout(() => {
        setDisplayed(current.substring(0, charIndex + 1))
        setCharIndex((c) => c + 1)
      }, typingSpeed)
    } else if (!isDeleting && charIndex === current.length) {
      timer = setTimeout(() => setIsDeleting(true), pauseMs)
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setDisplayed(current.substring(0, charIndex - 1))
        setCharIndex((c) => c - 1)
      }, deletingSpeed)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs])

  return displayed
}

function Hero() {
  const { t } = useLanguage()
  const typedTitle = useTypewriter(TYPING_TITLES)
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, [])

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="hero-content">
        <div className="hero-text reveal">
          <span className="hero-greeting">{t('greeting')}</span>
          <h1 className="hero-name">Ali Mert BOSTAN</h1>
          <p className="hero-title">
            <span className="typed-text">{typedTitle}</span>
            <span className="cursor" aria-hidden="true">|</span>
          </p>
          <p className="hero-description">
            {t('description')}
          </p>
          <div className="hero-social">
            <a
              href="https://github.com/AliMertBOSTAN"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/ali-mert-bostan/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">{t('viewProjects')}</a>
            <a href="#contact" className="btn btn-secondary">{t('contactMe')}</a>
            <a href="/AliMertBOSTAN_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-resume">
              <FaFileAlt /> {t('downloadCV')}
            </a>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2">
          <div className="glowing-circle"></div>
          <div className="code-snippet">
            <div className="code-window-bar">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
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
              <span className="code-string">'React'</span>,{' '}
              <span className="code-string">'Node'</span>,{' '}
              <span className="code-string">'Solidity'</span>,{' '}
              <span className="code-string">'Rust'</span>
              <span className="code-bracket">]</span>,
            </div>
            <div className="code-line indent">
              <span className="code-property">passion</span>:{' '}
              <span className="code-string">'Building Web3'</span>
            </div>
            <div className="code-line">{'}'}</div>
          </div>
        </div>
      </div>
      <a href="#about" className="scroll-hint" aria-label="Scroll down">
        <FaArrowDown />
      </a>
    </section>
  )
}

export default Hero
