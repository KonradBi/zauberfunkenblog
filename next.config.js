/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'blog.zauberfunken.com',  // Strato WordPress-Installation
      'images.unsplash.com'     // Fallback-Bilder von Unsplash
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'blog.zauberfunken.com',
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
