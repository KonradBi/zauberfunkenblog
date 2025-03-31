# Mehrsprachiges Blog mit WordPress und Next.js

Diese Dokumentation beschreibt die Implementierung eines mehrsprachigen Blogs mit WordPress als Backend und Next.js als Frontend.

## Übersicht

Das System ermöglicht die Verwaltung von Inhalten in mehreren Sprachen (Deutsch und Englisch) mit folgenden Eigenschaften:
- Sprachbasierte URL-Struktur (/de/... und /en/...)
- Verknüpfung von Übersetzungen über benutzerdefinierte Felder
- Filterung von Inhalten nach Sprache
- SEO-optimierte hreflang-Tags

## WordPress-Konfiguration

### 1. Kategorisierung bestehender Beiträge nach Sprache

- Bearbeite jeden bestehenden Beitrag
- Scrolle in der Bearbeitungsansicht zum Bereich "Sprachen" (rechte Seitenleiste)
- Wähle "Deutsch" für deutsche Beiträge aus

### 2. Erstellung übersetzter Beiträge

- Erstelle einen neuen Beitrag für die englische Version
- Kopiere den Inhalt des deutschen Beitrags
- Übersetze diesen ins Englische (manuell oder per KI)
- Wähle im Bereich "Sprachen" die Option "Englisch" aus
- Die Titelform (Slug) kann gleich oder ähnlich sein, da die Sprachunterscheidung über die Taxonomie erfolgt

### 3. Verbindung zwischen Übersetzungen mit Advanced Custom Fields

Wir nutzen das Advanced Custom Fields (ACF) Plugin für die Verknüpfung:

1. Installation und Einrichtung:
   - Installiere das Plugin "Advanced Custom Fields" (kostenlose Version)
   - Gehe zu "Benutzerdefinierte Felder" im WordPress-Admin-Menü
   - Klicke auf "Neue Feldgruppe hinzufügen"
   - Benenne die Feldgruppe, z.B. "Übersetzungsverknüpfung"

2. Feld erstellen:
   - Klicke auf "+ Feld hinzufügen"
   - Feldname: "translation_id"
   - Feldtyp: "Text" 
   - Anweisungen: "ID zur Verknüpfung von Übersetzungen. Verwende dieselbe ID für Beiträge in verschiedenen Sprachen, die einander entsprechen."
   - Unter "Anzeigeregeln" wähle "Beitragstyp ist gleich Beitrag"
   - Speichere die Feldgruppe

3. Verknüpfung der Beiträge:
   - Bearbeite den deutschen Beitrag
   - Setze eine eindeutige ID im Feld "translation_id", z.B. eine Zahl wie "1"
   - Bearbeite den entsprechenden englischen Beitrag
   - Setze dieselbe ID "1" im Feld "translation_id"

## Next.js Frontend-Implementierung

### 1. API-Anfragen für sprachspezifische Inhalte

Im WordPress-API-Modul (`src/lib/wordpress-api.ts`):

```javascript
// Funktion zum Abrufen von Beiträgen mit Sprachfilter
export async function getPosts(page = 1, per_page = 6, locale = 'de') {
  const lang = locale === 'en' ? 'en' : 'de';
  const url = `${API_URL}/posts?page=${page}&per_page=${per_page}&_embed=true&lang=${lang}&_fields=id,date,modified,slug,status,type,link,title,content,excerpt,featured_media,featured_image_url,categories,categories_info,tags,tags_info,translations,_embedded,meta`;
  
  // Rest der Implementierung...
}

// Funktion zum Abrufen von Beiträgen nach Kategorie mit Sprachfilter
export async function getPostsByCategorySlug(slug, locale = 'de', per_page = 50) {
  const lang = locale === 'en' ? 'en' : 'de';
  // Ermittle zuerst die Kategorie-ID
  const categoryUrl = `${API_URL}/categories?slug=${slug}&lang=${lang}`;
  
  // Rest der Implementierung...
}

// Funktion zum Abrufen von Übersetzungen
export async function getPostTranslation(post, targetLocale) {
  if (!post || !post.meta || !post.meta.translation_id) {
    return null;
  }
  
  const translationId = post.meta.translation_id;
  // Suche nach Beiträgen mit derselben translation_id in der Zielsprache
  // Rest der Implementierung...
}
```

