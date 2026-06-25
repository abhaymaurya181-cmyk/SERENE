import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
    title: 'SERENE — A Cinematic Experience',
    description: 'A love letter to cinema, Goa, and Jahangir Khan. An immersive cinematic journey through Dear Zindagi.',
    keywords: ['SERENE', 'Dear Zindagi', 'Jahangir Khan', 'cinematic', 'SRK', 'Shah Rukh Khan'],
    authors: [{ name: 'Abhay' }],
    creator: 'Abhay',
    metadataBase: new URL('https://abhaygrt.in'),
    openGraph: {
        title: 'SERENE — A Cinematic Experience',
        description: 'A love letter to cinema, Goa, and Jahangir Khan.',
        type: 'website',
        url: 'https://abhaygrt.in',
        locale: 'en_US',
        images: [
            {
                url: 'https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/og-image.jpeg',
                width: 1200,
                height: 630,
                alt: 'SERENE — A Cinematic Experience',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SERENE — A Cinematic Experience',
        description: 'A love letter to cinema, Goa, and Jahangir Khan.',
        images: ['https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/og-image.jpeg'],
    },
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon.ico' },
        ],
        apple: [
            { url: '/apple-touch-icon.png' },
        ],
        other: [
            { rel: 'manifest', url: '/site.webmanifest' },
        ],
    },
    themeColor: '#000000',
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': 'https://abhaygrt.in/#website',
            url: 'https://abhaygrt.in',
            name: 'SERENE',
            description: 'A love letter to cinema, Goa, and Jahangir Khan.',
            author: {
                '@type': 'Person',
                name: 'Abhay',
            },
        },
        {
            '@type': 'CreativeWork',
            '@id': 'https://abhaygrt.in/#creative-work',
            name: 'SERENE — A Cinematic Experience',
            description: 'An immersive cinematic journey through Dear Zindagi, exploring 10 chapters of healing, therapy, and self-discovery with Dr. Jahangir Khan.',
            url: 'https://abhaygrt.in/serene',
            creator: {
                '@type': 'Person',
                name: 'Abhay',
            },
            about: [
                { '@type': 'Thing', name: 'Dear Zindagi' },
                { '@type': 'Thing', name: 'Shah Rukh Khan' },
                { '@type': 'Thing', name: 'Mental Health' },
                { '@type': 'Thing', name: 'Cinema' },
                { '@type': 'Thing', name: 'Goa' },
            ],
            image: 'https://pub-448c0393c0554348831f3e393b0c14c7.r2.dev/og-image.jpeg',
            inLanguage: 'en',
        },
    ],
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased font-sans">
                {/* GTM noscript fallback */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-5DFS5Q5J"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                {children}
            </body>
            {/* GTM script — loads after page is interactive */}
            <Script
                id="gtm"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5DFS5Q5J');`,
                }}
            />
        </html>
    )
}
