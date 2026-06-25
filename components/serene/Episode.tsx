'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface EpisodeProps {
    title: string
    subtitle: string
    videoUrl?: string
    imagePath?: string
    chapterNumber: number
    onPlay?: () => void
    onStop?: () => void
    onEnded?: () => void
}

export default function Episode({ title, subtitle, videoUrl, imagePath, chapterNumber, onPlay, onStop, onEnded }: EpisodeProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const containerRef = useRef<HTMLElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const isInView = useInView(containerRef, { amount: 0.6 }) // Reset when 40% is out of view

    useEffect(() => {
        if (!isInView && isPlaying) {
            setIsPlaying(false)
            onStop?.()
        }
    }, [isInView, isPlaying, onStop])

    // Handle video play/pause and end events
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        // Sync video playback with isPlaying state
        if (isPlaying) {
            video.play().catch(() => { })
        } else {
            video.pause()
        }

        const handleEnded = () => {
            setIsPlaying(false)
            onStop?.()
            onEnded?.()
        }

        video.addEventListener('ended', handleEnded)
        return () => {
            video.removeEventListener('ended', handleEnded)
        }
    }, [isPlaying, onStop])

    const handlePlay = (e?: React.MouseEvent) => {
        // Don't trigger if clicking on video controls
        if (e && (e.target as HTMLElement).closest('video')) {
            return
        }
        if (!isPlaying) {
            setIsPlaying(true)
            onPlay?.()

            // Fire GTM event
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                event: 'video_play',
                video_chapter: chapterNumber,
                video_title: title,
            })

            // Scroll video into viewport when it starts playing
            if (containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }

    const handleVideoClick = (e: React.MouseEvent) => {
        // Stop propagation to prevent triggering handlePlay when clicking video controls
        e.stopPropagation()
    }

    return (
        <section
            ref={containerRef}
            className="h-screen relative bg-black flex items-center justify-center overflow-hidden cursor-pointer group"
            onClick={handlePlay}
        >
            {/* Video Layer (Bottom) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isPlaying ? 1 : 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-0"
            >
                {videoUrl ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={videoUrl}
                        muted={false}
                        loop
                        playsInline
                        controls
                        controlsList="nodownload"
                        onClick={handleVideoClick}
                        onMouseDown={handleVideoClick}
                        ref={videoRef}
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imagePath})` }}
                    />
                )}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </motion.div>

            {/* Text Layer (Top) */}
            <motion.div
                animate={{ opacity: isPlaying ? 0 : 1, pointerEvents: isPlaying ? 'none' : 'auto' }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
            >
                <p className="text-purple-300 tracking-[0.4em] text-xs md:text-sm uppercase mb-6 font-sans font-semibold">
                    Chapter {chapterNumber}
                </p>
                <h2 className="text-5xl md:text-8xl font-bold text-white mb-8 font-serif tracking-wider group-hover:scale-105 transition-transform duration-1000 drop-shadow-lg">
                    {title}
                </h2>
                <p className="text-gray-200 text-xl md:text-3xl font-display italic leading-relaxed max-w-2xl mx-auto">
                    {subtitle}
                </p>
                <div className="mt-12 flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[10px] text-white tracking-[0.3em] uppercase animate-pulse font-sans">
                        Click to Experience
                    </p>
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </motion.div>
        </section>
    )
}
