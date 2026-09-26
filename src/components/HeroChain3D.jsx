import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import './HeroChain3D.css'

const BLOCKS      = 7
const RADIUS      = 2.5
const FIRST_BLOCK = 18204

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

// Deterministic fake hashes so the chain looks the same on every visit
const HASHES = (() => {
  let seed = 20240917
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
  const hex = n => Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(rnd() * 16)]).join('')
  return Array.from({ length: BLOCKS }, () => `0x${hex(6)}…${hex(4)}`)
})()

const lerp = (a, b, t) => a + (b - a) * t

// ── Build the chain once (imperative three.js objects) ─────
function buildChain() {
  const root = new THREE.Group()
  const tilt = new THREE.Group()
  const ring = new THREE.Group()
  root.add(tilt)
  tilt.add(ring)
  tilt.rotation.x = 0.32

  const boxGeo   = new THREE.BoxGeometry(0.95, 0.95, 0.95)
  const edgeGeo  = new THREE.EdgesGeometry(boxGeo)
  const coreGeo  = new THREE.OctahedronGeometry(0.26)
  const pulseGeo = new THREE.SphereGeometry(0.06, 12, 12)
  const materials = []
  const track = m => (materials.push(m), m)

  const blocks = []
  const hits   = []
  for (let i = 0; i < BLOCKS; i++) {
    const a = (i / BLOCKS) * Math.PI * 2
    const g = new THREE.Group()
    g.position.set(Math.cos(a) * RADIUS, Math.sin(a * 2) * 0.3, Math.sin(a) * RADIUS)

    const shell = new THREE.Mesh(boxGeo, track(new THREE.MeshPhysicalMaterial({
      metalness: 0.1, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1,
      transparent: true, depthWrite: false,
    })))
    const edges = new THREE.LineSegments(edgeGeo, track(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 })))
    const core  = new THREE.Mesh(coreGeo, track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, depthWrite: false })))
    g.add(shell, edges, core)

    shell.userData.idx = i
    g.userData = {
      h: 0,
      spin: 0.6 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      baseY: g.position.y,
      shell, edges, core,
    }
    ring.add(g)
    blocks.push(g)
    hits.push(shell)
  }

  // Links between consecutive blocks — the gap after the last one is "the next block"
  const links  = []
  const pulses = []
  for (let i = 0; i < BLOCKS - 1; i++) {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    const line = new THREE.Line(geo, track(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 })))
    const pulse = new THREE.Mesh(pulseGeo, track(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false })))
    ring.add(line, pulse)
    links.push(line)
    pulses.push(pulse)
  }

  const dispose = () => {
    boxGeo.dispose(); edgeGeo.dispose(); coreGeo.dispose(); pulseGeo.dispose()
    links.forEach(l => l.geometry.dispose())
    materials.forEach(m => m.dispose())
  }

  return { root, tilt, ring, blocks, hits, links, pulses, dispose }
}

