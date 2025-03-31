# ACF-Felder in der WordPress REST API sichtbar machen

Es gibt mehrere Möglichkeiten, deine ACF-Felder (wie das `translation_id` Feld) in der WordPress REST API sichtbar zu machen:

## Methode 1: Über die ACF-Feldkonfiguration (Einfachste Methode)

Neuere Versionen von ACF (ab Version 5.9) haben eine integrierte Option, um Felder in der REST API anzuzeigen:

1. Gehe zu **Benutzerdefinierte Felder** in deinem WordPress-Admin
2. Bearbeite deine Feldgruppe mit dem "translation_id" Feld
3. Klicke auf das Feld "translation_id" um die Feldeinstellungen zu öffnen
4. Scrolle nach unten und suche nach der Option "In REST API anzeigen"
5. Aktiviere diese Option
6. Speichere die Feldgruppe

## Methode 2: Über functions.php (Erfordert Zugang zur theme's functions.php)

Wenn die obige Option nicht verfügbar ist, kannst du die Sichtbarkeit über Code aktivieren:

```php
// Füge diesen Code in die functions.php deines Themes oder Child-Themes ein
add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');

// Oder für ein spezifisches Feld:
add_filter('acf/rest_api/field_settings/show_in_rest/name=translation_id', '__return_true');
```

## Methode 3: ACF to REST API Plugin

Es gibt ein Plugin namens "ACF to REST API", das alle ACF-Felder automatisch in der REST API verfügbar macht:

1. Installiere das Plugin "ACF to REST API" von GitHub: https://github.com/airesvsg/acf-to-rest-api
2. Aktiviere das Plugin
3. Deine ACF-Felder werden automatisch unter dem `/wp-json/wp/v2/posts/ID?_fields=id,title,acf` Endpunkt verfügbar sein

## Methode 4: Manuelle Registrierung der Felder

Wenn keine der obigen Methoden funktioniert, kannst du deine Felder manuell für die REST API registrieren:

```php
// Füge diesen Code in die functions.php deines Themes oder Child-Themes ein
function register_acf_meta_fields() {
  register_post_meta('post', 'translation_id', array(
    'show_in_rest' => true,
    'single' => true,
    'type' => 'string',
  ));
}
add_action('init', 'register_acf_meta_fields');
```

## Nach der Konfiguration

Nachdem du eine dieser Methoden implementiert hast:

1. Speichere die Änderungen
2. Aktualisiere einen Beitrag mit dem translation_id Feld, um sicherzustellen, dass die Daten korrekt gespeichert werden
3. Teste mit einem API-Aufruf, ob die Felder nun sichtbar sind:
   ```
   http://blog.zauberfunken.com/wp-json/wp/v2/posts?_fields=id,title,acf
   ```
   oder für einen einzelnen Beitrag:
   ```
   http://blog.zauberfunken.com/wp-json/wp/v2/posts/BEITRAG_ID?_fields=id,title,acf
   ```

## Häufige Probleme

1. **Leere Werte**: Stelle sicher, dass du tatsächlich Werte für das Feld eingegeben hast
2. **Falsche Feldtypen**: Stelle sicher, dass du den richtigen Feldtyp (Text) verwendest
3. **Caching**: WordPress und Browser können Ergebnisse zwischenspeichern - versuche, den Cache zu leeren 