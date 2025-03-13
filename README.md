# ZAUBERFUNKEN – Besondere Reisemomente als Familie

This is a multilingual travel blog website built with [Next.js](https://nextjs.org), [shadcn/ui](https://ui.shadcn.com/), and the WordPress API. The site is designed to showcase travel experiences, hotels, restaurants, podcasts, and sustainable travel content for families.

## Site Structure

The website is organized into the following main sections:

1. **Home Page** - Features a hero section and highlighted posts
2. **Erlebnisse (Experiences)** - Travel experiences and stories
3. **Hotels** - Reviews and recommendations for family-friendly hotels
4. **Restaurants** - Reviews and recommendations for family-friendly restaurants
5. **Podcast** - Travel-related podcast episodes
6. **Nachhaltiges Reisen (Sustainable Travel)** - Content focused on sustainable travel practices
7. **Über uns (About Us)** - Information about the blog and its authors

## Codebase Organization

The project follows a modern Next.js App Router structure with the following organization:

```
/src
  /app                  # Next.js App Router structure
    /[locale]           # Localized routes (de/en)
      /erlebnisse       # Experiences category page
      /hotels           # Hotels category page
      /restaurants      # Restaurants category page
      /podcast          # Podcast category page
      /nachhaltiges-reisen  # Sustainable travel static page
      /ueber-uns        # About us static page
      /post             # Dynamic post pages
        /[slug]         # Individual post route
      /page.tsx         # Home page
    /layout.tsx         # Root layout
    /not-found.tsx      # 404 page
  /components           # Reusable UI components
    /navbar.tsx         # Navigation component
    /footer.tsx         # Footer component
    /post-grid.tsx      # Grid for displaying posts
    /ui                 # shadcn/ui components
  /i18n                 # Internationalization setup
    /config.ts          # i18n configuration
    /dictionaries       # Translation dictionaries
      /de.json          # German translations
      /en.json          # English translations
  /lib                  # Utility functions and services
    /wordpress-api.ts   # WordPress API integration
  /middleware.ts        # Next.js middleware for i18n routing
```

## Key Features

- **Multilingual Support**: Full support for German and English languages
- **WordPress Integration**: Content management through WordPress API
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Dynamic Routing**: Category and post pages with dynamic content
- **SEO Optimized**: Structured for search engine visibility

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

This project is configured to be deployed directly to Vercel without creating a subfolder.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WordPress Integration

This project connects to a WordPress backend for content management. The WordPress API integration is handled in `/src/lib/wordpress-api.ts`, which provides functions for fetching:

- Posts by category
- Individual posts by slug
- Categories and taxonomies
- Media and featured images

Content creators can manage all blog content through the WordPress admin interface while the frontend is served as a fast, static Next.js application.

## Headless WordPress + Next.js Workflow

This project follows a headless CMS approach where WordPress serves as the content management system and Next.js serves as the frontend. Here's the complete workflow:

### Development Workflow

1. **Local WordPress Setup:**
   - Install WordPress locally using Local WP or similar tools
   - Install and activate the Zauberfunken Child Theme in the local WordPress installation
   - Install necessary WordPress plugins:
     - WP REST API - CORS (for cross-origin requests)
     - JWT Authentication for WP REST API (optional for protected content)
     - ACF to REST API (if using Advanced Custom Fields)
     - WP REST Cache (for better API performance)

2. **Local Next.js Development:**
   - Configure the Next.js frontend to use the local WordPress API during development
   - Create environment variables to switch between development and production API URLs
   - Test all features against the local WordPress installation

3. **Version Control:**
   - Maintain both the WordPress Child Theme and Next.js frontend in version control
   - Keep separate repositories or folders for the WordPress theme and Next.js code

### Deployment Workflow

1. **WordPress Theme Deployment:**
   - Zip the Child Theme folder
   - Upload and activate it on the production WordPress installation (hosted on Strato)
   - Ensure all required plugins are installed and activated on the production site

2. **Next.js Frontend Deployment:**
   - Configure environment variables in Vercel to point to the production WordPress API
   - Deploy the Next.js frontend to Vercel
   - Set up any required redirects or custom domains

### Content Management Workflow

1. Client creates and manages content in the WordPress admin interface on the Strato hosting
2. The Next.js frontend fetches this content via the WordPress REST API
3. Content is displayed on the Next.js frontend hosted on Vercel

### Environment Configuration

Create a `.env.local` file in your Next.js project root with the following variables:

```
# Development (Local WordPress)
NEXT_PUBLIC_WORDPRESS_API_URL=http://zauberfunkenblog.local/wp-json/wp/v2

# Production (Strato WordPress)
# NEXT_PUBLIC_WORDPRESS_API_URL=https://blog.zauberfunken.com/wp-json/wp/v2
```

Then update your WordPress API utility to use this environment variable:

```typescript
// In src/lib/wordpress-api.ts
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://blog.zauberfunken.com/wp-json/wp/v2';
```

This setup allows for seamless switching between development and production environments.
