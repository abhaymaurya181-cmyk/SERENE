'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const R = 36
const CIRCUMFERENCE = 2 * Math.PI * R
const DURATION = 2400

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const t = setTimeout(() => router.push('/serene'), DURATION)
        return () => clearTimeout(t)
    }, [router])

    return (
        <main className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle
                        cx="48" cy="48" r={R}
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="1"
                    />
                    <circle
                        cx="48" cy="48" r={R}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        style={{
                            strokeDashoffset: CIRCUMFERENCE,
                            animation: `fill-circle ${DURATION}ms linear forwards`,
                        }}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] tracking-[0.35em] text-white/30 uppercase font-sans">
                    SERENE
                </span>
            </div>

            <style>{`
                @keyframes fill-circle {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </main>
    )
}
