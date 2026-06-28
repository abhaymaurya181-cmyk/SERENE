'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useInView, motion } from 'framer-motion'
import * as THREE from 'three'

const N = 2500

/* ── position builders ── */

function buildText(lines: string[], fontSize = 120): Float32Array {
    const W = 1800, lineH = 340
    const H = lineH * lines.length
    const cvs = document.createElement('canvas')
    cvs.width = W; cvs.height = H
    const ctx = cvs.getContext('2d')!
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
    ctx.font = `bold ${fontSize}px "Cinzel", Georgia, serif`
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    lines.forEach((line, i) => {
        ctx.fillText(line, W / 2, lineH * (i + 0.5))
    })
    const d = ctx.getImageData(0, 0, W, H).data
    const pts: [number, number][] = []
    for (let y = 0; y < H; y += 3)
        for (let x = 0; x < W; x += 3)
            if ((d[(y * W + x) * 4] + d[(y * W + x) * 4 + 1] + d[(y * W + x) * 4 + 2]) / 3 > 80)
                pts.push([x, y])
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
        const [cx, cy] = pts.length ? pts[Math.floor(Math.random() * pts.length)] : [W / 2, H / 2]
        pos[i * 3]     = (cx / W - 0.5) * 8.8
        pos[i * 3 + 1] = -(cy / H - 0.5) * (1.7 * lines.length)
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2
    }
    return pos
}

function buildScatter(): Float32Array {
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2
        const d = 2.5 + Math.random() * 9
        pos[i * 3]     = Math.cos(a) * d * 1.4
        pos[i * 3 + 1] = Math.sin(a) * d
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
}

/* ── easing ── */
const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 3)
const easeIn  = (t: number) => Math.min(t, 1) ** 3

/* ── sequence ── */
type PosKey = 'scatter' | 'dearZindagi'
type Mode   = 'galaxy' | 'form' | 'breathe' | 'scatter'

const STEPS: { from: PosKey; to: PosKey; dur: number; fn: (t: number) => number; mode: Mode }[] = [
    { from: 'scatter',     to: 'scatter',     dur: 2,   fn: easeOut, mode: 'galaxy'  },
    { from: 'scatter',     to: 'dearZindagi', dur: 4,   fn: easeOut, mode: 'form'    },
    { from: 'dearZindagi', to: 'dearZindagi', dur: 3,   fn: easeOut, mode: 'breathe' },
    { from: 'dearZindagi', to: 'scatter',     dur: 1.5, fn: easeIn,  mode: 'scatter' },
]

/* ── particle mesh ── */
function Particles({
    allPos,
    isActive,
    onStepChange,
}: {
    allPos: Record<PosKey, Float32Array>
    isActive: boolean
    onStepChange: (step: number) => void
}) {
    const meshRef    = useRef<THREE.Points>(null)
    const stepRef    = useRef(-1)
    const startMsRef = useRef(0)
    const firedRef   = useRef(-1)
    const cbRef      = useRef(onStepChange)
    useEffect(() => { cbRef.current = onStepChange }, [onStepChange])

    useEffect(() => {
        if (isActive && stepRef.current === -1) {
            stepRef.current = 0
            startMsRef.current = Date.now()
        }
    }, [isActive])

    useFrame(({ clock }) => {
        if (!meshRef.current || stepRef.current < 0) return
        const step = STEPS[stepRef.current]
        if (!step) return

        const pos     = meshRef.current.geometry.attributes.position.array as Float32Array
        const t       = clock.elapsedTime
        const elapsed = (Date.now() - startMsRef.current) / 1000
        const raw     = elapsed / step.dur
        const p       = step.fn(raw)
        const A       = allPos[step.from]
        const B       = allPos[step.to]

        switch (step.mode) {
            case 'galaxy':
                for (let i = 0; i < N; i++) {
                    const ph = i * 0.003
                    const sx = ((A[i * 3] % 10) + 10) % 10 - 5
                    const sy = ((A[i * 3 + 1] % 6) + 6) % 6 - 3
                    pos[i * 3]     = sx + Math.sin(t * 0.12 + ph) * 0.25
                    pos[i * 3 + 1] = sy + Math.cos(t * 0.10 + ph) * 0.25
                    pos[i * 3 + 2] = A[i * 3 + 2]
                }
                break
            case 'breathe':
                for (let i = 0; i < N; i++) {
                    const ph = i * 0.001
                    pos[i * 3]     = B[i * 3]     + Math.sin(t * 0.5 + ph) * 0.004
                    pos[i * 3 + 1] = B[i * 3 + 1] + Math.cos(t * 0.4 + ph) * 0.004
                    pos[i * 3 + 2] = B[i * 3 + 2]
                }
                break
            default:
                for (let i = 0; i < N; i++) {
                    pos[i * 3]     = A[i * 3]     + (B[i * 3]     - A[i * 3])     * p
                    pos[i * 3 + 1] = A[i * 3 + 1] + (B[i * 3 + 1] - A[i * 3 + 1]) * p
                    pos[i * 3 + 2] = A[i * 3 + 2] + (B[i * 3 + 2] - A[i * 3 + 2]) * p
                }
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true

        if (raw >= 1 && stepRef.current < STEPS.length - 1) {
            stepRef.current++
            startMsRef.current = Date.now()
            if (firedRef.current !== stepRef.current) {
                firedRef.current = stepRef.current
                cbRef.current(stepRef.current)
            }
        } else if (raw >= 1 && stepRef.current === STEPS.length - 1) {
            if (firedRef.current !== 99) {
                firedRef.current = 99
                cbRef.current(99)
            }
        }
    })

    return (
        <Points ref={meshRef} positions={allPos.scatter.slice()} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#a8c8ff"
                size={0.022}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.9}
            />
        </Points>
    )
}

