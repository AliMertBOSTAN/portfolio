import { useEffect } from 'react'

/**
 * Applies scroll-reveal animations to elements with .reveal, .reveal-left, or .reveal-right classes
 * inside the given container ref.
 *
 * @param {React.RefObject} containerRef - Ref to the container element to observe within
 * @param {Array} deps - Additional deps that should re-trigger the effect (e.g., when content changes)
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
  // containerRef.current is intentionally omitted — the ref object is stable;
  // callers pass explicit deps when content that could add new .reveal elements changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps])
}

export default useScrollReveal
