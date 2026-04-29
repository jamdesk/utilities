import { tools, LAST_REVIEWED } from '@/lib/tools'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.jamdesk.com/utilities'
  const lastModified = new Date(LAST_REVIEWED)
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mdx-cheatsheet`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mdx-vs-markdown`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...tools.map((tool) => ({
      url: `${baseUrl}/${tool.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