### 2. Seiten-Komponenten für Sprachunterstützung

In Seitenkomponenten (z.B. `src/app/[locale]/hotels/page.tsx`):

```javascript
export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const titles = {
    de: "Hotels - Zauberfunken Blog",
    en: "Hotels - Zauberfunken Blog"
  };
  
  const descriptions = {
    de: "Entdecke besondere Hotels rund um die Welt im Zauberfunken Blog.",
    en: "Discover special hotels around the world in the Zauberfunken Blog."
  };
  
  return {
    title: titles[locale] || titles.de,
    description: descriptions[locale] || descriptions.de,
  };
}

export default async function HotelsPage({ params }) {
  const { locale } = params;
  debug(`Retrieving hotel posts for locale ${locale}`);
  
  // Abrufen der Beiträge in der entsprechenden Sprache
  const posts = await getPostsByCategorySlug('hotels', locale);
  
  // Abrufen der Übersetzungen für jeden Beitrag
  const translations = [];
  for (const post of posts) {
    const targetLocale = locale === 'de' ? 'en' : 'de';
    const translation = await getPostTranslation(post, targetLocale);
    if (translation) {
      translations.push(translation);
    }
  }
  
  return (
    <CategoryPage
      title={locale === 'de' ? "Hotels" : "Hotels"}
      subtitle={locale === 'de' ? "Außergewöhnliche Unterkünfte" : "Extraordinary accommodations"}
      backgroundImage="/images/herohotels.jpg"
      posts={posts}
      postsTranslations={translations}
    />
  );
}
```

### 3. Komponente zur Anzeige der Beiträge mit Übersetzungen

In der CategoryPage-Komponente (`src/components/category-page.tsx`):

```javascript
interface CategoryPageProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  posts: any[];
  postsTranslations?: any[];
}

export default function CategoryPage({
  title,
  subtitle,
  backgroundImage,
  posts = [],
  postsTranslations = []
}: CategoryPageProps) {
  const { locale } = useParams();
  
  // Anzeige der Beiträge mit Link zur Übersetzung, falls vorhanden
  return (
    <div>
      {/* Header und andere Elemente */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard 
              key={post.id} 
              post={post} 
              translation={postsTranslations[index] || null}
            />
          ))
        ) : (
          <p>{locale === 'de' ? "Keine Beiträge gefunden." : "No posts found."}</p>
        )}
      </div>
    </div>
  );
}
```

## SEO-Optimierung mit hreflang-Tags

Die hreflang-Tags werden in der Metadaten-Konfiguration für jede Seite hinzugefügt:

```javascript
export async function generateMetadata({ params }) {
  const { locale } = params;
  
  // Grundlegende Metadaten
  
  // hreflang-Tags für Sprachvarianten
  const alternates = {
    languages: {
      'de': `https://zauberfunken.com/de/...`,
      'en': `https://zauberfunken.com/en/...`,
    },
  };
  
  return {
    title: ...,
    description: ...,
    alternates,
  };
}
```

## Zusammenfassung des Workflows

1. **WordPress:**
   - Kategorisiere Beiträge nach Sprache (Deutsch/Englisch)
   - Erstelle übersetzten Content
   - Verknüpfe Übersetzungen über das "translation_id" Feld

2. **Next.js:**
   - Filtere Inhalte nach Sprache basierend auf der URL (/de/... oder /en/...)
   - Lade passende Übersetzungen für jeden Beitrag
   - Zeige Navigationsmöglichkeiten zwischen Sprachversionen an
   - Optimiere SEO mit hreflang-Tags

3. **Benutzerinteraktion:**
   - User sehen Inhalte in ihrer Sprache
   - Einfache Navigation zwischen Sprachversionen über UI-Elemente möglich 