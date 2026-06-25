'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Montage() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
    const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

    return (
        <section ref={ref} className="min-h-screen bg-[#050510] relative overflow-hidden py-32">
            <div className="container mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-6xl text-white font-serif text-center mb-20"
                >
                    Memories of Paradise
                </motion.h2>

                {/* Cinematic Rows */}
                <div className="space-y-12">
                    {/* Row 1 */}
                    <motion.div style={{ x: x1 }} className="flex gap-8 w-[150%] -ml-[25%]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-1/3 aspect-video bg-gray-800 rounded-lg overflow-hidden relative group">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/${i}.jpeg)` }} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        ))}
                    </motion.div>

                    {/* Row 2 */}
                    <motion.div style={{ x: x2 }} className="flex gap-8 w-[150%] -ml-[25%]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-1/3 aspect-video bg-gray-800 rounded-lg overflow-hidden relative group">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/${i + 3}.jpeg)` }} />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Golden Hour Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-purple-500/10 pointer-events-none mix-blend-overlay" />
        </section>
    )
}
