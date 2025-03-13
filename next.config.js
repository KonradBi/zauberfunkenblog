/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'zauberfunkenblog.local', // Lokale WordPress-Installation
      'blog.zauberfunken.com',  // Produktions-WordPress-Installation
      'images.unsplash.com'     // Fallback-Bilder von Unsplash
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'zauberfunkenblog.local',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.zauberfunken.com',
        pathname: '/wp-content/uploads/**',
      }
    ]
  },
  experimental: {
    // Aktiviere Turbopack für schnellere Entwicklung
    turbo: {
      // Turbopack-Konfiguration hier
    },
  }
};

module.exports = nextConfig;
