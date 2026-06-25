'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useInView, motion } from 'framer-motion'
import * as THREE from 'three'

function StarText({ isInView }: { isInView: boolean }) {
    const ref = useRef<THREE.Points>(null)
    const [targetPos, setTargetPos] = useState<Float32Array | null>(null)
    const [startPos, setStartPos] = useState<Float32Array | null>(null)
    const [colors, setColors] = useState<Float32Array | null>(null)
    const [animStart, setAnimStart] = useState<number | null>(null)
    const [done, setDone] = useState(false)

    useEffect(() => {
        const cvs = document.createElement('canvas')
        const ctx = cvs.getContext('2d')
        if (!ctx) return

        const W = 1800
        const H = 340
        cvs.width = W
        cvs.height = H

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, W, H)

        // Draw SERENE in the same Cinzel serif font as the rest of the site
        ctx.font = 'bold 220px "Cinzel", Georgia, serif'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('SERENE', W / 2, H / 2)

        const pixels = ctx.getImageData(0, 0, W, H)
        const d = pixels.data
        const targets: number[] = []
        const starts: number[] = []
        const cols: number[] = []
        const STEP = 3

        for (let y = 0; y < H; y += STEP) {
            for (let x = 0; x < W; x += STEP) {
                const i = (y * W + x) * 4
                const lum = (d[i] + d[i + 1] + d[i + 2]) / 3

                if (lum > 80) {
                    // Map text to 3D: camera fov=55 z=5 → visible x ±4.63, y ±2.6
                    // Text spans x ±4.4 (fills width), y ±0.85 (text height centered)
                    targets.push(
                        (x / W - 0.5) * 8.8,
                        -(y / H - 0.5) * 1.7,
                        (lum / 255) * 0.3
                    )

                    // Start: scattered as a galaxy ring around center
                    const angle = Math.random() * Math.PI * 2
                    const dist = 2.5 + Math.random() * 9
                    starts.push(
                        Math.cos(angle) * dist * 1.4,
                        Math.sin(angle) * dist,
                        (Math.random() - 0.5) * 6
                    )

                    // Star color: bright white-blue, slight variation per star
                    const v = 0.75 + Math.random() * 0.25
                    cols.push(v * 0.85, v * 0.92, v)
                }
            }
        }

        console.log(`[Galaxy] Text particles: ${targets.length / 3}`)
        setTargetPos(new Float32Array(targets))
        setStartPos(new Float32Array(starts))
        setColors(new Float32Array(cols))
    }, [])

    useEffect(() => {
        if (isInView && !animStart && !done && targetPos) {
            const t = setTimeout(() => setAnimStart(Date.now()), 800)
            return () => clearTimeout(t)
        }
    }, [isInView, animStart, done, targetPos])

    useFrame(({ clock }) => {
        if (!ref.current || !targetPos || !startPos) return
        const pos = ref.current.geometry.attributes.position.array as Float32Array
        const t = clock.elapsedTime

        if (done) {
            // Text formed — hold with gentle breathing glow
            for (let i = 0; i < pos.length; i += 3) {
                const ph = i * 0.0008
                pos[i]     = targetPos[i]     + Math.sin(t * 0.5 + ph) * 0.003
                pos[i + 1] = targetPos[i + 1] + Math.cos(t * 0.4 + ph) * 0.003
                pos[i + 2] = targetPos[i + 2]
            }
            ref.current.geometry.attributes.position.needsUpdate = true
            return
        }

        if (!animStart) {
            // Idle: galaxy ring drifts gently, visible as starfield
            for (let i = 0; i < pos.length; i += 3) {
                const ph = i * 0.003
                // Fold into visible range
                const sx = ((startPos[i] % 10) + 10) % 10 - 5
                const sy = ((startPos[i + 1] % 6) + 6) % 6 - 3
                pos[i]     = sx + Math.sin(t * 0.12 + ph) * 0.25
                pos[i + 1] = sy + Math.cos(t * 0.10 + ph) * 0.25
                pos[i + 2] = startPos[i + 2]
            }
            ref.current.geometry.attributes.position.needsUpdate = true
            return
        }

        // Stars converge → form SERENE text  — cubic ease-out over 4.5s
        const elapsed = (Date.now() - animStart) / 1000
        const progress = Math.min(elapsed / 4.5, 1)
        const ease = 1 - Math.pow(1 - progress, 3)

        if (progress >= 1) setDone(true)

        for (let i = 0; i < pos.length; i++) {
            pos[i] = startPos[i] + (targetPos[i] - startPos[i]) * ease
        }
        ref.current.geometry.attributes.position.needsUpdate = true
    })

    if (!startPos || !colors) return null

    return (
        <Points key={startPos.length} ref={ref} positions={startPos} colors={colors} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.02}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={1}
            />
        </Points>
    )
}

function BackgroundStars() {
    const count = 2500
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 30
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8
        }
        return pos
    }, [])

    const ref = useRef<THREE.Points>(null)
    useFrame(() => {
        if (ref.current) ref.current.rotation.z += 0.00006
    })

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#7799ff" size={0.006} sizeAttenuation depthWrite={false} opacity={0.4} />
        </Points>
    )
}

interface GalaxyProps {
    onComplete?: () => void
}

export default function Galaxy({ onComplete }: GalaxyProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { amount: 0.3, once: false })
    const [hasCalledComplete, setHasCalledComplete] = useState(false)

    useEffect(() => {
        if (!hasCalledComplete && onComplete) {
            const timer = setTimeout(() => {
                setHasCalledComplete(true)
                onComplete()
            }, 8000)
            return () => clearTimeout(timer)
        }
    }, [hasCalledComplete, onComplete])

    return (
        <div ref={containerRef} className="w-full h-screen bg-black relative overflow-hidden snap-start">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 55 }}>
                    <StarText isInView={isInView} />
                    <BackgroundStars />
                </Canvas>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

            {/* Subtitle fades in after text forms */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 5.5, duration: 2 }}
                    className="text-gray-400 tracking-[0.5em] text-xs md:text-sm uppercase font-sans mt-40"
                >
                    A love letter to cinema, Goa, and Jahangir Khan
                </motion.p>
            </div>
        </div>
    )
}
