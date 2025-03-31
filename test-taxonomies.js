/**
 * Test-Script für WordPress API Taxonomien (insbesondere Sprachen)
 *
 * Dieses Skript testet:
 * 1. Abruf aller verfügbaren Taxonomien
 * 2. Abruf der "language" Taxonomie-Terme
 * 3. Prüft, welche Beiträge welche Sprachtaxonomie haben
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
 * Ruft alle Taxonomien von WordPress ab
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
 * Ruft Terme für eine bestimmte Taxonomie ab
 */
async function getTaxonomyTerms(taxonomySlug) {
  try {
    log(`Rufe Terme für Taxonomie "${taxonomySlug}" ab...`, colors.blue);
    
    const response = await axios.get(`${API_URL}/${taxonomySlug}`);
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Taxonomie-Terme: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Ruft Posts von der WordPress API ab
 */
async function getPosts(per_page = 10) {
  try {
    log(`Rufe Beiträge ab (max ${per_page})...`, colors.blue);
    
    const url = `${API_URL}/posts?_embed=true&per_page=${per_page}&_fields=id,date,slug,title,featured_media,categories,meta,_embedded`;
    const response = await axios.get(url);
    
    return response.data;
  } catch (error) {
    log(`Fehler beim Abrufen der Beiträge: ${error.message}`, colors.red);
    return [];
  }
}

/**
 * Hauptfunktion zum Testen der Taxonomien
 */
async function testTaxonomies() {
  log('=== TAXONOMIE TEST BEGONNEN ===', colors.green);
  
  // 1. Alle verfügbaren Taxonomien abrufen
  const taxonomies = await getTaxonomies();
  
  log('\n=== VERFÜGBARE TAXONOMIEN ===', colors.green);
  for (const [slug, taxonomy] of Object.entries(taxonomies)) {
    log(`${slug}: ${taxonomy.name} (${taxonomy.rest_base})`, colors.cyan);
  }
  
  // 2. Prüfen, ob die language/Sprachen Taxonomie existiert
  if (taxonomies.language) {
    log('\n=== SPRACHEN TAXONOMIE GEFUNDEN ===', colors.green);
    log(`Name: ${taxonomies.language.name}`, colors.cyan);
    log(`REST-Base: ${taxonomies.language.rest_base}`, colors.cyan);
    log(`Hierarchisch: ${taxonomies.language.hierarchical ? 'Ja' : 'Nein'}`, colors.cyan);
    
    // 3. Alle Sprachterme abrufen
    const languageTerms = await getTaxonomyTerms(taxonomies.language.rest_base);
    
    log('\n=== SPRACHEN TERME ===', colors.green);
    languageTerms.forEach(term => {
      log(`${term.id}: ${term.name} (${term.slug})`, colors.cyan);
    });
    
    // 4. Posts abrufen und Sprachzuweisung prüfen
    const posts = await getPosts(20);
    
    log('\n=== BEITRÄGE MIT SPRACHZUWEISUNG ===', colors.green);
    posts.forEach(post => {
      log(`\nBeitrag: "${post.title.rendered}" (ID: ${post.id})`, colors.blue);
      
      // Suche nach Sprachzuweisungen in den eingebetteten Taxonomien
      let foundLanguage = false;
      
      if (post._embedded && post._embedded['wp:term']) {
        post._embedded['wp:term'].forEach(termGroup => {
          termGroup.forEach(term => {
            if (term.taxonomy === 'language') {
              foundLanguage = true;
              log(`Sprache: ${term.name} (${term.slug})`, colors.green);
            }
          });
        });
      }
      
      if (!foundLanguage) {
        log('Keine Sprachzuweisung gefunden', colors.red);
      }
      
      // Prüfe Translation ID
      if (post.meta && post.meta.translation_id) {
        log(`Translation ID: ${post.meta.translation_id}`, colors.green);
      } else {
        log('Keine Translation ID gefunden', colors.red);
      }
    });
  } else {
    log('\n=== SPRACHEN TAXONOMIE NICHT GEFUNDEN ===', colors.red);
    log('Die Taxonomie "language" existiert nicht in diesem WordPress-System.', colors.red);
  }
  
  log('\n=== TAXONOMIE TEST ABGESCHLOSSEN ===', colors.green);
}

// Führe den Test aus
testTaxonomies(); 