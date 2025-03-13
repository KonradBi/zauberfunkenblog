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
  featured_image_url?: string; // Vom Child-Theme hinzugefügtes Feld
  categories: number[];
  categories_info?: Array<{ // Vom Child-Theme hinzugefügtes Feld
    id: number;
    name: string;
    slug: string;
    link: string;
  }>;
  tags: number[];
  tags_info?: Array<{ // Vom Child-Theme hinzugefügtes Feld
    id: number;
    name: string;
    slug: string;
    link: string;
  }>;
  translations?: Record<string, { // Vom Child-Theme hinzugefügtes Feld für WPML
    id: number;
    slug: string;
    link: string;
  }>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
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
        : `&categories_slug=${category}`;
    }
    
    // Add language parameter for multilingual support (requires WPML or similar plugin)
    endpoint += `&lang=${lang}`;
    
    console.log('Fetching posts from:', endpoint);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    console.log('Received posts:', postsData.length);
    
    // Verarbeite die Antwort, um sicherzustellen, dass die Bilder korrekt eingebettet sind
    const posts = postsData.map(post => {
      // Wenn das Bild nicht in _embedded vorhanden ist, versuche es aus featured_image_url zu bekommen
      if (!post._embedded?.['wp:featuredmedia']?.[0]?.source_url && post.featured_image_url) {
        if (!post._embedded) {
          post._embedded = {};
        }
        post._embedded['wp:featuredmedia'] = [
          {
            source_url: post.featured_image_url,
            alt_text: post.title.rendered
          }
        ];
      }
      
      // Debug-Ausgabe für Bilder
      console.log(`Post ${post.id} - ${post.title.rendered} - Featured Media:`, 
                 post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'No image');
      
      return post;
    });
    
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
    const endpoint = `${WORDPRESS_API_URL}/posts?_embed&slug=${slug}&lang=${lang}`;
    console.log('Fetching post by slug from:', endpoint);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const postsData = await makeApiRequest<WordPressPost[]>(endpoint);
    
    if (postsData.length > 0) {
      console.log('Found post with slug:', slug);
      return postsData[0];
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
    const endpoint = `${WORDPRESS_API_URL}/categories?lang=${lang}`;
    console.log('Fetching categories from:', endpoint);
    
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
  page: number = 1,
  perPage: number = 10,
  lang: string = 'de'
): Promise<WordPressPost[]> {
  try {
    // First get the category ID from the slug
    const categoryEndpoint = `${WORDPRESS_API_URL}/categories?slug=${slug}&lang=${lang}`;
    console.log('Fetching category by slug from:', categoryEndpoint);
    
    // API-Aufruf mit automatischem Fallback zur JWT-Authentifizierung bei Bedarf
    const categoriesData = await makeApiRequest<WordPressCategory[]>(categoryEndpoint);
    
    if (categoriesData.length === 0) {
      console.log('No category found with slug:', slug);
      return [];
    }
    
    const categoryId = categoriesData[0].id;
    console.log('Found category ID:', categoryId, 'for slug:', slug);
    
    // Then get posts by category ID
    return getPosts(categoryId, page, perPage, lang);
  } catch (error) {
    console.error('Error fetching posts by category slug from WordPress:', error);
    return [];
  }
}




