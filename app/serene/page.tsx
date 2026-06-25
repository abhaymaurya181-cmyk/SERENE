'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Intro from '@/components/serene/Intro'
import Galaxy from '@/components/serene/Galaxy'
import Episode from '@/components/serene/Episode'
import Interval from '@/components/serene/Interval'
import Montage from '@/components/serene/Montage'
import Outro from '@/components/serene/Outro'

import AudioManager, { AudioManagerRef } from '@/components/serene/AudioManager'

export default function SerenePage() {
    const [introComplete, setIntroComplete] = useState(false)
    const [activeVideoId, setActiveVideoId] = useState<number | null>(null)
    const [shouldPlayAudio, setShouldPlayAudio] = useState(false)
    const audioManagerRef = useRef<AudioManagerRef>(null)

    const handleIntroComplete = (userInteracted?: boolean) => {
        setIntroComplete(true)
        // Set flag to trigger audio play
        if (userInteracted) {
            // User clicked - this is a real interaction, play immediately
            setShouldPlayAudio(true)
        } else {
            // Auto-completed - try to play but may be blocked
            setTimeout(() => setShouldPlayAudio(true), 300)
        }
    }

    // Trigger audio play when flag is set and AudioManager is ready
    useEffect(() => {
        if (shouldPlayAudio && audioManagerRef.current) {
            audioManagerRef.current.playAudio().catch(() => { })
            setShouldPlayAudio(false)
        }
    }, [shouldPlayAudio])

    const episodes = [
        {
            title: "AWAKENING IN GOA",
            subtitle: "During a seminar, Dr. Jahangir Khan humorously addresses the stigma around mental health. Through jokes about being called “crazy” and mistaken for a gynecologist, he exposes how society hides emotional struggles as if the mind isn’t even part of the body.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter1.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip01.mp4"
        },
        {
            title: "FEAR OF REJECTION",
            subtitle: "During Kaira’s first therapy session, she hides her pain behind jokes until Dr. Jahangir gently disarms her with humor of his own.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter5.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip02.mp4"
        },
        {
            title: "THE CHAIR THEORY",
            subtitle: "Kaira opens up about a disturbing dream that leaves her feeling dirty and ashamed, but Dr. Jahangir gently reframes her self-image with humor and empathy.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter1.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip03.mp4"
        },
        {
            title: "THE BEACH SESSION",
            subtitle: "Kaira and Dr. Jahangir break conventions by holding therapy on the beach, where childhood memories and family wounds quietly surface.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter5.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip04.mp4"
        },
        {
            title: "RUMI, THE UNSETTLING COMFORT",
            subtitle: "Kaira speaks of Rumi—her new chair, her fleeting comfort, her quiet irritation. She finds herself drawn to him and disturbed by him in equal measure, especially by his endless tales woven through music.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter5.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip05.mp4"
        },
        {
            title: "IMPORTANCE OF FIVE PEOPLE",
            subtitle: "As Kaira reflects on Rumi, she admits the question he asked left her uneasy. Dr. Jahangir listens, then gently introduces the idea of the five people who shape her inner world—those she leans on, and those she runs from.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter1.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip06.mp4"
        },
        {
            title: "FLOATING MEMORIES",
            subtitle: "On a leisurely cycle ride, Kaira declares that the Rumi chapter has ended. But as the road stretches on, Dr. Jahangir turns the conversation inward, asking about his own fears—letting vulnerability travel both ways.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter5.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip07.mp4"
        },
        {
            title: "THE TURNING POINT",
            subtitle: "Kaira finally names her deepest fear. This time, Dr. Jahangir doesn’t soften the edges—he speaks plainly, urging her to step into the situation as an adult, to face it not with dread, but with clarity.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter1.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip08.mp4"
        },
        {
            title: "THE FERRY RIDE",
            subtitle: "On a ferry ride, Kaira opens up about her struggles with men. Dr. Jahangir responds with sharp insight and gentle wisdom, peeling back the layers of the issue and offering her a new lens through which to see it.",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter5.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip09.mp4"
        },
        {
            title: "THE LAST SESSION",
            subtitle: "In their final session, questions linger—has Kaira passed or failed? Dr. Jahangir speaks of her future, of challenges yet to come, and of the courage she now carries. As they part, one question remains unspoken: did Kaira find more than healing—did she find a feeling she wasn’t expecting?",
            imagePath: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/chapter1.png",
            videoUrl: "https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/clip10.mp4"
        }
    ]

    const handleEpisodeEnd = (index: number) => {
        const nextId = index + 1 < episodes.length ? `episode-${index + 1}` : 'interval-section'
        document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return (
        <main className="bg-black min-h-screen text-white overflow-x-hidden snap-y snap-mandatory relative">
            {/* Always render AudioManager so ref is available, but hide button until intro completes */}
            <AudioManager
                ref={audioManagerRef}
                forcePause={activeVideoId !== null}
                autoPlay={false}
                showButton={introComplete}
            />

            <AnimatePresence>
                {!introComplete && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="fixed inset-0 z-50"
                    >
                        <Intro
                            onComplete={handleIntroComplete}
                            onUserClick={() => {
                                // Call playAudio immediately in the click context
                                if (audioManagerRef.current) {
                                    audioManagerRef.current.playAudio().catch(() => { })
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {introComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >

                    {/* Scene 2: Galaxy */}
                    <Galaxy onComplete={() => {
                        const firstEpisode = document.getElementById('episode-0')
                        if (firstEpisode) {
                            firstEpisode.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                    }} />

                    {/* Scenes 3-12: Episodes */}
                    <div className="relative z-10">
                        {episodes.map((ep, index) => (
                            <div key={index} id={`episode-${index}`} className="snap-start">
                                <Episode
                                    chapterNumber={index + 1}
                                    title={ep.title}
                                    subtitle={ep.subtitle}
                                    imagePath={ep.imagePath}
                                    videoUrl={ep.videoUrl}
                                    onPlay={() => setActiveVideoId(index)}
                                    onStop={() => setActiveVideoId(null)}
                                    onEnded={() => handleEpisodeEnd(index)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Scene 13: Interval */}
                    <div id="interval-section" className="snap-start">
                        <Interval />
                    </div>

                    {/* Scene 14: Montage */}
                    <div className="snap-start">
                        <Montage />
                    </div>

                    {/* Scene 15: Outro */}
                    <div className="snap-start">
                        <Outro />
                    </div>
                </motion.div>
            )}
        </main>
    )
}
