import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://abhaygrt.in',
            lastModified: new Date('2026-06-27'),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://abhaygrt.in/serene',
            lastModified: new Date('2026-06-27'),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://abhaygrt.in/talk',
            lastModified: new Date('2026-06-27'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]
}
