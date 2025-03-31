/**
 * Test-Script für WordPress API custom fields
 *
 * Dieses Skript überprüft:
 * 1. Verfügbarkeit von benutzerdefinierten Feldern in der API
 * 2. Ob das translation_id Feld richtig konfiguriert ist
 */

const axios = require('axios');

// WordPress API URL
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://blog.zauberfunken.com/wp-json/wp/v2';
const WP_ROOT_URL = API_URL.replace('/wp/v2', '');

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
 * Prüft die API-Endpunkte
 */
async function checkApiEndpoints() {
  try {
    log('=== ÜBERPRÜFUNG DER API-ENDPUNKTE ===', colors.green);
    
    // 1. Prüfe die WordPress REST API Basis
    log('\nPrüfe WordPress REST API Basis...', colors.blue);
    const rootResponse = await axios.get(WP_ROOT_URL);
    log(`WordPress REST API erreichbar: ${rootResponse.status === 200 ? 'Ja' : 'Nein'}`, 
        rootResponse.status === 200 ? colors.green : colors.red);
    
    // 2. Prüfe verfügbare Namespaces
    log('\nPrüfe verfügbare Namespaces...', colors.blue);
    const namespaceResponse = await axios.get(`${WP_ROOT_URL}/`);
    const namespaces = namespaceResponse.data?.namespaces || [];
    log(`Verfügbare Namespaces: ${namespaces.join(', ')}`, colors.cyan);
    
    // 3. Prüfe ACF-Endpunkt (falls vorhanden)
    log('\nPrüfe Advanced Custom Fields Endpunkt...', colors.blue);
    try {
      const acfResponse = await axios.get(`${WP_ROOT_URL}/acf/v3`);
      log('ACF REST API Endpunkt gefunden!', colors.green);
    } catch (error) {
      log('ACF REST API Endpunkt nicht gefunden oder nicht zugänglich.', colors.yellow);
    }
    
    // 4. Prüfe Beitrags-Meta Endpunkt
    log('\nPrüfe Beitrags-Meta Endpunkt...', colors.blue);
    try {
      const beitrag = await getSpecificPost();
      if (beitrag) {
        log(`Beitrag gefunden: "${beitrag.title.rendered}" (ID: ${beitrag.id})`, colors.cyan);
        
        // Versuche, Meta-Daten zu bekommen
        try {
          const metaResponse = await axios.get(`${API_URL}/posts/${beitrag.id}/meta`);
          log('Meta-Daten Endpunkt ist verfügbar!', colors.green);
          log(`Anzahl der Meta-Felder: ${Object.keys(metaResponse.data).length}`, colors.cyan);
          log('Meta-Felder:', colors.cyan);
          console.log(metaResponse.data);
        } catch (error) {
          log('Meta-Daten Endpunkt nicht verfügbar oder keine Berechtigung.', colors.yellow);
        }
      }
    } catch (error) {
      log('Fehler beim Prüfen des Beitrags-Meta Endpunkts.', colors.red);
    }
  } catch (error) {
    log(`Fehler beim Prüfen der API-Endpunkte: ${error.message}`, colors.red);
  }
}

/**
 * Holt einen Beitrag für weitere Tests
 */
async function getSpecificPost() {
  try {
    const response = await axios.get(`${API_URL}/posts?per_page=1`);
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    log(`Fehler beim Abrufen eines Beitrags: ${error.message}`, colors.red);
    return null;
  }
}

/**
 * Prüft, ob "translation_id" in der API sichtbar ist
 */
async function checkTranslationId() {
  try {
    log('\n=== PRÜFUNG DES TRANSLATION_ID FELDES ===', colors.green);
    
    // 1. Hole einen Beitrag für die Prüfung
    const post = await getSpecificPost();
    if (!post) {
      log('Konnte keinen Beitrag für die Prüfung finden.', colors.red);
      return;
    }
    
    log(`Beitrag für Prüfung: "${post.title.rendered}" (ID: ${post.id})`, colors.cyan);
    
    // 2. Überprüfe, ob Meta-Daten im Beitrag vorhanden sind
    log('\nPrüfe vorhandene Meta-Daten im Beitrag...', colors.blue);
    if (post.meta) {
      log('Beitrag enthält Meta-Daten!', colors.green);
      log('Verfügbare Meta-Felder:', colors.cyan);
      console.log(post.meta);
      
      if (post.meta.translation_id) {
        log(`Translation ID gefunden: ${post.meta.translation_id}`, colors.green);
      } else {
        log('Keine Translation ID im Beitrag gefunden.', colors.yellow);
      }
    } else {
      log('Beitrag enthält keine Meta-Daten oder sie sind nicht in der API sichtbar.', colors.yellow);
      log('Überprüfe, ob META im _fields Parameter enthalten ist.', colors.yellow);
      
      // 3. Hole explizit mit Meta-Feldern
      const urlWithMeta = `${API_URL}/posts/${post.id}?_fields=id,title,meta`;
      log(`\nVersuche Beitrag mit expliziter Meta-Anfrage: ${urlWithMeta}`, colors.blue);
      
      try {
        const metaResponse = await axios.get(urlWithMeta);
        if (metaResponse.data.meta) {
          log('Meta-Daten mit expliziter Anfrage gefunden!', colors.green);
          log('Verfügbare Meta-Felder:', colors.cyan);
          console.log(metaResponse.data.meta);
        } else {
          log('Keine Meta-Daten gefunden, auch nicht mit expliziter Anfrage.', colors.red);
        }
      } catch (error) {
        log(`Fehler bei expliziter Meta-Anfrage: ${error.message}`, colors.red);
      }
    }
    
    // 4. Prüfe ACF-Felder separat, falls ACF verwendet wird
    log('\nPrüfe mögliche ACF-Felder...', colors.blue);
    try {
      const acfUrl = `${API_URL}/posts/${post.id}?_fields=id,title,acf`;
      const acfResponse = await axios.get(acfUrl);
      
      if (acfResponse.data.acf) {
        log('ACF-Felder gefunden!', colors.green);
        log('Verfügbare ACF-Felder:', colors.cyan);
        console.log(acfResponse.data.acf);
        
        if (acfResponse.data.acf.translation_id) {
          log(`Translation ID in ACF gefunden: ${acfResponse.data.acf.translation_id}`, colors.green);
        } else {
          log('Keine Translation ID in ACF-Feldern gefunden.', colors.yellow);
        }
      } else {
        log('Keine ACF-Felder im Beitrag gefunden.', colors.yellow);
      }
    } catch (error) {
      log(`Fehler beim Prüfen der ACF-Felder: ${error.message}`, colors.red);
    }
  } catch (error) {
    log(`Fehler beim Prüfen der Translation ID: ${error.message}`, colors.red);
  }
}

/**
 * Hauptfunktion
 */
async function main() {
  log('=== TEST DER BENUTZERDEFINIERTEN FELDER BEGONNEN ===', colors.green);
  
  await checkApiEndpoints();
  await checkTranslationId();
  
  log('\n=== TEST DER BENUTZERDEFINIERTEN FELDER ABGESCHLOSSEN ===', colors.green);
}

// Führe den Test aus
main(); 