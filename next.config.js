/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'blog.zauberfunken.com',  // Strato WordPress-Installation
      'images.unsplash.com',    // Fallback-Bilder von Unsplash
      'secure.gravatar.com'     // Gravatar-Bilder
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'blog.zauberfunken.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.zauberfunken.com',
        pathname: '/**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    minimumCacheTTL: 60,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  experimental: {
    // Aktiviere Turbopack für schnellere Entwicklung
    turbo: {
      // Turbopack-Konfiguration hier
    },
  }
};

module.exports = nextConfig;