function BackgroundStars() {
    const positions = useMemo(() => {
        const pos = new Float32Array(2000 * 3)
        for (let i = 0; i < 2000; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 30
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 8
        }
        return pos
    }, [])
    const ref = useRef<THREE.Points>(null)
    useFrame(() => { if (ref.current) ref.current.rotation.z += 0.00005 })
    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#7799ff" size={0.005} sizeAttenuation depthWrite={false} opacity={0.35} />
        </Points>
    )
}

/* ── main export ── */
export default function Galaxy({ onComplete }: { onComplete?: () => void }) {
    const containerRef                      = useRef<HTMLDivElement>(null)
    const isInView                          = useInView(containerRef, { amount: 0.3, once: false })
    const [allPos, setAllPos]               = useState<Record<PosKey, Float32Array> | null>(null)
    const [isActive, setIsActive]           = useState(false)
    const [showSubtitle, setShowSubtitle]   = useState(false)
    const [showNameText, setShowNameText]   = useState(true)
    const completedRef                      = useRef(false)

    useEffect(() => {
        document.fonts.ready.then(() => {
            setAllPos({
                scatter:      buildScatter(),
                dearZindagi:  buildText(['JAHANGIR', 'KHAN'], 120),
            })
        })
    }, [])

    useEffect(() => {
        if (isInView && allPos) setIsActive(true)
    }, [isInView, allPos])

    const handleStepChange = (step: number) => {
        // step 1 = particles start forming the name — hide text overlay
        if (step === 1) setShowNameText(false)
        // step 2 = holding JAHANGIR KHAN → show subtitle
        if (step === 2) {
            setTimeout(() => setShowSubtitle(true), 800)
        }
        // step 99 = sequence complete — show text overlay again for when user returns
        if (step === 99) {
            setShowNameText(true)
            if (!completedRef.current) {
                completedRef.current = true
                onComplete?.()
            }
        }
    }

    return (
        <div ref={containerRef} className="w-full h-screen bg-black relative overflow-hidden snap-start">
            <div className="absolute inset-0 z-0">
                {allPos && (
                    <Canvas camera={{ position: [0, 0, 5], fov: 55 }}>
                        <BackgroundStars />
                        <Particles
                            allPos={allPos}
                            isActive={isActive}
                            onStepChange={handleStepChange}
                        />
                    </Canvas>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                animate={{ opacity: showNameText ? 1 : 0 }}
                transition={{ duration: 1.2 }}
            >
                <h1
                    className="text-white text-4xl md:text-6xl tracking-[0.35em] uppercase pointer-events-none select-none text-center w-full pl-[0.35em]"
                    style={{ fontFamily: '"Cinzel", Georgia, serif', fontWeight: 700, textShadow: '0 0 40px rgba(168,200,255,0.4)' }}
                >
                    DEAR ZINDAGI
                </h1>
            </motion.div>

            <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none z-10">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showSubtitle ? 1 : 0 }}
                    transition={{ duration: 2 }}
                    className="text-gray-500 tracking-[0.4em] text-xs uppercase font-sans italic"
                >
                    some stories stay with you
                </motion.p>
            </div>
        </div>
    )
}
