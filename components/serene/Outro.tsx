'use client'

import { motion } from 'framer-motion'

export default function Outro() {
    return (
        <section className="h-screen bg-black flex flex-col items-center justify-center relative z-20 text-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
                className="space-y-8"
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
            </motion.div>

            <div className="absolute bottom-10 text-gray-600 text-xs tracking-widest">
                © {new Date().getFullYear()} All Rights Reserved
            </div>
        </section>
    )
}
