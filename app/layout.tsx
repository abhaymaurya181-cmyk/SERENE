import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'SERENE - A Cinematic Experience',
    description: 'A love letter to cinema, Goa, and Jahangir Khan.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased font-sans">{children}</body>
        </html>
    )
}
