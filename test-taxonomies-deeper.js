/**
 * Erweitertes Test-Script für WordPress API Taxonomien und Sprachfilterung
 *
 * Dieses Skript testet:
 * 1. Die Verfügbarkeit der Sprachtaxonomie
 * 2. Die Möglichkeit, Beiträge nach Sprache zu filtern
 * 3. Den Zusammenhang zwischen Translation IDs und Sprachauswahl
 */

const axios = require('axios');

// WordPress API URL
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://blog.zauberfunken.com/wp-json/wp/v2';

// Farben für die Konsolenausgabe
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
};

/**
 * Formatiert die Ausgabe
 */
function log(message, color = colors.reset) {
  console.log(color, message, colors.reset);
}

/**
 * Holt die Translation ID von einem Post
 */
function getTranslationId(post) {
  // Versuche zuerst, die Translation ID aus dem ACF-Objekt zu bekommen
  if (post.acf && post.acf.translation_id) {
    return post.acf.translation_id;
  }
  
  // Dann versuche, die Translation ID aus dem Meta-Objekt zu bekommen
  if (post.meta && post.meta.translation_id) {
    return post.meta.translation_id;
  }
  
  // Keine Translation ID gefunden
  return null;
}

/**
 * Ruft alle verfügbaren Taxonomien ab
 */
async function getTaxonomies() {
  try {
    log('Rufe alle Taxonomien ab...', colors.blue);
    const response = await axios.get(`${API_URL}/taxonomies`);
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Taxonomien: ${error.message}`, colors.red);
    return {};
  }
}

/**
 * Ruft Sprachterme ab
 */
async function getLanguageTerms() {
  try {
    log('Rufe Sprachterme ab...', colors.blue);
    const response = await axios.get(`${API_URL}/language`);
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Sprachterme: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Ruft Beiträge gefiltert nach Sprache ab
 */
async function getPostsByLanguage(lang) {
  try {
    log(`Rufe Beiträge für Sprache "${lang}" ab...`, colors.blue);
    const url = `${API_URL}/posts?lang=${lang}&per_page=10&_fields=id,title,acf,meta`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Beiträge für Sprache "${lang}": ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Hauptfunktion für den Test
 */
async function main() {
  log('=== ERWEITERTER TAXONOMIE TEST BEGONNEN ===', colors.green);
  
  // 1. Prüfe verfügbare Taxonomien
  const taxonomies = await getTaxonomies();
  
  if (!taxonomies.language) {
    log('Keine Sprachtaxonomie gefunden!', colors.red);
    return;
  }
  
  log('Sprachtaxonomie gefunden:', colors.green);
  log(`Name: ${taxonomies.language.name}`, colors.cyan);
  log(`REST-Base: ${taxonomies.language.rest_base}`, colors.cyan);
  
  // 2. Hole alle Sprachterme
  const languageTerms = await getLanguageTerms();
  
  if (languageTerms.length === 0) {
    log('Keine Sprachterme gefunden!', colors.red);
  } else {
    log(`${languageTerms.length} Sprachterme gefunden:`, colors.green);
    languageTerms.forEach(term => {
      log(`${term.id}: ${term.name} (${term.slug})`, colors.cyan);
    });
  }
  
  // 3. Teste, ob Beiträge nach Sprache gefiltert werden können
  log('\n=== SPRACHFILTERUNG TESTEN ===', colors.green);
  
  const languageCodes = ['de', 'en'];
  const postsByLanguage = {};
  
  for (const lang of languageCodes) {
    const posts = await getPostsByLanguage(lang);
    postsByLanguage[lang] = posts;
    
    log(`Gefundene Beiträge für "${lang}": ${posts.length}`, colors.green);
    
    if (posts.length > 0) {
      // Zeige die ersten drei Beiträge als Beispiel
      posts.slice(0, 3).forEach(post => {
        log(`- ${post.title.rendered} (ID: ${post.id})`, colors.cyan);
        const translationId = getTranslationId(post);
        if (translationId) {
          log(`  Translation ID: ${translationId}`, colors.cyan);
        }
      });
      
      if (posts.length > 3) {
        log(`  ... und ${posts.length - 3} weitere`, colors.gray);
      }
    }
  }
  
  // 4. Vergleiche die Anzahl der Beiträge zwischen den Sprachen
  log('\n=== VERGLEICH DER SPRACHVERSIONEN ===', colors.green);
  
  for (const lang of languageCodes) {
    const otherLang = lang === 'de' ? 'en' : 'de';
    
    log(`\nVergleiche ${lang.toUpperCase()} mit ${otherLang.toUpperCase()} Beiträgen:`, colors.blue);
    
    // Sammle alle Translation IDs für diese Sprache
    const translationIdsFromLang = postsByLanguage[lang]
      .map(post => getTranslationId(post))
      .filter(id => id);
    
    // Sammle alle Translation IDs für die andere Sprache
    const translationIdsFromOtherLang = postsByLanguage[otherLang]
      .map(post => getTranslationId(post))
      .filter(id => id);
    
    // Finde gemeinsame Translation IDs
    const commonIds = translationIdsFromLang.filter(id => 
      translationIdsFromOtherLang.includes(id)
    );
    
    log(`Beiträge in ${lang}: ${postsByLanguage[lang].length}`, colors.cyan);
    log(`Beiträge in ${otherLang}: ${postsByLanguage[otherLang].length}`, colors.cyan);
    log(`Gemeinsame Translation IDs: ${commonIds.length}`, colors.cyan);
    
    if (commonIds.length > 0) {
      log('Gemeinsame Translation IDs:', colors.cyan);
      log(`${commonIds.join(', ')}`, colors.gray);
    }
  }
  
  log('\n=== ERWEITERTER TAXONOMIE TEST ABGESCHLOSSEN ===', colors.green);
}

// Starte den Test
main(); 