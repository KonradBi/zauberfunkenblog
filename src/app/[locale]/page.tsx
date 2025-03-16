import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPosts, WordPressPost } from '@/lib/wordpress-api';
import { Button } from '@/components/ui/button';
import { ParallaxHeader } from '@/components/parallax-header';
import { ParallaxQuote } from '@/components/parallax-quote';
import { AuthorWidget } from '@/components/author-widget';
import { MotionCard } from '@/components/motion-wrapper';

// Function to get the appropriate icon based on the category
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
    // Default icon for all other categories
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
  // Unwrap the params Promise
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  // Fetch posts
  console.log(`Fetching posts for homepage (locale: ${locale})`);
  const allPosts = await getPosts(undefined, 1, 6, locale);
  const posts = Array.isArray(allPosts) ? allPosts : [];
  
  // Prepare featured post and regular posts
  let featuredPost = null;
  let regularPosts: WordPressPost[] = [];
  
  if (posts.length > 0) {
    // For simplicity, use the first post as featured
    featuredPost = posts[0];
    // Use the rest of the posts for the regular posts section
    regularPosts = posts.slice(1, 5);
  }
  
  console.log(`Retrieved ${posts.length} posts, Featured: ${featuredPost?.id}, Regular: ${regularPosts.length}`);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section with Parallax Effect */}
      <ParallaxHeader
        title={dictionary.home.hero.title || "Unvergessliche Reiseerlebnisse entdecken"}
        subtitle={dictionary.home.hero.subtitle || "Authentische Abenteuer und einzigartige Momente, die deine Reise zum Erlebnis machen"}
        backgroundImage="/images/boats-2835848_1920.jpg"
        buttons={
          <div className="flex flex-row justify-center gap-4">
            <Button 
              asChild
              className="bg-white/90 hover:bg-white text-primary px-6 py-3 rounded-lg text-base transition-all transform hover:scale-105 hover:translate-y-[-2px] font-medium shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
            >
              <Link href={`/${locale}/erlebnisse`}>
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {dictionary.common.navigation.experiences}
                </span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="bg-transparent hover:bg-white/20 text-white border-white/40 hover:border-white px-6 py-3 rounded-lg text-base transition-all transform hover:scale-105 hover:translate-y-[-2px] font-medium shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <Link href={`/${locale}/nachhaltiges-reisen`}>
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {dictionary.common.navigation.sustainable}
                </span>
              </Link>
            </Button>
          </div>
        }
      />
      
      {/* Featured Post Section */}
      {featuredPost && (
        <section className="w-full py-16 md:py-20 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-start justify-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-900">
                  {dictionary.home.featured}
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-5px]" style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              transform: 'perspective(1000px) rotateX(0deg)'
            }}>
              <div className="lg:col-span-7 relative overflow-hidden h-full min-h-[300px]">
                {featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.alt_text || featuredPost.title.rendered}
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-110"
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Kein Bild verfügbar</span>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5 p-6 lg:p-8 bg-gradient-to-b from-white to-gray-50 h-full">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    {dictionary.common.featuredPost}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight lg:text-3xl text-primary-900">
                    <span dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }} />
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(featuredPost.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div 
                    className="text-base text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: featuredPost.excerpt.rendered }}
                  />
                </div>
                <Button className="w-fit mt-6 hover:bg-primary hover:translate-y-[-2px] transition-all duration-300 shadow-md hover:shadow-lg" size="lg" asChild>
                  <Link href={`/${locale}/post/${featuredPost.slug}`}>
                    {dictionary.common.readMore}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Inspirational Quote with Parallax Effect */}
      <ParallaxQuote 
        quote={locale === 'de' ? 
          "Die Welt ist ein Buch, und wer nicht reist, liest nur eine Seite davon." : 
          "The world is a book, and those who do not travel read only one page."}
        author={locale === 'de' ? "Augustinus Aurelius" : "Saint Augustine"}
        backgroundImage="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1920&auto=format&fit=crop"
        locale={locale}
      />
      
      {/* Regular Posts Section */}
      <section className="w-full py-16 md:py-24 bg-white/80 backdrop-blur-sm">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-start justify-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-900">
                {dictionary.common.latestPosts}
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                {dictionary.common.exploreMore}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {regularPosts.length > 0 ? regularPosts.slice(0, 4).map((post, index) => (
              <MotionCard key={post.id} index={index}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform hover:translate-y-[-5px]" style={{
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                }}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                      <Image
                        src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                        alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Kein Bild verfügbar</span>
                      </div>
                    )}
                    
                    {/* Kategorie-Badge */}
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 backdrop-blur-sm text-primary border border-primary/10 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-105">
                          {getCategoryIcon(post._embedded?.['wp:term']?.[0]?.[0]?.name)}
                          {post._embedded?.['wp:term']?.[0]?.[0]?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(post.date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 text-primary-900">
                      <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </h3>
                    <div 
                      className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow"
                      dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                    />
                    <Button asChild variant="outline" className="w-fit mt-auto hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                      <Link href={`/${locale}/post/${post.slug}`}>
                        {dictionary.common.readMore}
                      </Link>
                    </Button>
                  </div>
                </div>
              </MotionCard>
            )) : posts.length === 0 ? (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">{dictionary.common.noPosts || 'Keine Beiträge gefunden'}</p>
              </div>
            ) : null}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" asChild className="hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              <Link href={`/${locale}/erlebnisse`}>
                {dictionary.common.allPosts}
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
