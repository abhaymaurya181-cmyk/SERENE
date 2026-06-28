'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const SHARE_URL  = 'https://abhaygrt.in'
const SHARE_TEXT = 'SERENE — A cinematic tribute to Dear Zindagi and Jahangir Khan.'

function ShareModal({ onClose }: { onClose: () => void }) {
    const [copied, setCopied] = useState(false)

    const copyLink = async () => {
        await navigator.clipboard.writeText(SHARE_URL)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const options = [
        {
            label: 'WhatsApp',
            href: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`,
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
        },
        {
            label: 'X / Twitter',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
    ]

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <motion.div
                className="relative w-full sm:max-w-xs mx-4 sm:mx-auto mb-8 sm:mb-0 bg-[#0a0a0a] border border-white/10 p-6 space-y-6"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase text-center font-sans">
                    Share this experience
                </p>

                <div className="space-y-3">
                    {options.map(opt => (
                        <a
                            key={opt.label}
                            href={opt.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 w-full px-4 py-3 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300 font-sans text-xs tracking-[0.25em] uppercase"
                        >
                            {opt.icon}
                            {opt.label}
                        </a>
                    ))}

                    <button
                        onClick={copyLink}
                        className="flex items-center gap-4 w-full px-4 py-3 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-300 font-sans text-xs tracking-[0.25em] uppercase"
                    >
                        {copied ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                        )}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full text-white/20 hover:text-white/50 text-[10px] tracking-[0.4em] uppercase font-sans transition-colors pt-1"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    )
}

export default function Outro() {
    const [showModal, setShowModal] = useState(false)

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
                        onClick={() => setShowModal(true)}
                        className="text-gray-600 hover:text-gray-400 transition-colors text-[10px] tracking-[0.4em] uppercase font-sans flex items-center gap-2"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="9.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="2.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                            <line x1="3.9" y1="5.25" x2="8.1" y2="3.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="3.9" y1="6.75" x2="8.1" y2="8.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Share this experience
                    </button>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-10 text-gray-600 text-xs tracking-widest text-center">
                © {new Date().getFullYear()} All Rights Reserved — For educational purposes only
            </div>

            <AnimatePresence>
                {showModal && <ShareModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </section>
    )
}
