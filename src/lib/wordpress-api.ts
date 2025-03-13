import axios from 'axios';

// WordPress API URL - Unterstützt Umgebungsvariablen für verschiedene Umgebungen
// In .env.local kann NEXT_PUBLIC_WORDPRESS_API_URL definiert werden:
// - Für lokale Entwicklung: http://zauberfunkenblog.local/wp-json/wp/v2
// - Für Produktion: https://blog.zauberfunken.com/wp-json/wp/v2

// Da wir aktuell mit der lokalen WordPress-Installation arbeiten, verwenden wir
// diese als Standard-URL. Für die Produktion kann dies in einer .env.local Datei 
// oder bei Vercel in den Umgebungsvariablen geändert werden.
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://zauberfunkenblog.local/wp-json/wp/v2';

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
    const response = await axios.get<WordPressPost[]>(endpoint);
    console.log('Received posts:', response.data.length);
    
    // Verarbeite die Antwort, um sicherzustellen, dass die Bilder korrekt eingebettet sind
    const posts = response.data.map(post => {
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
    const response = await axios.get<WordPressPost[]>(endpoint);
    
    if (response.data.length > 0) {
      console.log('Found post with slug:', slug);
      return response.data[0];
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
    const response = await axios.get<WordPressCategory[]>(endpoint);
    console.log('Received categories:', response.data.length);
    
    return response.data;
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
    const response = await axios.get<WordPressMedia>(endpoint);
    return response.data;
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
    // Wir verwenden den Root-Endpunkt der WordPress-API, der grundlegende Informationen zurückgibt
    const rootEndpoint = WORDPRESS_API_URL.replace('/wp/v2', '');
    console.log('Testing API connection to:', rootEndpoint);
    
    const response = await axios.get(rootEndpoint);
    console.log('API connection successful:', response.data);
    return {
      success: true,
      data: response.data
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
    const categoryResponse = await axios.get<WordPressCategory[]>(categoryEndpoint);
    
    if (categoryResponse.data.length === 0) {
      console.log('No category found with slug:', slug);
      return [];
    }
    
    const categoryId = categoryResponse.data[0].id;
    console.log('Found category ID:', categoryId, 'for slug:', slug);
    
    // Then get posts by category ID
    return getPosts(categoryId, page, perPage, lang);
  } catch (error) {
    console.error('Error fetching posts by category slug from WordPress:', error);
    return [];
  }
}




