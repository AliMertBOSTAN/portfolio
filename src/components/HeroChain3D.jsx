import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import './HeroChain3D.css'

const SLOTS       = 8      // positions around the ring; one is always the gap for the next block
const RADIUS      = 2.5
const FIRST_BLOCK = 18204
const MINT_DELAY  = 0.26   // s — lets the typed title collapse before the block appears
const FLIGHT_TIME = 1.35   // s

const PALETTES = {
  dark: {
    shell: '#0d3a78', emissive: '#021634', shellOpacity: 0.38,
    edge: '#4da3ff', edgeHot: '#dff0ff',
    core: '#3d95ff', link: '#2a7fff', pulse: '#cfe6ff',
    additive: true,
    ambient: '#88b8ff', key: '#5aa9ff', rim: '#0050ff',
  },
  light: {
    shell: '#cfe3ff', emissive: '#000000', shellOpacity: 0.45,
    edge: '#0066cc', edgeHot: '#003d82',
    core: '#0066cc', link: '#3d85d6', pulse: '#0055b3',
    additive: false,
    ambient: '#ffffff', key: '#8fc2ff', rim: '#4d8fe0',
  },
}

const SLOT_POS = Array.from({ length: SLOTS }, (_, k) => {
  const a = (k / SLOTS) * Math.PI * 2
  return new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a * 2) * 0.3, Math.sin(a) * RADIUS)
})

const lerp = (a, b, t) => a + (b - a) * t
const easeInOutCubic = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)

// Deterministic fake hash per block number, so a block keeps its hash
const hashFor = (num) => {
  let h = (num * 2654435761) >>> 0
  const nibble = () => (h = (h * 1664525 + 1013904223) >>> 0) >>> 28
  const hex = n => Array.from({ length: n }, () => nibble().toString(16)).join('')
  return `0x${hex(6)}…${hex(4)}`
}

// Where a block flies when the hero scrolls away: outward from its slot and toward the camera
const scatterFor = (slot) => {
  const a = (slot / SLOTS) * Math.PI * 2
  return new THREE.Vector3(
    Math.cos(a) + (Math.random() - 0.5) * 0.6,
    (Math.random() - 0.5) * 1.2,
    Math.sin(a) + 0.8,
  ).normalize().multiplyScalar(5 + Math.random() * 3)
}

// ── Build the chain once (imperative three.js objects) ─────
function buildChain() {
  const root = new THREE.Group()   // positioned over .hero-visual
  const tilt = new THREE.Group()
  const ring = new THREE.Group()
  const fly  = new THREE.Group()   // world-space parent for blocks in flight
  root.add(tilt)
  tilt.add(ring)
  tilt.rotation.x = 0.32

  const boxGeo   = new THREE.BoxGeometry(0.95, 0.95, 0.95)
  const edgeGeo  = new THREE.EdgesGeometry(boxGeo)
  const coreGeo  = new THREE.OctahedronGeometry(0.26)
  const pulseGeo = new THREE.SphereGeometry(0.06, 12, 12)
  const linkMaterials = []

  const makeBlock = (num, titleIdx, slot) => {
    const g = new THREE.Group()
    const shell = new THREE.Mesh(boxGeo, new THREE.MeshPhysicalMaterial({
      metalness: 0.1, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1,
      transparent: true, depthWrite: false,
    }))
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 }))
    const core  = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, depthWrite: false }))
    g.add(shell, edges, core)
    g.userData = {
      h: 0, flash: 0, life: 1, size: 1, drop: 0,
      spin: 0.6 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      tumble: (Math.random() - 0.5) * 6,
      slot, scatter: scatterFor(slot),
      num, titleIdx,
      shell, edges, core,
    }
    return g
  }

  const disposeBlock = (g) => {
    const u = g.userData
    u.shell.material.dispose(); u.edges.material.dispose(); u.core.material.dispose()
  }

  // Start with SLOTS - 1 blocks; the last slot is the gap the next minted block fills
  const blocks = []
  for (let k = 0; k < SLOTS - 1; k++) {
    const g = makeBlock(FIRST_BLOCK + k, k, k)
    g.position.copy(SLOT_POS[k])
    ring.add(g)
    blocks.push(g)
  }

  // Links between consecutive blocks (oldest → newest)
  const links  = []
  const pulses = []
  for (let i = 0; i < SLOTS - 1; i++) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    const lineMat  = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 })
    const pulseMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false })
    linkMaterials.push(lineMat, pulseMat)
    const line  = new THREE.Line(geo, lineMat)
    const pulse = new THREE.Mesh(pulseGeo, pulseMat)
    ring.add(line, pulse)
    links.push(line)
    pulses.push(pulse)
  }

  const state = {
    root, tilt, ring, fly, links, pulses,
    blocks,               // in chain order, oldest first
    dying: [],
    flights: [],
    gap: SLOTS - 1,
    reserved: null,       // slot claimed by a block in flight
    nextNum: FIRST_BLOCK + SLOTS - 1,
    makeBlock, disposeBlock,
    dispose() {
      ;[...blocks, ...state.dying, ...state.flights.map(f => f.g)].forEach(disposeBlock)
      boxGeo.dispose(); edgeGeo.dispose(); coreGeo.dispose(); pulseGeo.dispose()
      links.forEach(l => l.geometry.dispose())
      linkMaterials.forEach(m => m.dispose())
    },
  }
  return state
}

