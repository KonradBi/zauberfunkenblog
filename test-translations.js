/**
 * Test-Script für WordPress API Übersetzungen
 *
 * Dieses Skript testet:
 * 1. Abruf aller Posts in Deutsch und Englisch
 * 2. Prüft, ob Translation IDs gesetzt sind
 * 3. Versucht, zusammengehörige Übersetzungen zu finden
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
 * Ruft Posts von der WordPress API ab
 */
async function getPosts(lang = 'de') {
  try {
    log(`Rufe Beiträge in Sprache "${lang}" ab...`, colors.blue);
    
    const url = `${API_URL}/posts?_embed=true&lang=${lang}&per_page=50&_fields=id,date,slug,title,featured_media,categories,meta,acf`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Beiträge: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Holt die translation_id aus einem Post - zuerst aus acf, dann aus meta
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
 * Findet Übersetzungen zwischen DE und EN Beiträgen
 */
function findTranslationPairs(dePosts, enPosts) {
  const pairs = [];
  const unmatchedDE = [];
  const unmatchedEN = [];
  
  // Für jeden deutschen Beitrag
  for (const dePost of dePosts) {
    const translationId = getTranslationId(dePost);
    
    // Wenn keine Translation ID gesetzt ist
    if (!translationId) {
      unmatchedDE.push(dePost);
      continue;
    }
    
    // Suche nach entsprechendem EN Beitrag
    const enMatch = enPosts.find(enPost => {
      const enTranslationId = getTranslationId(enPost);
      return enTranslationId && enTranslationId.toString() === translationId.toString();
    });
    
    if (enMatch) {
      pairs.push({ de: dePost, en: enMatch });
    } else {
      log(`Keine englische Übersetzung gefunden für DE Post "${dePost.title.rendered}" (ID: ${dePost.id}) mit Translation ID: ${translationId}`, colors.yellow);
      unmatchedDE.push(dePost);
    }
  }
  
  // Englische Beiträge ohne deutsche Entsprechung finden
  for (const enPost of enPosts) {
    const translationId = getTranslationId(enPost);
    
    // Wenn keine Translation ID gesetzt ist
    if (!translationId) {
      unmatchedEN.push(enPost);
      continue;
    }
    
    // Prüfen, ob dieser Beitrag bereits in einem Paar gefunden wurde
    const alreadyMatched = pairs.some(pair => pair.en.id === enPost.id);
    if (!alreadyMatched) {
      unmatchedEN.push(enPost);
    }
  }
  
  return { pairs, unmatchedDE, unmatchedEN };
}

/**
 * Hauptfunktion zum Testen der Übersetzungen
 */
async function testTranslations() {
  log('=== TRANSLATION TEST BEGONNEN ===', colors.green);
  
  // 1. Hole alle deutschen und englischen Beiträge
  const dePosts = await getPosts('de');
  const enPosts = await getPosts('en');
  
  log(`Gefundene Beiträge: ${dePosts.length} auf Deutsch, ${enPosts.length} auf Englisch`, colors.cyan);
  
  // 2. Prüfe, wie viele Beiträge eine Translation ID haben
  const deWithTranslationId = dePosts.filter(post => getTranslationId(post));
  const enWithTranslationId = enPosts.filter(post => getTranslationId(post));
  
  log(`Beiträge mit Translation ID: ${deWithTranslationId.length} auf Deutsch, ${enWithTranslationId.length} auf Englisch`, colors.cyan);
  
  // 3. Zeige Beispiel für Translation IDs
  if (deWithTranslationId.length > 0) {
    const example = deWithTranslationId[0];
    log(`Beispiel Translation ID (${example.title.rendered}): ${getTranslationId(example)}`, colors.cyan);
  }
  
  // 4. Finde Übersetzungspaare
  const { pairs, unmatchedDE, unmatchedEN } = findTranslationPairs(dePosts, enPosts);
  
  log(`Erfolgreich verknüpfte Übersetzungspaare: ${pairs.length}`, colors.green);
  log(`Nicht verknüpfte deutsche Beiträge: ${unmatchedDE.length}`, colors.yellow);
  log(`Nicht verknüpfte englische Beiträge: ${unmatchedEN.length}`, colors.yellow);
  
  // 5. Zeige Details zu den gefundenen Paaren
  if (pairs.length > 0) {
    log('\n=== GEFUNDENE ÜBERSETZUNGSPAARE ===', colors.green);
    
    pairs.forEach((pair, index) => {
      log(`\nPaar ${index + 1}:`, colors.cyan);
      log(`DE: "${pair.de.title.rendered}" (ID: ${pair.de.id})`, colors.blue);
      log(`EN: "${pair.en.title.rendered}" (ID: ${pair.en.id})`, colors.blue);
      log(`Translation ID: ${getTranslationId(pair.de)}`, colors.green);
    });
  }
  
  // 6. Zeige Details zu nicht verknüpften Beiträgen
  if (unmatchedDE.length > 0) {
    log('\n=== DEUTSCHE BEITRÄGE OHNE ENGLISCHE ENTSPRECHUNG ===', colors.yellow);
    
    unmatchedDE.forEach((post, index) => {
      const translationId = getTranslationId(post) || 'Keine ID gesetzt';
      log(`${index + 1}. "${post.title.rendered}" (ID: ${post.id}, Translation ID: ${translationId})`, 
          getTranslationId(post) ? colors.yellow : colors.red);
    });
  }
  
  if (unmatchedEN.length > 0) {
    log('\n=== ENGLISCHE BEITRÄGE OHNE DEUTSCHE ENTSPRECHUNG ===', colors.yellow);
    
    unmatchedEN.forEach((post, index) => {
      const translationId = getTranslationId(post) || 'Keine ID gesetzt';
      log(`${index + 1}. "${post.title.rendered}" (ID: ${post.id}, Translation ID: ${translationId})`, 
          getTranslationId(post) ? colors.yellow : colors.red);
    });
  }
  
  log('\n=== TRANSLATION TEST ABGESCHLOSSEN ===', colors.green);
}

// Führe den Test aus
testTranslations(); 