import { useEffect, useRef } from 'react'
import { canHover, prefersReducedMotion } from '../lib/env'

const COLORS = ['#D94C91', '#F3B6CE', '#E9B872', '#ffffff']

/** A delicate sparkle trail that follows the mouse (desktop only). */
export default function CursorSparkles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canHover() || prefersReducedMotion()) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let raf = 0
    let last = { x: -999, y: -999, t: 0 }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }
    resize()

    const drawStar = (x, y, r, color, alpha, rot) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, -r)
      for (let i = 0; i < 4; i++) {
        const control = -Math.PI / 2 + (Math.PI / 2) * i + Math.PI / 4
        const point = -Math.PI / 2 + (Math.PI / 2) * (i + 1)
        ctx.quadraticCurveTo(Math.cos(control) * r * 0.2, Math.sin(control) * r * 0.2, Math.cos(point) * r, Math.sin(point) * r)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter((p) => p.life > 0)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.025
        p.rot += p.vr
        p.life -= 0.022
        drawStar(p.x, p.y, p.size * (0.5 + p.life * 0.5), p.color, Math.max(p.life, 0) * 0.9, p.rot)
      }
      raf = particles.length ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const now = performance.now()
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
      if (dist < 16 && now - last.t < 60) return
      last = { x: e.clientX, y: e.clientY, t: now }
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.2 - Math.random() * 0.4,
        size: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.08,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      if (particles.length > 60) particles.shift()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />
}