function Chain({ palette, labels, tipRef, pointer, speed }) {
  const { camera, size, gl } = useThree()
  const chain     = useMemo(buildChain, [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const ndc       = useMemo(() => new THREE.Vector2(), [])
  const tmp       = useMemo(() => new THREE.Vector3(), [])
  const edgeIdle  = useMemo(() => new THREE.Color(palette.edge), [palette])
  const edgeHot   = useMemo(() => new THREE.Color(palette.edgeHot), [palette])
  const time      = useRef(0)
  const hovered   = useRef(-1)

  useEffect(() => () => chain.dispose(), [chain])

  // ── Theme colors ──────────────────────────────────────────
  useEffect(() => {
    const blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending
    chain.blocks.forEach(({ userData: u }) => {
      u.shell.material.color.set(palette.shell)
      u.shell.material.emissive.set(palette.emissive)
      u.core.material.color.set(palette.core)
      u.core.material.blending = blending
      u.core.material.needsUpdate = true
    })
    chain.links.forEach(l => l.material.color.set(palette.link))
    chain.pulses.forEach(p => {
      p.material.color.set(palette.pulse)
      p.material.blending = blending
      p.material.needsUpdate = true
    })
  }, [palette, chain])

  // ── Fit the ring to the canvas, sitting above the code card ──
  useEffect(() => {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    const halfW = halfH * (size.width / size.height)
    chain.root.scale.setScalar(Math.min(0.95, halfW / 3.7))
    chain.root.position.set(0, halfH * 0.36, 0)
  }, [size, camera, chain])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05) * speed
    time.current += dt
    const t = time.current
    const p = pointer.current

    p.x = lerp(p.x, p.tx, 0.06)
    p.y = lerp(p.y, p.ty, 0.06)

    // Hover — only while the cursor is actually over the canvas
    let hit = -1
    if (p.over) {
      const rect = gl.domElement.getBoundingClientRect()
      ndc.set(((p.cx - rect.left) / rect.width) * 2 - 1, -((p.cy - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(ndc, camera)
      const first = raycaster.intersectObjects(chain.hits, false)[0]
      if (first) hit = first.object.userData.idx
    }
    if (hit !== hovered.current) {
      hovered.current = hit
      gl.domElement.style.cursor = hit >= 0 ? 'pointer' : ''
    }

    const { tilt, ring, blocks, links, pulses } = chain
    ring.rotation.y += dt * 0.22 * (hit >= 0 ? 0.2 : 1)
    tilt.rotation.x = lerp(tilt.rotation.x, 0.32 - p.y * 0.28, 0.05)
    tilt.rotation.y = lerp(tilt.rotation.y, p.x * 0.35, 0.05)
    tilt.rotation.z = lerp(tilt.rotation.z, -p.x * 0.08, 0.05)

    blocks.forEach((g, i) => {
      const u = g.userData
      u.h = lerp(u.h, i === hit ? 1 : 0, 0.12)
      g.position.y = u.baseY + Math.sin(t * 1.2 + u.phase) * 0.12
      g.rotation.x += dt * 0.35 * u.spin
      g.rotation.y += dt * 0.5 * u.spin
      g.scale.setScalar(1 + 0.3 * u.h)
      u.edges.material.color.copy(edgeIdle).lerp(edgeHot, u.h)
      u.shell.material.opacity = palette.shellOpacity + 0.25 * u.h
      u.core.scale.setScalar(1 + u.h * 0.8 + Math.sin(t * 3 + u.phase) * 0.08)
    })

    links.forEach((line, i) => {
      const a = blocks[i].position
      const b = blocks[i + 1].position
      const arr = line.geometry.attributes.position.array
      arr[0] = a.x; arr[1] = a.y; arr[2] = a.z
      arr[3] = b.x; arr[4] = b.y; arr[5] = b.z
      line.geometry.attributes.position.needsUpdate = true

      const u = (t * 0.45 + i * 0.21) % 1
      pulses[i].position.lerpVectors(a, b, u)
      pulses[i].scale.setScalar(0.7 + Math.sin(u * Math.PI) * 0.6)
    })

    // Tooltip follows the hovered block
    const tip = tipRef.current
    if (!tip) return
    if (hit >= 0) {
      blocks[hit].getWorldPosition(tmp).project(camera)
      tip.style.left = `${((tmp.x + 1) / 2) * size.width}px`
      tip.style.top  = `${((1 - tmp.y) / 2) * size.height}px`
      tip.innerHTML =
        `<b>${labels.block} #${FIRST_BLOCK + hit}</b><br>` +
        `hash <span class="chain3d-hash">${HASHES[hit]}</span><br>` +
        `${labels.prev} ${hit > 0 ? HASHES[hit - 1] : '0x000000…0000'}<br>` +
        `${8 + (hit * 7) % 23} ${labels.tx}`
      tip.hidden = false
    } else {
      tip.hidden = true
    }
  })

  return <primitive object={chain.root} />
}

function HeroChain3D() {
  const { theme }    = useTheme()
  const { language } = useLanguage()
  const wrapRef = useRef(null)
  const tipRef  = useRef(null)
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0, cx: 0, cy: 0, over: false })
  const [visible, setVisible] = useState(true)
  const [ready, setReady]     = useState(false)

  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const mobile  = useMemo(() => window.innerWidth < 768, [])
  const palette = PALETTES[theme === 'light' ? 'light' : 'dark']
  const labels  = language === 'tr'
    ? { block: 'Blok', prev: 'önceki', tx: 'işlem' }
    : { block: 'Block', prev: 'prev', tx: 'txs' }

  // Stop rendering while the hero is scrolled out of view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
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
          tipRef={tipRef}
          pointer={pointer}
          speed={reduced ? 0.15 : 1}
        />
      </Canvas>
      <div className="chain3d-tip" ref={tipRef} hidden />
    </div>
  )
}

export default HeroChain3D
