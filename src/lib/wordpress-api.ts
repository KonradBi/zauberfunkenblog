import axios, { AxiosError } from 'axios';

// WordPress API URL - Unterstützt Umgebungsvariablen für verschiedene Umgebungen
// Wir verwenden die Strato WordPress-Installation als Standard-URL.
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://blog.zauberfunken.com/wp-json/wp/v2';
const WORDPRESS_ROOT_URL = WORDPRESS_API_URL.replace('/wp/v2', '');

// JWT Authentication credentials (optional, nur für Fallback)
const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_PASSWORD = process.env.WORDPRESS_PASSWORD;

// Store the JWT token
let jwtToken: string | null = null;

/**
 * Get JWT token for authentication (optional, nur für Fallback)
 */
async function getJwtToken(): Promise<string | null> {
  // If we already have a token, return it
  if (jwtToken) {
    return jwtToken;
  }
  
  // If we don't have credentials, we can't get a token
  if (!WP_USERNAME || !WP_PASSWORD) {
    console.log('WordPress credentials not provided. Only public API access will be used.');
    return null;
  }
  
  try {
    const response = await axios.post(`${WORDPRESS_ROOT_URL}/jwt-auth/v1/token`, {
      username: WP_USERNAME,
      password: WP_PASSWORD
    });
    
    if (response.data && response.data.token) {
      jwtToken = response.data.token;
      return jwtToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return null;
  }
}

/**
 * Versucht, eine API-Anfrage zu machen, zuerst ohne Authentifizierung.
 * Bei Bedarf wird als Fallback JWT-Authentifizierung verwendet, wenn 401/403 Fehler auftreten.
 */
async function makeApiRequest<T>(url: string): Promise<T> {
  try {
    // Erster Versuch ohne Authentifizierung
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    // Wenn der Fehler 401 oder 403 ist, versuche es mit JWT-Authentifizierung
    const axiosError = error as AxiosError;
    if ((axiosError.response?.status === 401 || axiosError.response?.status === 403) && WP_USERNAME && WP_PASSWORD) {
      console.log('Access denied without authentication, trying with JWT token...');
      const token = await getJwtToken();
      
      if (token) {
        const authResponse = await axios.get<T>(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return authResponse.data;
      }
    }
    
    // Weitergabe des Fehlers, wenn keine Authentifizierung möglich ist oder ein anderer Fehler auftritt
    throw error;
  }
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  featured_image_url?: string;
  categories: number[];
  categories_info?: Array<{
    id: number;
    name: string;
    slug: string;
    link: string;
  }>;
  tags: number[];
  tags_info?: Array<{
    id: number;
    name: string;
    slug: string;
    link: string;
  }>;
  translations?: Record<string, {
    id: number;
    slug: string;
    link: string;
  }>;
  meta?: {
    translation_id?: string | number;
    [key: string]: string | number | boolean | null | undefined;
  };
  acf?: {
    translation_id?: string | number;
    [key: string]: string | number | boolean | null | undefined;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy?: string;
    }>>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  source_url: string;
  alt_text: string;
}

/**
 * Holt die Translation ID aus einem Post
 * @param post Der WordPress-Post 
 * @returns Die Translation ID oder null, wenn keine gefunden
 */
function getTranslationId(post: WordPressPost): string | number | null {
  // Versuche zuerst, die Translation ID aus dem ACF-Objekt zu bekommen
  if (post.acf?.translation_id) {
    return post.acf.translation_id;
  }
  
  // Dann versuche, die Translation ID aus dem Meta-Objekt zu bekommen (Fallback)
  if (post.meta?.translation_id) {
    return post.meta.translation_id;
  }
  
  return null;
}

export async function getPosts(
  category?: number | string,
  page: number = 1,
  perPage: number = 10,
  lang: string = 'de'
): Promise<WordPressPost[]> {
  try {
    // Stellen Sie sicher, dass _embed Parameter immer vorhanden ist, um Medien einzubetten
    let endpoint = `${WORDPRESS_API_URL}/posts?page=${page}&per_page=${perPage}&_embed=true`;
    
    if (category) {
      endpoint += typeof category === 'number' 
        ? `&categories=${category}` 
        : `&category_name=${category}`;
    }
    
    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = lang === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    // Filter by language taxonomy instead of using lang parameter
    endpoint += `&language=${languageTaxonomyId}`;
    
    // Debugging: Zeige an, welche Sprache wir abfragen
    console.log(`Fetching posts for language: ${lang} (taxonomy ID: ${languageTaxonomyId})`);
    
    // Add meta fields and ACF fields to the response
    endpoint += '&_fields=id,date,modified,slug,status,type,link,title,content,excerpt,featured_media,featured_image_url,categories,categories_info,tags,tags_info,translations,_embedded,meta,acf';
    
    console.log('Fetching posts from:', endpoint);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    console.log('Received posts:', postsData.length);
    
    // Verarbeite die Antwort, um sicherzustellen, dass die Bilder korrekt eingebettet sind
    const posts = await Promise.all(postsData.map(async post => {
      // Stelle sicher, dass _embedded existiert
      if (!post._embedded) {
        post._embedded = {};
      }

      // Wenn featured_media vorhanden ist, aber wp:featuredmedia fehlt oder kein source_url hat
      if (post.featured_media && (!post._embedded['wp:featuredmedia'] || !post._embedded['wp:featuredmedia'][0]?.source_url)) {
        // Versuche zuerst, das Bild aus featured_image_url zu bekommen (vom Child-Theme hinzugefügt)
        if (post.featured_image_url) {
          post._embedded['wp:featuredmedia'] = [
            {
              source_url: post.featured_image_url,
              alt_text: post.title.rendered
            }
          ];
          console.log(`Post ${post.id} - Using featured_image_url:`, post.featured_image_url);
        } 
        // Wenn kein featured_image_url vorhanden ist, hole das Medium direkt
        else {
          try {
            const mediaData = await getMedia(post.featured_media);
            if (mediaData) {
              // Stelle sicher, dass wp:featuredmedia existiert
              if (!post._embedded['wp:featuredmedia']) {
                post._embedded['wp:featuredmedia'] = [];
              }
              
              post._embedded['wp:featuredmedia'][0] = {
                source_url: mediaData.source_url,
                alt_text: mediaData.alt_text || post.title.rendered
              };
              
              console.log(`Post ${post.id} - Retrieved media:`, post._embedded['wp:featuredmedia'][0].source_url);
            } else {
              // Fallback URL wenn getMedia kein Ergebnis liefert
              const mediaId = post.featured_media;
              const fallbackUrl = `${WORDPRESS_API_URL.replace('/wp/v2', '')}/wp-content/uploads/featured-media/${mediaId}.jpg`;
              
              post._embedded['wp:featuredmedia'] = [
                {
                  source_url: fallbackUrl,
                  alt_text: post.title.rendered
                }
              ];
              console.log(`Post ${post.id} - Using fallback URL:`, fallbackUrl);
            }
          } catch (mediaError) {
            console.error(`Error retrieving media for post ${post.id}:`, mediaError);
            
            // Fallback URL
            const mediaId = post.featured_media;
            const fallbackUrl = `${WORDPRESS_API_URL.replace('/wp/v2', '')}/wp-content/uploads/featured-media/${mediaId}.jpg`;
            
            // Stelle sicher, dass wp:featuredmedia existiert
            if (!post._embedded['wp:featuredmedia']) {
              post._embedded['wp:featuredmedia'] = [];
            }
            
            post._embedded['wp:featuredmedia'][0] = {
              source_url: fallbackUrl,
              alt_text: post.title.rendered
            };
            
            console.log(`Post ${post.id} - Using fallback URL:`, fallbackUrl);
          }
        }
      }
      
      // Debug-Ausgabe für Bilder
      console.log(`Post ${post.id} - ${post.title.rendered} - Featured Media:`, 
                post._embedded['wp:featuredmedia']?.[0]?.source_url || 'No image');
      
      return post;
    }));
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts from WordPress:', error);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
  lang: string = 'de'
): Promise<WordPressPost | null> {
  try {
    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = lang === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    // Add meta fields and ACF fields to the response
    const endpoint = `${WORDPRESS_API_URL}/posts?_embed=true&slug=${slug}&language=${languageTaxonomyId}&_fields=id,date,modified,slug,status,type,link,title,content,excerpt,featured_media,featured_image_url,categories,categories_info,tags,tags_info,translations,_embedded,meta,acf`;
    console.log(`Fetching post by slug from: ${endpoint} (language: ${lang}, taxonomy ID: ${languageTaxonomyId})`);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    
    if (postsData.length > 0) {
      console.log('Found post with slug:', slug);
      const post = postsData[0];
      
      // Stelle sicher, dass Bilder korrekt eingebettet sind
      if (post.featured_media && (!post._embedded?.['wp:featuredmedia'] || !post._embedded?.['wp:featuredmedia'][0]?.source_url)) {
        // Initializiere _embedded, falls nicht vorhanden
        if (!post._embedded) {
          post._embedded = {};
        }
        
        // Versuche zuerst, das Bild aus featured_image_url zu bekommen
        if (post.featured_image_url) {
          post._embedded['wp:featuredmedia'] = [
            {
              source_url: post.featured_image_url,
              alt_text: post.title.rendered
            }
          ];
          console.log(`Post ${post.id} - Using featured_image_url:`, post.featured_image_url);
        } else {
          // Versuche, das Bild direkt zu laden
          try {
            const mediaData = await getMedia(post.featured_media);
            if (mediaData) {
              // Stelle sicher, dass wp:featuredmedia existiert
              if (!post._embedded['wp:featuredmedia']) {
                post._embedded['wp:featuredmedia'] = [];
              }
              
              post._embedded['wp:featuredmedia'][0] = {
                source_url: mediaData.source_url,
                alt_text: mediaData.alt_text || post.title.rendered
              };
              
              console.log(`Post ${post.id} - Retrieved media:`, post._embedded['wp:featuredmedia'][0].source_url);
            }
          } catch (mediaError) {
            console.error(`Error retrieving media for post ${post.id}:`, mediaError);
            
            // Fallback URL
            const mediaId = post.featured_media;
            const fallbackUrl = `${WORDPRESS_API_URL.replace('/wp/v2', '')}/wp-content/uploads/featured-media/${mediaId}.jpg`;
            
            // Stelle sicher, dass wp:featuredmedia existiert
            if (!post._embedded['wp:featuredmedia']) {
              post._embedded['wp:featuredmedia'] = [];
            }
            
            post._embedded['wp:featuredmedia'][0] = {
              source_url: fallbackUrl,
              alt_text: post.title.rendered
            };
            
            console.log(`Post ${post.id} - Using fallback URL:`, fallbackUrl);
          }
        }
      }
      
      return post;
    }
    
    console.log('No post found with slug:', slug);
    return null;
  } catch (error) {
    console.error('Error fetching post by slug from WordPress:', error);
    return null;
  }
}

export async function getCategories(
  lang: string = 'de'
): Promise<WordPressCategory[]> {
  try {
    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = lang === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    const endpoint = `${WORDPRESS_API_URL}/categories?language=${languageTaxonomyId}`;
    console.log(`Fetching categories for language: ${lang} (taxonomy ID: ${languageTaxonomyId})`);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const categoriesData = await makeApiRequest<WordPressCategory[]>(endpoint);
    console.log('Received categories:', categoriesData.length);
    
    return categoriesData;
  } catch (error) {
    console.error('Error fetching categories from WordPress:', error);
    return [];
  }
}

export async function getMedia(
  id: number
): Promise<WordPressMedia | null> {
  try {
    const endpoint = `${WORDPRESS_API_URL}/media/${id}`;
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const mediaData = await makeApiRequest<WordPressMedia>(endpoint);
    return mediaData;
  } catch (error) {
    console.error('Error fetching media from WordPress:', error);
    return null;
  }
}

/**
 * Test-Funktion, um die Verbindung zur WordPress-API zu überprüfen
 * Diese Funktion gibt die allgemeinen WordPress-Informationen zurück
 * und kann verwendet werden, um zu testen, ob die API erreichbar ist
 */
// Definiere einen Typ für die WordPress-API-Root-Antwort
interface WordPressApiInfo {
  name: string;
  description: string;
  url: string;
  home: string;
  gmt_offset: number;
  timezone_string: string;
  namespaces: string[];
  authentication: Record<string, unknown>;
  routes: Record<string, unknown>;
  [key: string]: unknown; // Für andere mögliche Felder
}

interface ApiConnectionResult {
  success: boolean;
  data?: WordPressApiInfo;
  error?: unknown;
}

export async function testApiConnection(): Promise<ApiConnectionResult> {
  try {
    // Wir testen mit dem /posts Endpunkt
    const postsEndpoint = `${WORDPRESS_API_URL}/posts?per_page=1`;
    console.log('Testing API connection to:', postsEndpoint);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressApiInfo>(postsEndpoint);
    console.log('API connection successful:', postsData);
    return {
      success: true,
      data: postsData
    };
  } catch (error) {
    console.error('Error connecting to WordPress API:', error);
    return {
      success: false,
      error: error
    };
  }
}

// Function to get posts by category slug
export async function getPostsByCategorySlug(
  slug: string,
  locale: string = 'de',
  perPage: number = 10,
  page: number = 1
): Promise<WordPressPost[]> {
  try {
    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = locale === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    // First get the category ID from the slug
    const categoryEndpoint = `${WORDPRESS_API_URL}/categories?slug=${slug}&language=${languageTaxonomyId}`;
    console.log(`Fetching category by slug from: ${categoryEndpoint} (language: ${locale}, taxonomy ID: ${languageTaxonomyId})`);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const categoriesData = await makeApiRequest<WordPressCategory[]>(categoryEndpoint);
    
    if (categoriesData.length === 0) {
      console.log('No category found with slug:', slug);
      return [];
    }
    
    const categoryId = categoriesData[0].id;
    console.log('Found category ID:', categoryId, 'for slug:', slug, 'in language:', locale);
    
    // Then get posts by category ID, ensuring we only get posts in the specified language
    // Korrigierte Parameter-Reihenfolge: category, page, perPage, lang
    const posts = await getPosts(categoryId, page, perPage, locale);
    
    // Zusätzliches Logging
    console.log(`Retrieved ${posts.length} posts in category ${slug} for locale ${locale}`);
    posts.forEach(post => {
      console.log(`- Post ID: ${post.id}, Title: ${post.title.rendered}, Slug: ${post.slug}, Translation ID: ${post.acf?.translation_id || post.meta?.translation_id || 'none'}`);
    });
    
    return posts;
  } catch (error) {
    console.error('Error fetching posts by category slug from WordPress:', error);
    return [];
  }
}

/**
 * Holt die Übersetzung eines Posts basierend auf der translation_id
 * @param post Der Post-Objekt oder die translation_id direkt
 * @param targetLang Die Zielsprache (z.B. 'en', 'de')
 * @returns Den übersetzten Post oder null, wenn keine Übersetzung gefunden wurde
 */
export async function getPostTranslation(
  post: WordPressPost | string | number,
  targetLang: string
): Promise<WordPressPost | null> {
  try {
    let translationId: string | number | undefined;
    
    if (typeof post === 'object' && post !== null) {
      // Extract translation_id from post object
      const id = getTranslationId(post);
      if (id !== null) {
        translationId = id;
      }
    } else {
      // The post parameter is directly the translation ID
      translationId = post;
    }
    
    if (!translationId) {
      console.log('No translation ID found');
      return null;
    }

    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = targetLang === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    // Query posts with the specified language taxonomy and filter by ACF translation_id
    const endpoint = `${WORDPRESS_API_URL}/posts?_embed=true&language=${languageTaxonomyId}&per_page=50&_fields=id,date,modified,slug,status,type,link,title,content,excerpt,featured_media,featured_image_url,categories,categories_info,tags,tags_info,translations,_embedded,meta,acf`;
    
    console.log(`Fetching post translation with ID ${translationId} in language ${targetLang} (taxonomy ID: ${languageTaxonomyId})`);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    
    if (postsData.length > 0) {
      // Find the post with matching translation_id
      const translatedPost = postsData.find(p => {
        const postTranslationId = p.acf?.translation_id || p.meta?.translation_id;
        return postTranslationId && postTranslationId.toString() === translationId.toString();
      });
      
      if (translatedPost) {
        console.log(`Found post translation with ID ${translationId} in language ${targetLang}, Post ID: ${translatedPost.id}, Title: ${translatedPost.title.rendered}`);
        return translatedPost;
      }
    }
    
    console.log(`No post translation found with ID ${translationId} in language ${targetLang}`);
    return null;
  } catch (error) {
    console.error(`Error fetching post translation:`, error);
    return null;
  }
}

/**
 * Holt alle verfügbaren Sprachversionen eines Posts basierend auf der translation_id
 * @param translationId Die ID, die die übersetzten Posts miteinander verknüpft
 * @returns Ein Objekt mit Sprachcodes als Schlüssel und Posts als Werte
 */
export async function getAllPostTranslations(
  translationId: string | number
): Promise<Record<string, WordPressPost>> {
  try {
    if (!translationId) {
      console.log('No translation ID provided');
      return {};
    }

    const translationsByLang: Record<string, WordPressPost> = {};
    
    // Get German posts with the translation ID
    const germanPosts = await getPostsByTranslationId(translationId, 'de');
    if (germanPosts.length > 0) {
      translationsByLang['de'] = germanPosts[0];
    }
    
    // Get English posts with the translation ID
    const englishPosts = await getPostsByTranslationId(translationId, 'en');
    if (englishPosts.length > 0) {
      translationsByLang['en'] = englishPosts[0];
    }
    
    if (Object.keys(translationsByLang).length > 0) {
      return translationsByLang;
    }
    
    console.log(`No post translations found with ID ${translationId}`);
    return {};
  } catch (error) {
    console.error(`Error fetching all post translations with ID ${translationId}:`, error);
    return {};
  }
}

/**
 * Helper function to get posts by translation ID and language
 */
async function getPostsByTranslationId(
  translationId: string | number,
  lang: string = 'de'
): Promise<WordPressPost[]> {
  try {
    // Maps language code to WordPress language taxonomy ID
    const languageTaxonomyId = lang === 'en' ? 7 : 6; // 7 = English, 6 = German
    
    // Query posts with the specified language taxonomy
    const endpoint = `${WORDPRESS_API_URL}/posts?_embed=true&language=${languageTaxonomyId}&per_page=50&_fields=id,date,modified,slug,status,type,link,title,content,excerpt,featured_media,featured_image_url,categories,categories_info,tags,tags_info,translations,_embedded,meta,acf`;
    
    console.log(`Fetching posts with translation ID ${translationId} in language ${lang} (taxonomy ID: ${languageTaxonomyId})`);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    
    // Filter posts by translation ID
    const filteredPosts = postsData.filter(post => {
      const postTranslationId = post.acf?.translation_id || post.meta?.translation_id;
      if (postTranslationId && postTranslationId.toString() === translationId.toString()) {
        console.log(`Found post with translation ID ${translationId} in ${lang}: ID ${post.id}, Title: ${post.title.rendered}, Slug: ${post.slug}`);
        return true;
      }
      return false;
    });
    
    return filteredPosts;
  } catch (error) {
    console.error(`Error fetching posts by translation ID:`, error);
    return [];
  }
}




