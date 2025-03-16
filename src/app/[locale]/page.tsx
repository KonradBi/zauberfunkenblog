import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPosts, WordPressPost } from '@/lib/wordpress-api';
import { Button } from '@/components/ui/button';
import { ParallaxHeader } from '@/components/parallax-header';
import { ParallaxQuote } from '@/components/parallax-quote';
import { AuthorWidget } from '@/components/author-widget';

// Client-Komponenten-Wrapper für Motion-Elemente
import PostsGrid from '@/components/posts-grid';
import FeaturedPost from '@/components/featured-post';

interface Dictionary {
  home: {
    hero: {
      title: string;
      subtitle: string;
    };
    featured: string;
  };
  common: {
    navigation: {
      experiences: string;
      sustainable: string;
      hotels: string;
      restaurants: string;
      podcast: string;
    };
    featuredPost: string;
    readMore: string;
    latestPosts: string;
    exploreMore: string;
    noPosts: string;
    allPosts: string;
  };
}

// Funktion, die basierend auf der Kategorie ein passendes Icon zurückgibt
const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('hotel') || lowerCategory.includes('unterkunft')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  } else if (lowerCategory.includes('restaurant') || lowerCategory.includes('essen') || lowerCategory.includes('food')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (lowerCategory.includes('erlebnis') || lowerCategory.includes('experience') || lowerCategory.includes('abenteuer')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  } else if (lowerCategory.includes('nachhaltig') || lowerCategory.includes('sustainable') || lowerCategory.includes('eco')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else {
    // Standard-Icon für alle anderen Kategorien
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    );
  }
};

interface HomePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  // Unwrap the params Promise using await
  const { locale } = await params;
  
  // Fetch data server-side
  const dictionary = await getDictionary(locale);
  
  // Fetch posts from the WordPress API
  const fetchedPosts = await getPosts(undefined, 1, 6, locale);
  const posts = Array.isArray(fetchedPosts) ? fetchedPosts : [];
  
  // Extract featured post and regular posts
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 0 ? posts.slice(1) : [];
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <ParallaxHeader
        title={dictionary.home.hero.title}
        subtitle={dictionary.home.hero.subtitle}
        buttons={
          <div className="flex flex-col gap-4 mt-8">
            <Button asChild variant="default" className="px-6 py-6 text-lg bg-white/90 backdrop-blur-sm hover:bg-white text-primary border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-xl group">
              <Link href={`/${locale}/erlebnisse`} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {dictionary.common.navigation.experiences}
              </Link>
            </Button>
            <Button asChild variant="outline" className="px-6 py-6 text-lg bg-transparent hover:bg-white/90 text-white hover:text-primary border border-white/30 hover:border-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 font-medium rounded-xl group">
              <Link href={`/${locale}/nachhaltig`} className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {dictionary.common.navigation.sustainable}
              </Link>
            </Button>
          </div>
        }
        backgroundImage="/images/hero1.jpg"
      />
      
      <main className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{dictionary.home.featured}</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>
          
          {/* Featured Post Component */}
          <FeaturedPost
            post={featuredPost}
            locale={locale}
            dictionary={{
              featuredPost: dictionary.common.featuredPost,
              readMore: dictionary.common.readMore
            }}
          />
          
          {/* Regular Posts Grid Component */}
          <PostsGrid
            posts={posts}
            locale={locale}
            dictionary={{
              readMore: dictionary.common.readMore,
              latestPosts: dictionary.common.latestPosts,
              noPosts: dictionary.common.noPosts,
              allPosts: dictionary.common.allPosts
            }}
          />
        </div>
      </main>
      
      {/* Inspirational Quote with Parallax Effect */}
      <ParallaxQuote 
        quote={locale === 'de' ? 
          "Die Welt ist ein Buch, und wer nicht reist, liest nur eine Seite davon." : 
          "The world is a book, and those who do not travel read only one page."}
        author={locale === 'de' ? "Augustinus Aurelius" : "Saint Augustine"}
        backgroundImage="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1920&auto=format&fit=crop"
        locale={locale}
      />
      
      {/* Reisekategorien mit verbessertem Parallax-Effekt */}
      <section className="relative py-24 overflow-hidden">
        {/* Parallax-Hintergrund mit mehreren Ebenen für einen 3D-Effekt */}
        <div className="absolute inset-0 z-0">
          {/* Hintere Ebene (bewegt sich langsamer) - Berglandschaft */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2000&auto=format&fit=crop')",
              transform: "translateY(0) scale(1.1)",
            }}
          ></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white drop-shadow-lg">
            {locale === 'de' ? 'Entdecke unsere Reisewelten' : 'Discover our travel worlds'}
          </h2>
          <div className="h-1 w-32 bg-primary/70 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Erlebnisse */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/erlebnisse`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/30 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                  {dictionary.common.navigation.experiences}
                </h3>
              </Link>
            </div>

            {/* Hotels */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/hotels`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/30 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                  {dictionary.common.navigation.hotels}
                </h3>
              </Link>
            </div>

            {/* Restaurants */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/restaurants`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/30 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                  {dictionary.common.navigation.restaurants}
                </h3>
              </Link>
            </div>

            {/* Podcast */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/podcast`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/30 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                  {dictionary.common.navigation.podcast}
                </h3>
              </Link>
            </div>

            {/* Nachhaltiges Reisen */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/nachhaltiges-reisen`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/30 group-hover:border-primary group-hover:scale-110 group-hover:shadow-lg shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300 drop-shadow-md">
                  {dictionary.common.navigation.sustainable}
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter-Anmeldung */}
      <section className="py-16 bg-gradient-to-r from-primary/15 to-primary/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-3">
                {locale === 'de' ? 'Newsletter' : 'Newsletter'}
              </span>
              <h2 className="text-3xl font-bold mb-4 text-primary-900">
                {locale === 'de' ? 'Reiseinspirationen direkt in dein Postfach' : 'Travel inspirations directly to your inbox'}
              </h2>
              <p className="text-lg mb-8 text-gray-600">
                {locale === 'de' ? 'Melde dich für unseren Newsletter an und erhalte exklusive Reiseberichte, Tipps und Angebote.' : 'Sign up for our newsletter and receive exclusive travel reports, tips and offers.'}
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-white p-2 rounded-lg shadow-md">
              <input 
                type="email" 
                placeholder={locale === 'de' ? 'Deine E-Mail-Adresse' : 'Your email address'}
                className="flex-grow px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                required
              />
              <Button type="submit" className="whitespace-nowrap shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
                {locale === 'de' ? 'Anmelden' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              {locale === 'de' ? 'Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.' : 'We respect your privacy. Unsubscribe at any time.'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Autoren-Widget */}
      <AuthorWidget 
        authorName={locale === 'de' ? "Rouven" : "Rouven"}
        authorImage="/images/Handeln6.jpeg"
        authorBio={locale === 'de' ? "Reiseblogger und Abenteurer. Ich teile meine schönsten Reisemomente und Erfahrungen aus der ganzen Welt." : "Travel blogger and adventurer. I share my most beautiful travel moments and experiences from around the world."}
        locale={locale}
        dictionary={{
          learnMore: locale === 'de' ? "Mehr erfahren" : "Learn more"
        }}
      />
    </div>
  );
}
