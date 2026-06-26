'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

const OPENING_MESSAGE = `Aao, baitho.

Main Jahangir Khan hoon. Jug bolte hain mujhe — zyaadatar log eventually yahi kehte hain.

Yahan answers nahi milenge — mere paas bhi nahi hain sab. Par ek baat hai... sun'ne ka time hai mere paas. Aur kuch sawaal bhi.

Kya chal raha hai?`

function fallbackSpeak(text: string) {
    const voices = window.speechSynthesis.getVoices()
    const preferred = ['Google UK English Male', 'Microsoft George', 'Microsoft David']
    let voice = null
    for (const name of preferred) {
        voice = voices.find(v => v.name.includes(name)) ?? null
        if (voice) break
    }
    if (!voice) voice = voices.find(v => v.lang.startsWith('en')) ?? null

    const utt = new SpeechSynthesisUtterance(text)
    if (voice) utt.voice = voice
    utt.rate = 0.88
    utt.pitch = 0.92
    window.speechSynthesis.speak(utt)
}

export default function TalkPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: OPENING_MESSAGE }
    ])
    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingContent, setStreamingContent] = useState('')
    const [voiceEnabled, setVoiceEnabled] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingContent])

    useEffect(() => {
        return () => {
            audioRef.current?.pause()
            window.speechSynthesis.cancel()
        }
    }, [])

    const speakText = useCallback(async (text: string) => {
        if (!voiceEnabled) return

        // Stop anything playing
        audioRef.current?.pause()
        audioRef.current = null
        window.speechSynthesis.cancel()

        setIsSpeaking(true)
        try {
            const res = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            })

            if (!res.ok) throw new Error('voice api failed')

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const audio = new Audio(url)
            audioRef.current = audio

            audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); audioRef.current = null }
            audio.onerror = () => { setIsSpeaking(false); URL.revokeObjectURL(url); audioRef.current = null }
            audio.play()
        } catch {
            // Fallback to browser TTS if Fish Audio fails
            fallbackSpeak(text)
            setIsSpeaking(false)
        }
    }, [voiceEnabled])

    const stopSpeaking = useCallback(() => {
        audioRef.current?.pause()
        audioRef.current = null
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
    }, [])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        const text = input.trim()
        if (!text || isStreaming) return

        stopSpeaking()

        const userMessage: Message = { role: 'user', content: text }
        const history = [...messages, userMessage]
        setMessages(history)
        setInput('')
        setIsStreaming(true)
        setStreamingContent('')

        if (textareaRef.current) textareaRef.current.style.height = 'auto'

        try {
            const res = await fetch('/api/talk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: history.map(m => ({ role: m.role, content: m.content }))
                }),
            })

            if (!res.ok) throw new Error('API error')

            const reader = res.body!.getReader()
            const decoder = new TextDecoder()
            let accumulated = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                accumulated += decoder.decode(value)
                setStreamingContent(accumulated)
            }

            setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
            setStreamingContent('')
            if (accumulated) speakText(accumulated)
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong on my end. Give it a moment and try again.'
            }])
            setStreamingContent('')
        } finally {
            setIsStreaming(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const autoResize = () => {
        const ta = textareaRef.current
        if (!ta) return
        ta.style.height = 'auto'
        ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
    }

    const toggleVoice = () => {
        if (voiceEnabled) stopSpeaking()
        setVoiceEnabled(v => !v)
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <Link
                    href="/serene"
                    className="text-gray-600 hover:text-gray-400 transition-colors text-xs tracking-[0.3em] uppercase font-sans"
                >
                    ← Back
                </Link>
                <div className="text-center">
                    <h1 className="text-white tracking-[0.4em] text-sm font-serif uppercase">
                        Jahangir Khan
                    </h1>
                    <p className="text-gray-600 text-[10px] tracking-[0.3em] uppercase font-sans mt-0.5">
                        Brain Doctor · Goa
                    </p>
                </div>

                {/* Voice toggle */}
                <button
                    onClick={toggleVoice}
                    title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
                    className={`w-16 flex justify-end transition-opacity ${voiceEnabled ? 'opacity-100' : 'opacity-30'} hover:opacity-100`}
                >
                    {isSpeaking ? (
                        <div className="flex items-center gap-[2px] h-4">
                            {[0.6, 1, 0.7, 1.2, 0.5].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-[2px] bg-white rounded-full"
                                    animate={{ scaleY: [h * 0.5, h, h * 0.5] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                                    style={{ height: '16px', transformOrigin: 'center' }}
                                />
                            ))}
                        </div>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1v14M4 4v8M12 4v8M1 7v2M15 7v2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="max-w-[85%]">
                                        <p className="text-gray-500 text-[9px] tracking-[0.3em] uppercase font-sans mb-2 ml-1">
                                            Jug
                                        </p>
                                        <div className="text-gray-200 text-sm md:text-base leading-relaxed font-serif whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-[75%]">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 text-gray-300 text-sm leading-relaxed font-sans whitespace-pre-wrap">
                                            {msg.content}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Streaming */}
                    {isStreaming && streamingContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start mb-6"
                        >
                            <div className="max-w-[85%]">
                                <p className="text-gray-500 text-[9px] tracking-[0.3em] uppercase font-sans mb-2 ml-1">
                                    Jug
                                </p>
                                <div className="text-gray-200 text-sm md:text-base leading-relaxed font-serif whitespace-pre-wrap">
                                    {streamingContent}
                                    <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Thinking dots */}
                    {isStreaming && !streamingContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start mb-6"
                        >
                            <div className="flex items-center gap-1.5 px-1 py-2">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-gray-600"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/5 px-4 py-4">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    <div className="flex items-end gap-3 bg-white/3 border border-white/8 rounded-2xl px-4 py-3">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={e => { setInput(e.target.value); autoResize() }}
                            onKeyDown={handleKeyDown}
                            placeholder="Say what's on your mind..."
                            rows={1}
                            disabled={isStreaming}
                            className="flex-1 bg-transparent text-gray-200 text-sm font-sans placeholder-gray-600 resize-none outline-none leading-relaxed max-h-40 disabled:opacity-50"
                            style={{ height: 'auto' }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isStreaming}
                            className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 12V2M7 2L2 7M7 2L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-gray-700 text-[9px] tracking-widest font-sans mt-3 uppercase">
                        This is not a substitute for professional mental health care
                    </p>
                </form>
            </div>
        </div>
    )
}