function Chain({ palette, labels, titles, tipRef, landRef, pointer, scroll, pending, speed, scatterScale }) {
  const { camera, size, gl } = useThree()
  const chain     = useMemo(buildChain, [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const ndc       = useMemo(() => new THREE.Vector2(), [])
  const tmp       = useMemo(() => new THREE.Vector3(), [])
  const target    = useMemo(() => new THREE.Vector3(), [])
  const ctrl      = useMemo(() => new THREE.Vector3(), [])
  const p1        = useMemo(() => new THREE.Vector3(), [])
  const p2        = useMemo(() => new THREE.Vector3(), [])
  const edgeIdle  = useMemo(() => new THREE.Color(palette.edge), [palette])
  const edgeHot   = useMemo(() => new THREE.Color(palette.edgeHot), [palette])
  const time      = useRef(0)
  const hovered   = useRef(-1)
  const spread    = useRef(0)

  useEffect(() => () => chain.dispose(), [chain])

  // ── Theme colors (applied to every block, including newly minted ones) ──
  const paintBlock = (g) => {
    const u = g.userData
    const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    u.shell.material.color.set(palette.shell)
    u.shell.material.emissive.set(palette.emissive)
    u.core.material.color.set(palette.core)
    if (u.core.material.blending !== blending) {
      u.core.material.blending = blending
      u.core.material.needsUpdate = true
    }
  }

  useEffect(() => {
    const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    ;[...chain.blocks, ...chain.dying, ...chain.flights.map(f => f.g)].forEach(paintBlock)
    chain.links.forEach(l => l.material.color.set(palette.link))
    chain.pulses.forEach(p => {
      p.material.color.set(palette.pulse)
      p.material.blending = blending
      p.material.needsUpdate = true
    })
  }, [palette, chain]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Canvas px (relative to the canvas) → point on the z = 0 plane ──
  const view = () => {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    return { halfH, halfW: halfH * (size.width / size.height) }
  }
  const pxToWorld = (x, y, out) => {
    const { halfW, halfH } = view()
    return out.set((x / size.width * 2 - 1) * halfW, -(y / size.height * 2 - 1) * halfH, 0)
  }

  // ── Center the ring over .hero-visual and size it to that column ──
  useEffect(() => {
    const place = () => {
      const canvasRect = gl.domElement.getBoundingClientRect()
      const visual = gl.domElement.closest('.hero')?.querySelector('.hero-visual')
      if (!visual || !canvasRect.width) return
      const vr = visual.getBoundingClientRect()
      pxToWorld(vr.left + vr.width / 2 - canvasRect.left, vr.top + vr.height / 2 - canvasRect.top, chain.root.position)
      const worldPerPx = (2 * view().halfW) / size.width
      chain.root.scale.setScalar(Math.min(1.1, Math.max(0.45, (vr.width * 0.44 * worldPerPx) / 3.1)))
    }
    place()
    // .hero-visual slides in on load; measure again once it has settled
    const id = setTimeout(place, 1200)
    return () => clearTimeout(id)
  }, [size, camera, chain, gl]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) * speed
    time.current += dt
    const t = time.current
    const p = pointer.current

    p.x = lerp(p.x, p.tx, 0.06)
    p.y = lerp(p.y, p.ty, 0.06)

    // Scroll dispersion: 0 = chain intact, 1 = blocks scattered and faded out
    spread.current = lerp(spread.current, scroll.current, 0.08)
    const s    = spread.current
    const ease = s * s * (3 - 2 * s)
    const fade = Math.pow(1 - ease, 2.5)

    const { root, tilt, ring, fly, blocks, links, pulses } = chain

    // ── New mint requests from the typewriter ──
    while (pending.current.length) {
      const m = pending.current.shift()
      if (chain.gap === null) { m.resolve(); continue }
      const canvasRect = gl.domElement.getBoundingClientRect()
      const start = pxToWorld(
        m.rect.left + m.rect.width / 2 - canvasRect.left,
        m.rect.top + m.rect.height / 2 - canvasRect.top,
        new THREE.Vector3(),
      )
      const g = chain.makeBlock(chain.nextNum++, m.index, chain.gap)
      paintBlock(g)
      g.userData.size = 0.3
      g.userData.flash = 1
      g.position.copy(start)
      g.visible = false
      fly.add(g)
      chain.reserved = chain.gap
      chain.gap = null
      chain.flights.push({ g, start, t0: t + MINT_DELAY, slot: chain.reserved, resolve: m.resolve })
    }

    // ── Hover — only over the canvas, and only while the chain is intact ──
    let hit = -1
    if (p.over && s < 0.3) {
      const rect = gl.domElement.getBoundingClientRect()
      ndc.set(((p.cx - rect.left) / rect.width) * 2 - 1, -((p.cy - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const first = raycaster.intersectObjects(blocks.map(g => g.userData.shell), false)[0]
      if (first) hit = blocks.findIndex(g => g.userData.shell === first.object)
    }
    if (hit !== hovered.current) {
      hovered.current = hit
      gl.domElement.style.cursor = hit >= 0 ? 'pointer' : ''
    }

    ring.rotation.y += dt * (0.2 * (hit >= 0 ? 0.2 : 1) + ease * 0.6)
    tilt.rotation.x = lerp(tilt.rotation.x, 0.32 - p.y * 0.28, 0.05)
    tilt.rotation.y = lerp(tilt.rotation.y, p.x * 0.35, 0.05)
    tilt.rotation.z = lerp(tilt.rotation.z, -p.x * 0.08, 0.05)

    const animate = (g, hot, opacity) => {
      const u = g.userData
      u.h = lerp(u.h, hot ? 1 : 0, 0.12)
      g.rotation.x += dt * (0.35 * u.spin + ease * u.tumble)
      g.rotation.y += dt * (0.5 * u.spin + ease * u.tumble * 0.5)
      g.scale.setScalar((1 + 0.3 * u.h + u.flash * 0.35) * u.size)
      u.edges.material.color.copy(edgeIdle).lerp(edgeHot, Math.max(u.h, u.flash))
      u.edges.material.opacity = 0.85 * opacity
      u.shell.material.opacity = (palette.shellOpacity + 0.25 * u.h) * opacity
      u.core.material.opacity = 0.85 * opacity
      u.core.scale.setScalar(1 + u.h * 0.8 + u.flash * 1.2 + Math.sin(t * 3 + u.phase) * 0.08)
      if (u.flash > 0) u.flash = Math.max(0, u.flash - dt * 1.4)
    }

    blocks.forEach((g, i) => {
      const u = g.userData
      g.position.copy(SLOT_POS[u.slot]).addScaledVector(u.scatter, ease * scatterScale)
      g.position.y += Math.sin(t * 1.2 + u.phase) * 0.12
      animate(g, i === hit, fade)
    })

    // The block that just left the chain sinks and fades out
    for (let i = chain.dying.length - 1; i >= 0; i--) {
      const g = chain.dying[i], u = g.userData
      u.life -= dt * 1.2
      u.drop += dt * 0.8
      u.size = 0.6 + 0.4 * Math.max(0, u.life)
      g.position.copy(SLOT_POS[u.slot]).addScaledVector(u.scatter, ease * scatterScale)
      g.position.y -= u.drop
      animate(g, false, Math.max(0, u.life) * fade)
      if (u.life <= 0) {
        ring.remove(g)
        chain.disposeBlock(g)
        chain.dying.splice(i, 1)
      }
    }

    // ── Blocks in flight: arc from the typed title into the gap ──
    root.updateWorldMatrix(true, true)
    for (let i = chain.flights.length - 1; i >= 0; i--) {
      const f = chain.flights[i], u = f.g.userData
      if (t < f.t0) continue
      f.g.visible = true
      const k = Math.min(1, (t - f.t0) / FLIGHT_TIME)
      const e = easeInOutCubic(k)
      ring.localToWorld(target.copy(SLOT_POS[f.slot]))
      ctrl.copy(f.start).lerp(target, 0.5)
      ctrl.y += 2.4
      ctrl.z += 1.8
      p1.copy(f.start).lerp(ctrl, e)
      p2.copy(ctrl).lerp(target, e)
      f.g.position.copy(p1).lerp(p2, e)
      u.size = lerp(0.3, root.scale.x, e)
      f.g.rotation.x += dt * 6 * (1 - e)
      f.g.rotation.y += dt * 8 * (1 - e)
      animate(f.g, false, fade)

      if (k >= 1) {
        ring.attach(f.g)
        f.g.position.copy(SLOT_POS[f.slot])
        u.slot = f.slot
        u.size = 1
        u.flash = 1
        blocks.push(f.g)
        const oldest = blocks.shift()
        chain.gap = oldest.userData.slot
        chain.reserved = null
        chain.dying.push(oldest)
        chain.flights.splice(i, 1)

        const land = landRef.current
        if (land) {
          f.g.getWorldPosition(tmp).project(camera)
          land.style.left = `${((tmp.x + 1) / 2) * size.width}px`
          land.style.top  = `${((1 - tmp.y) / 2) * size.height}px`
          land.textContent = `+ ${labels.block} #${u.num} · ${titles[u.titleIdx % titles.length]}`
          land.classList.remove('show')
          void land.offsetWidth // restart the CSS animation
          land.classList.add('show')
        }
        f.resolve()
      }
    }

    // ── Links between consecutive blocks; they snap first when scrolling away ──
    const linkFade = Math.max(0, 1 - ease * 2.5)
    links.forEach((line, i) => {
      const on = i < blocks.length - 1
      line.visible = pulses[i].visible = on
      if (!on) return
      const a = blocks[i].position
      const b = blocks[i + 1].position
      const arr = line.geometry.attributes.position.array
      arr[0] = a.x; arr[1] = a.y; arr[2] = a.z
      arr[3] = b.x; arr[4] = b.y; arr[5] = b.z
      line.geometry.attributes.position.needsUpdate = true
      line.material.opacity = 0.55 * linkFade
      pulses[i].material.opacity = 0.95 * linkFade

      const u = (t * 0.45 + i * 0.21) % 1
      pulses[i].position.lerpVectors(a, b, u)
      pulses[i].scale.setScalar(0.7 + Math.sin(u * Math.PI) * 0.6)
    })

    // ── Tooltip follows the hovered block ──
    const tip = tipRef.current
    if (!tip) return
    if (hit >= 0) {
      const u = blocks[hit].userData
      blocks[hit].getWorldPosition(tmp).project(camera)
      tip.style.left = `${((tmp.x + 1) / 2) * size.width}px`
      tip.style.top  = `${((1 - tmp.y) / 2) * size.height}px`
      tip.innerHTML =
        `<b>${labels.block} #${u.num}</b><br>` +
        `<span class="chain3d-hash">${titles[u.titleIdx % titles.length]}</span><br>` +
        `hash ${hashFor(u.num)}<br>` +
        `${labels.prev} ${hit > 0 ? hashFor(blocks[hit - 1].userData.num) : '0x000000…0000'}`
      tip.hidden = false
    } else {
      tip.hidden = true
    }
  })

  return (
    <>
      <primitive object={chain.root} />
      <primitive object={chain.fly} />
    </>
  )
}

function HeroChain3D({ mintRef, titles }) {
  const { theme }    = useTheme()
  const { language } = useLanguage()
  const wrapRef    = useRef(null)
  const tipRef     = useRef(null)
  const landRef    = useRef(null)
  const pointer    = useRef({ x: 0, y: 0, tx: 0, ty: 0, cx: 0, cy: 0, over: false })
  const scroll     = useRef(0)
  const pending    = useRef([])
  const visibleRef = useRef(true)
  const [visible, setVisible] = useState(true)
  const [ready, setReady]     = useState(false)

  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const mobile  = useMemo(() => window.innerWidth < 768, [])
  const palette = PALETTES[theme === 'light' ? 'light' : 'dark']
  const labels  = language === 'tr'
    ? { block: 'Blok', prev: 'önceki' }
    : { block: 'Block', prev: 'prev' }

  // Stop rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      setVisible(entry.isIntersecting)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Let the typewriter hand a finished title to the chain.
  // Returns null when the chain can't animate it, so the typewriter deletes the title instead.
  useEffect(() => {
    if (!mintRef) return
    mintRef.current = (rect, index) => {
      if (reduced || !ready || !visibleRef.current || scroll.current > 0.3) return null
      return new Promise(resolve => pending.current.push({ rect, index, resolve }))
    }
    return () => { mintRef.current = null }
  }, [mintRef, reduced, ready])

  // Scroll progress through the hero: 0 at the top, 1 once 70% of it has scrolled past
  useEffect(() => {
    const hero = wrapRef.current?.closest('.hero')
    if (!hero) return
    const onScroll = () => {
      const r = hero.getBoundingClientRect()
      scroll.current = Math.min(1, Math.max(0, -r.top / (r.height * 0.7)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Tilt follows the cursor anywhere on the page; hover only counts over the canvas
  useEffect(() => {
    const p = pointer.current
    const onMove = (e) => {
      p.tx = (e.clientX / window.innerWidth) * 2 - 1
      p.ty = -(e.clientY / window.innerHeight) * 2 + 1
      p.cx = e.clientX
      p.cy = e.clientY
      p.over = e.target instanceof HTMLCanvasElement && wrapRef.current?.contains(e.target)
    }
    const onOut = (e) => {
      if (e.relatedTarget) return
      p.tx = 0; p.ty = 0; p.over = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <div className={`chain3d${ready ? ' ready' : ''}`} ref={wrapRef} aria-hidden="true">
      <Canvas
        flat
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ fov: 40, position: [0, 0, 9] }}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
      >
        <ambientLight color={palette.ambient} intensity={1.1} />
        <pointLight color={palette.key} intensity={2.4} decay={0} position={[5, 6, 7]} />
        <pointLight color={palette.rim} intensity={1.8} decay={0} position={[-6, -4, -3]} />
        <Chain
          palette={palette}
          labels={labels}
          titles={titles}
          tipRef={tipRef}
          landRef={landRef}
          pointer={pointer}
          scroll={scroll}
          pending={pending}
          speed={reduced ? 0.15 : 1}
          scatterScale={reduced ? 0 : 1}
        />
      </Canvas>
      <div className="chain3d-tip" ref={tipRef} hidden />
      <div className="chain3d-landing" ref={landRef} />
    </div>
  )
}

export default HeroChain3D
