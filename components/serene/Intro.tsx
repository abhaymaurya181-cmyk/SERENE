'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Intro({ onComplete, onUserClick }: { onComplete: (userInteracted?: boolean) => void; onUserClick?: () => void }) {
    const [step, setStep] = useState(0)
    const [particles, setParticles] = useState<Array<{ width: string, height: string, top: string, left: string, duration: string, delay: string }>>([])

    useEffect(() => {
        setParticles([...Array(20)].map(() => ({
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            duration: Math.random() * 10 + 10 + 's',
            delay: Math.random() * 5 + 's',
        })))
    }, [])

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 1000) // Start
        const timer2 = setTimeout(() => setStep(2), 4000) // Show Title
        const timer3 = setTimeout(() => setStep(3), 8000) // Show Subtitle
        const timer4 = setTimeout(() => {
            onComplete()
        }, 12000) // End intro

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(timer4)
        }
    }, [onComplete])

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => {
                if (step >= 3) {
                    // Call onUserClick first to trigger audio in the same click context
                    onUserClick?.()
                    onComplete(true) // Pass true to indicate user clicked
                }
            }}
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a1a] to-[#050510] opacity-0 animate-fade-in duration-[2000ms]"
                style={{ opacity: step >= 1 ? 1 : 0 }} />

            {/* Dust Particles (CSS Animation for performance) */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20 animate-float"
                        style={{
                            width: p.width,
                            height: p.height,
                            top: p.top,
                            left: p.left,
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                        }}
                    />
                ))}
            </div>

            {/* Text Sequence */}
            <div className="relative z-10 flex flex-col items-center justify-center h-screen gap-8">
                {/* Presenter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: step === 1 ? 1 : 0,
                        y: step === 1 ? 0 : -20
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-center"
                >
                    <p className="text-gray-400 tracking-[0.4em] text-xs md:text-sm uppercase font-sans font-light">
                        AbhayGRT Presents
                    </p>
                </motion.div>

                {/* Main Title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{
                        opacity: step >= 2 && step < 4 ? 1 : 0,
                        scale: step >= 2 ? 1 : 1.1,
                        filter: step >= 2 ? 'blur(0px)' : 'blur(10px)'
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-7xl md:text-9xl font-bold text-white tracking-[0.15em] font-serif drop-shadow-2xl">
                        SERENE
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 3 && step < 4 ? 1 : 0 }}
                    transition={{ duration: 1.5 }}
                    className="text-center"
                >
                    <p className="text-gray-300 text-lg md:text-2xl tracking-widest font-display italic mb-8">
                        A love letter to cinema, Goa, and Jahangir Khan
                    </p>

                    {step >= 3 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-xs text-white uppercase tracking-[0.3em] font-sans animate-pulse"
                        >
                            {/* Click to Enter */}
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
