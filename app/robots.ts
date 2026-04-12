import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // بنمنع جوجل يدخل على ملفات الـ API بتاعتك
    },
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}