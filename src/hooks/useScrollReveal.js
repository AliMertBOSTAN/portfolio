import { useEffect, useRef } from 'react'

/**
 * Applies scroll-reveal animations to elements with .reveal, .reveal-left, or .reveal-right classes
 * inside the given container ref.
 */
function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const container = containerRef ? containerRef.current : document

    const elements = (container || document).querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    )

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useScrollReveal
