import { NextRequest } from 'next/server'

const FISH_API_KEY = process.env.FISH_AUDIO_API_KEY!
const VOICE_ID = '1f51bb552a924f89837c80d6c1b11e03'

export async function POST(req: NextRequest) {
    const { text } = await req.json()
    if (!text || !FISH_API_KEY) return new Response('Missing config', { status: 400 })

    const clean = text.replace(/[*_~`#]/g, '').slice(0, 1000)

    const res = await fetch('https://api.fish.audio/v1/tts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FISH_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: clean,
            reference_id: VOICE_ID,
            format: 'mp3',
            mp3_bitrate: 128,
            latency: 'normal',
        }),
    })

    if (!res.ok) return new Response('Fish Audio error', { status: res.status })

    return new Response(res.body, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache',
        },
    })
}
