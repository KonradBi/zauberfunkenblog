import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPosts, WordPressPost } from '@/lib/wordpress-api';
// Card-Komponenten werden jetzt in der PostCard-Komponente verwendet
import { Button } from '@/components/ui/button';
import { ParallaxHeader } from '@/components/parallax-header';
import { ParallaxQuote } from '@/components/parallax-quote';
import { PostCard } from '@/components/post-card';
import { AuthorWidget } from '@/components/author-widget';

interface HomePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  
  // Fetch featured posts from WordPress
  let posts: WordPressPost[] = [];
  let featuredPost: WordPressPost | null = null;
  let regularPosts: WordPressPost[] = [];
  
  try {
    const response = await getPosts(undefined, 1, 6, locale);
    posts = Array.isArray(response) ? response : [];
    
    // Extrahiere den neuesten Beitrag als Featured Post
    if (posts.length > 0) {
      featuredPost = posts[0];
      regularPosts = posts.slice(1);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <ParallaxHeader
        title={dictionary.home.hero.title}
        subtitle={dictionary.home.hero.subtitle}
        backgroundImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
        buttons={
          <div className="space-x-4">
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-lg transition-all transform hover:scale-105 font-medium shadow-md"
            >
              <Link href={`/${locale}/erlebnisse`}>
                {dictionary.common.navigation.experiences}
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="border-white text-white bg-black/40 hover:bg-white/50 px-6 py-3 rounded-full text-lg transition-all transform hover:scale-105 font-medium shadow-md"
            >
              <Link href={`/${locale}/nachhaltiges-reisen`}>
                {dictionary.common.navigation.sustainable}
              </Link>
            </Button>
          </div>
        }
      />
      
      {/* Featured Post Section */}
      {featuredPost && (
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-start justify-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-900">
                  {dictionary.home.featured}
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="lg:col-span-7 relative aspect-[16/9] overflow-hidden">
                {featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <Image
                    src={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                    alt={featuredPost._embedded?.['wp:featuredmedia']?.[0]?.alt_text || featuredPost.title.rendered}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Kein Bild verfügbar</span>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-5 flex flex-col space-y-4 p-6 lg:p-8">
                <div className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold border-transparent bg-primary text-primary-foreground w-fit">
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
                <Button className="w-fit mt-4" size="lg" asChild>
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
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col items-start justify-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-900">
                {dictionary.common.latestPosts}
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                {dictionary.common.exploreMore}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {regularPosts.length > 0 ? regularPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                locale={locale} 
                readMoreText={dictionary.common.readMore} 
              />
            )) : posts.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">{dictionary.common.noPosts || 'Keine Beiträge gefunden'}</p>
              </div>
            ) : null}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" asChild>
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
              backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop')",
              transform: "translateY(var(--parallax-back-offset, 0)) scale(1.1)",
            }}
          ></div>
          
          {/* Dunkle Überlagerung für besseren Kontrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            {locale === 'de' ? 'Entdecke unsere Reisewelten' : 'Discover our travel worlds'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Erlebnisse */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/erlebnisse`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/20 group-hover:border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300">
                  {dictionary.common.navigation.experiences}
                </h3>
              </Link>
            </div>

            {/* Hotels */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/hotels`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/20 group-hover:border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300">
                  {dictionary.common.navigation.hotels}
                </h3>
              </Link>
            </div>

            {/* Restaurants */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/restaurants`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/20 group-hover:border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300">
                  {dictionary.common.navigation.restaurants}
                </h3>
              </Link>
            </div>

            {/* Podcast */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/podcast`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/20 group-hover:border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300">
                  {dictionary.common.navigation.podcast}
                </h3>
              </Link>
            </div>

            {/* Nachhaltiges Reisen */}
            <div className="flex flex-col items-center group">
              <Link href={`/${locale}/nachhaltiges-reisen`} className="block">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary/80 transition-all duration-300 mx-auto border border-white/20 group-hover:border-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-center text-white group-hover:text-primary transition-colors duration-300">
                  {dictionary.common.navigation.sustainable}
                </h3>
              </Link>
            </div>


          </div>
        </div>
        
        {/* JavaScript für den verbesserten Parallax-Effekt mit mehreren Ebenen */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Initiale Anwendung des Parallax-Effekts
            applyParallaxEffect();
            
            // Event-Listener für Scroll-Events
            window.addEventListener('scroll', function() {
              applyParallaxEffect();
            });
            
            // Event-Listener für Resize-Events
            window.addEventListener('resize', function() {
              applyParallaxEffect();
            });
            
            function applyParallaxEffect() {
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const parallaxSection = document.querySelector('section.relative.py-24');
              
              if (parallaxSection) {
                const sectionTop = parallaxSection.offsetTop;
                const sectionHeight = parallaxSection.offsetHeight;
                const viewportHeight = window.innerHeight;
                const viewportCenter = scrollTop + (viewportHeight / 2);
                const sectionCenter = sectionTop + (sectionHeight / 2);
                const distanceFromCenter = viewportCenter - sectionCenter;
                
                // Berechne die Position im Viewport (0 = ganz oben, 1 = ganz unten)
                const viewportPosition = (scrollTop + viewportHeight - sectionTop) / (viewportHeight + sectionHeight);
                
                // Nur anwenden, wenn der Abschnitt im oder nahe am Viewport ist
                if (scrollTop + viewportHeight > sectionTop - 300 && scrollTop < sectionTop + sectionHeight + 300) {
                  // Verschiedene Geschwindigkeiten für verschiedene Ebenen
                  const backOffset = distanceFromCenter * 0.15;
                  const midOffset = distanceFromCenter * 0.25;
                  
                  // Wende Transformationen auf die verschiedenen Ebenen an
                  const backLayer = parallaxSection.querySelector('[style*="parallax-back-offset"]');
                  const midLayer = parallaxSection.querySelector('[style*="parallax-mid-offset"]');
                  
                  if (backLayer) {
                    backLayer.style.setProperty('--parallax-back-offset', backOffset + 'px');
                  }
                  
                  if (midLayer) {
                    midLayer.style.setProperty('--parallax-mid-offset', midOffset + 'px');
                  }
                  
                  // Zusätzlicher Effekt: Leichte Rotation basierend auf Scroll-Position
                  parallaxSection.style.perspective = '1000px';
                  const rotationX = (viewportPosition - 0.5) * 5; // Maximal ±2.5 Grad
                  parallaxSection.querySelector('.container').style.transform = 
                    'rotateX(' + rotationX + 'deg) translateZ(0)';
                }
              }
            }
          });
        ` }}
        />
      </section>

      {/* Newsletter-Anmeldung */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'de' ? 'Reiseinspirationen direkt in dein Postfach' : 'Travel inspirations directly to your inbox'}
            </h2>
            <p className="text-lg mb-8">
              {locale === 'de' ? 'Melde dich für unseren Newsletter an und erhalte exklusive Reiseberichte, Tipps und Angebote.' : 'Sign up for our newsletter and receive exclusive travel reports, tips and offers.'}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={locale === 'de' ? 'Deine E-Mail-Adresse' : 'Your email address'}
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Button type="submit" className="whitespace-nowrap">
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
