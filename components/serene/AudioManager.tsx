'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { motion } from 'framer-motion'

export interface AudioManagerRef {
    playAudio: () => Promise<void>
    pauseAudio: () => void
}

const AudioManager = forwardRef<AudioManagerRef, { forcePause?: boolean; autoPlay?: boolean; showButton?: boolean }>(
    ({ forcePause, autoPlay = false, showButton = true }, ref) => {
        const audioRef = useRef<HTMLAudioElement>(null)
        const [isPlaying, setIsPlaying] = useState(false)
        const [hasInteracted, setHasInteracted] = useState(false)
        const [userPaused, setUserPaused] = useState(false) // Track if user manually paused

        // Expose play/pause methods via ref
        useImperativeHandle(ref, () => ({
            playAudio: async () => {
                const audio = audioRef.current
                if (!audio) return
                try {
                    await audio.play()
                    setIsPlaying(true)
                    setHasInteracted(true)
                    setUserPaused(false)
                } catch (err) {
                    console.log("Play failed:", err)
                }
            },
            pauseAudio: () => {
                const audio = audioRef.current
                if (!audio) return
                audio.pause()
                setIsPlaying(false)
                setUserPaused(true)
            }
        }), [])

        // Sync state with actual audio playback
        useEffect(() => {
            const audio = audioRef.current
            if (!audio) return

            const handlePlay = () => setIsPlaying(true)
            const handlePause = () => setIsPlaying(false)
            const handleEnded = () => setIsPlaying(false)

            audio.addEventListener('play', handlePlay)
            audio.addEventListener('pause', handlePause)
            audio.addEventListener('ended', handleEnded)

            return () => {
                audio.removeEventListener('play', handlePlay)
                audio.removeEventListener('pause', handlePause)
                audio.removeEventListener('ended', handleEnded)
            }
        }, [])

        // Handle force pause (when video is playing)
        useEffect(() => {
            const audio = audioRef.current
            if (!audio) return

            if (forcePause) {
                if (!audio.paused) {
                    audio.pause()
                }
            } else if (!forcePause && !userPaused && hasInteracted) {
                // Resume if not user-paused and user has interacted
                audio.play().catch(() => { })
            }
        }, [forcePause, userPaused, hasInteracted])

        // Auto-play when intro completes
        useEffect(() => {
            const audio = audioRef.current
            if (!audio) return

            if (autoPlay && !hasInteracted && !forcePause && !userPaused) {
                const attemptPlay = async () => {
                    try {
                        await audio.play()
                        setIsPlaying(true)
                        setHasInteracted(true)
                    } catch (err) {
                        // Autoplay blocked - will wait for user interaction
                        console.log("Autoplay blocked, waiting for interaction")
                    }
                }
                // Small delay to ensure audio element is ready
                const timer = setTimeout(attemptPlay, 200)
                return () => clearTimeout(timer)
            }
        }, [autoPlay, forcePause, hasInteracted, userPaused])

        // Listen for user interactions to enable audio
        useEffect(() => {
            const audio = audioRef.current
            if (!audio) return

            const handleInteraction = async () => {
                if (!hasInteracted && !forcePause && !userPaused) {
                    try {
                        await audio.play()
                        setIsPlaying(true)
                        setHasInteracted(true)
                    } catch (err) {
                        console.log("Play failed on interaction:", err)
                    }
                }
            }

            // Listen for any user interaction to enable audio
            window.addEventListener('click', handleInteraction, { once: true, passive: true })
            window.addEventListener('scroll', handleInteraction, { once: true, passive: true })
            window.addEventListener('keydown', handleInteraction, { once: true, passive: true })
            window.addEventListener('touchstart', handleInteraction, { once: true, passive: true })

            return () => {
                window.removeEventListener('click', handleInteraction)
                window.removeEventListener('scroll', handleInteraction)
                window.removeEventListener('keydown', handleInteraction)
                window.removeEventListener('touchstart', handleInteraction)
            }
        }, [hasInteracted, forcePause, userPaused])

        // Preload audio when component mounts
        useEffect(() => {
            const audio = audioRef.current
            if (audio) {
                audio.preload = 'auto'
                // Try to load the audio
                audio.load()
            }
        }, [])

        return (
            <div className="fixed bottom-8 right-8 z-50">
                <audio
                    ref={audioRef}
                    src="https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/music.mp3"
                    loop
                    preload="auto"
                />

                {showButton && (
                    <div className="flex items-center gap-4">
                        {!isPlaying && !hasInteracted && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium"
                            >
                                Tap to unmute
                            </motion.div>
                        )}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={async () => {
                                const audio = audioRef.current
                                if (!audio) return

                                if (isPlaying) {
                                    // User wants to pause
                                    audio.pause()
                                    setUserPaused(true)
                                    setIsPlaying(false)
                                } else {
                                    // User wants to play
                                    setUserPaused(false)
                                    setHasInteracted(true)
                                    try {
                                        await audio.play()
                                        setIsPlaying(true)
                                    } catch (err) {
                                        console.log("Play failed:", err)
                                        setIsPlaying(false)
                                    }
                                }
                            }}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        )
    })

AudioManager.displayName = 'AudioManager'

export default AudioManager
