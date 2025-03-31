# Korrekte Einrichtung des ACF-Feldes für Translation ID

Nach unseren Tests ist das Translation ID Feld möglicherweise nicht richtig konfiguriert. Hier ist eine detaillierte Anleitung, wie du es korrekt einrichten kannst:

## Schritt 1: Überprüfe die bestehende Feldgruppe

1. Gehe zu **Benutzerdefinierte Felder** in deinem WordPress Admin-Bereich
2. Überprüfe, ob du bereits eine Feldgruppe für die Translation ID hast
3. Falls ja, bearbeite diese; falls nein, erstelle eine neue

## Schritt 2: Feldgruppe richtig konfigurieren

1. Gib der Feldgruppe einen klaren Namen, z.B. "Übersetzungsverknüpfung"
2. Stelle sicher, dass die Feldgruppe unter **Position** auf "Hoch" gesetzt ist (damit sie gut sichtbar ist)
3. Unter **Anzeigeregeln** wähle "Inhaltstyp ist gleich Beitrag"

## Schritt 3: Translation ID Feld richtig konfigurieren

1. Klicke auf das vorhandene Feld "translation_id" oder erstelle ein neues Feld
2. Stelle sicher, dass die folgenden Einstellungen korrekt sind:
   - **Feldbezeichnung**: "Translation ID"
   - **Feldname**: "translation_id" (Kleinbuchstaben, keine Leerzeichen oder Sonderzeichen)
   - **Feldtyp**: "Text" (nicht Number, Textarea oder etwas anderes)
   - **Anweisungen**: "ID zur Verknüpfung von Übersetzungen. Verwende dieselbe ID für Beiträge in verschiedenen Sprachen, die einander entsprechen."
   - **Erforderlich**: Optional (nicht ankreuzen)
   - **Standard-Wert**: Leer lassen

## Schritt 4: API-Sichtbarkeit aktivieren (Wichtig!)

Um sicherzustellen, dass das Feld in der REST API sichtbar ist:

1. Scrolle weiter nach unten in den Feldeinstellungen
2. Suche nach dem Abschnitt **REST API**
3. Aktiviere die Option "Dieses Feld in REST API Anfragen anzeigen"
4. Falls diese Option nicht vorhanden ist, musst du die Methode 2, 3 oder 4 aus der `acf-api-instructions.md` Datei verwenden

## Schritt 5: Feldgruppe speichern

1. Klicke auf "Aktualisieren" oder "Veröffentlichen", um die Feldgruppe zu speichern
2. Stelle sicher, dass keine Fehlermeldungen erscheinen

## Schritt 6: Beiträge aktualisieren

1. Gehe nun zu einem Beitrag, z.B. "Marina Bay" in der deutschen Version
2. Scrolle nach unten oder suche in der rechten Spalte nach dem "Translation ID" Feld
3. Gib dort den Wert "3" ein (für Marina Bay)
4. Klicke auf "Aktualisieren", um den Beitrag zu speichern
5. Wiederhole dies für die englische Version des gleichen Beitrags

## Schritt 7: Überprüfen

1. Führe unser Test-Script erneut aus:
   ```
   node test-translations.js
   ```
2. Überprüfe, ob die Translation IDs jetzt korrekt angezeigt werden

## Fehlerbehebung

Wenn das Feld immer noch nicht in der API sichtbar ist, versuche folgende Schritte:

1. **WordPress-Cache leeren**: Installiere ein Cache-Plugin wie WP Super Cache oder W3 Total Cache und leere den Cache
2. **Browser-Cache leeren**: Drücke CTRL+F5 in deinem Browser
3. **Alternative Methode**: Verwende stattdessen die native WordPress-Methode aus der `custom-meta-box.php` Datei

## Beispiel-Screenshots (Konzeptuell)

### Korrekte Feldkonfiguration
```
Feldbezeichnung: Translation ID
Feldname: translation_id
Feldtyp: Text
Anweisungen: ID zur Verknüpfung von Übersetzungen...
```

### REST API Einstellung aktivieren
```
[ ] In REST API Anfragen anzeigen
``` 