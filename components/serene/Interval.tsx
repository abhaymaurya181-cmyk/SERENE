'use client'

import { motion } from 'framer-motion'

export default function Interval() {
    return (
        <section className="h-screen bg-black flex items-center justify-center relative z-20">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-center"
            >
                <p className="text-white text-xl md:text-3xl font-display tracking-[0.2em] italic">
                    Everything that is broken can be mended.
                </p>
            </motion.div>
        </section>
    )
}
