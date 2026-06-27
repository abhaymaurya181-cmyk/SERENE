'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Outro() {
    const [shared, setShared] = useState(false)

    const handleShare = async () => {
        const url = 'https://abhaygrt.in'
        const text = 'SERENE — A cinematic tribute to Dear Zindagi and Jahangir Khan.'

        if (navigator.share) {
            try {
                await navigator.share({ title: 'SERENE', text, url })
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url)
            setShared(true)
            setTimeout(() => setShared(false), 2500)
        }
    }

    return (
        <section className="h-screen bg-black flex flex-col items-center justify-center relative z-20 text-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
                className="space-y-10"
            >
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-[0.2em] font-serif drop-shadow-2xl">
                    SERENE
                </h1>

                <div className="space-y-2">
                    <p className="text-gray-400 tracking-widest text-sm uppercase font-sans">
                        A Dear Zindagi Experience
                    </p>
                    <p className="text-white tracking-widest text-sm uppercase font-sans font-semibold">
                        By Abhay
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 1.5 }}
                    className="pt-4 flex flex-col items-center gap-6"
                >
                    <Link
                        href="/talk"
                        className="group inline-flex flex-col items-center gap-3"
                    >
                        <span className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-sans">
                            Something weighing on you?
                        </span>
                        <span className="text-white border border-white/20 hover:border-white/60 px-8 py-3 text-xs tracking-[0.4em] uppercase font-sans transition-all duration-500 hover:bg-white/5">
                            Talk to Jahangir Khan
                        </span>
                    </Link>

                    <button
                        onClick={handleShare}
                        className="text-gray-600 hover:text-gray-400 transition-colors text-[10px] tracking-[0.4em] uppercase font-sans flex items-center gap-2"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="9.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="2.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <line x1="3.9" y1="5.25" x2="8.1" y2="3.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="3.9" y1="6.75" x2="8.1" y2="8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        {shared ? 'Link Copied' : 'Share this experience'}
                    </button>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-10 text-gray-600 text-xs tracking-widest text-center">
                © {new Date().getFullYear()} All Rights Reserved — For educational purposes only
            </div>
        </section>
    )
}
