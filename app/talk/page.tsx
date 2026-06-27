'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const BUSY_WITH = [
    { film: 'Pathaan', reason: 'stopping a nuclear threat' },
    { film: 'Jawan', reason: 'rebuilding the nation' },
    { film: 'Dunki', reason: 'finding his way home' },
    { film: 'King', reason: 'being a King' },
]

const LETTER = `We know you're busy. We've seen the movies.
But we keep thinking about Jug.

Not because he said something profound —
more because he asked questions nobody else was asking,
without making us feel broken for needing them.

That's a rare thing. In films and in life.

If there's ever a chapter two, we'll be there.
No rush. Just don't forget him.`

export default function TalkPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                <Link
                    href="/serene"
                    className="text-gray-500 hover:text-gray-300 transition-colors text-xs tracking-[0.3em] uppercase font-sans"
                >
                    ← Back
                </Link>
                <div className="w-20" />
            </div>

            {/* Two-column body */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">

                {/* LEFT — Oops + Last seen */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2 }}
                    className="flex flex-col justify-center px-12 py-16 md:border-r border-white/5 space-y-12"
                >
                    <div className="space-y-5">
                        <p className="text-gray-500 text-[10px] tracking-[0.5em] uppercase font-sans">
                            Sorry —
                        </p>
                        <h1 className="text-7xl md:text-8xl font-serif text-white tracking-wide">
                            Oops.
                        </h1>
                        <p className="text-gray-300 text-sm font-sans leading-relaxed">
                            Dr. Jahangir Khan is currently unavailable.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-sans">
                            Last seen
                        </p>
                        <div className="space-y-4">
                            {BUSY_WITH.map((item, i) => (
                                <motion.div
                                    key={item.film}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                                    className="flex items-baseline gap-4"
                                >
                                    <span className="text-white font-serif italic text-base w-24 shrink-0">
                                        {item.film}
                                    </span>
                                    <span className="text-white/20 text-xs">—</span>
                                    <span className="text-gray-300 text-sm font-sans">
                                        {item.reason}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT — Letter */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="flex flex-col justify-center px-12 py-16"
                >
                    <div className="text-white/85 text-sm font-serif leading-[2.1] whitespace-pre-line">
                        {LETTER}
                    </div>
                </motion.div>
            </div>

            <div className="py-6 text-center text-gray-600 text-[9px] tracking-widest font-sans border-t border-white/5">
                © 2026 All Rights Reserved — For educational purposes only
            </div>
        </div>
    )
}
