import { NextRequest } from 'next/server'

const SARVAM_API_KEY = process.env.SARVAM_API_KEY!

export async function POST(req: NextRequest) {
    const { text } = await req.json()
    if (!text || !SARVAM_API_KEY) return new Response('Missing config', { status: 400 })

    // Sarvam has a 500 char limit per request — split if needed
    const clean = text.replace(/[*_~`#]/g, '').trim()
    const chunks = splitIntoChunks(clean, 500)

    const audioBuffers: Buffer[] = []

    for (const chunk of chunks) {
        const res = await fetch('https://api.sarvam.ai/text-to-speech', {
            method: 'POST',
            headers: {
                'api-subscription-key': SARVAM_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: [chunk],
                target_language_code: 'en-IN',
                speaker: 'amol',
                pace: 0.9,
                loudness: 1.5,
                speech_sample_rate: 22050,
                enable_preprocessing: true,
                model: 'bulbul:v1',
            }),
        })

        if (!res.ok) continue

        const data = await res.json()
        if (data.audios?.[0]) {
            const base64 = data.audios[0]
            audioBuffers.push(Buffer.from(base64, 'base64'))
        }
    }

    if (audioBuffers.length === 0) {
        return new Response('TTS failed', { status: 500 })
    }

    const combined = Buffer.concat(audioBuffers)

    return new Response(combined, {
        headers: {
            'Content-Type': 'audio/wav',
            'Cache-Control': 'no-cache',
        },
    })
}

function splitIntoChunks(text: string, maxLen: number): string[] {
    const chunks: string[] = []
    const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text]
    let current = ''

    for (const sentence of sentences) {
        if ((current + sentence).length > maxLen) {
            if (current) chunks.push(current.trim())
            current = sentence
        } else {
            current += sentence
        }
    }
    if (current.trim()) chunks.push(current.trim())
    return chunks
}
