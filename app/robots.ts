import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // بنمنع جوجل يدخل على ملفات الـ API بتاعتك
    },
   sitemap: 'https://match-kora.vercel.app/sitemap.xml',
  }
}