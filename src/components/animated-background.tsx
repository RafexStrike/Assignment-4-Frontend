"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Animation variables
    let time = 0
    const orbs: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      hue: number
    }> = []

    // Create floating orbs
    const createOrbs = () => {
      const numOrbs = Math.floor(window.innerWidth / 300)
      for (let i = 0; i < numOrbs; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 200 + 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: 200 + Math.random() * 40, // Blue hues
        })
      }
    }
    createOrbs()

    // Animation loop
    const animate = () => {
      time += 0.01

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0e1a")
      gradient.addColorStop(0.5, "#0f1525")
      gradient.addColorStop(1, "#0a0e1a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw orbs
      orbs.forEach((orb, index) => {
        // Update position
        orb.x += orb.vx
        orb.y += orb.vy

        // Bounce off edges
        if (orb.x < -orb.radius || orb.x > canvas.width + orb.radius) orb.vx *= -1
        if (orb.y < -orb.radius || orb.y > canvas.height + orb.radius) orb.vy *= -1

        // Create radial gradient for orb
        const orbGradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        )
        
        const alpha = 0.15 + Math.sin(time + index) * 0.05
        orbGradient.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${alpha})`)
        orbGradient.addColorStop(0.5, `hsla(${orb.hue}, 70%, 50%, ${alpha * 0.5})`)
        orbGradient.addColorStop(1, `hsla(${orb.hue}, 60%, 40%, 0)`)

        ctx.fillStyle = orbGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Add noise/grain effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)"
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.fillRect(x, y, 1, 1)
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: "#0a0e1a" }}
    />
  )
}