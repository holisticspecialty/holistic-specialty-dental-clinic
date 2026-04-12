import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://holisticspecialty.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/staff/', '/staff/portal/'], // Keep internal staff routes hidden from Google
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
