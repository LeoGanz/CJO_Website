# Styles Structure

Diese Dokumentation beschreibt die modulare SCSS-Struktur des Projekts.

## Dateistruktur

```
src/styles/
├── main.scss                  # Hauptdatei - lädt alle Module
│
├── base/                      # Grundlagen & Konfiguration
│   ├── _index.scss           # Index-Datei für base-Module
│   ├── _variables.scss       # Farben, Schriftarten, Transitions
│   ├── _base.scss            # CSS Reset & Basis-Styles
│   └── _animations.scss      # Keyframe-Animationen
│
├── utilities/                 # Utility-Klassen
│   ├── _index.scss           # Index-Datei für utility-Module
│   └── _utilities.scss       # Helper-Klassen (.container, .section-title, etc.)
│
├── components/                # Wiederverwendbare Komponenten
│   ├── _index.scss           # Index-Datei für component-Module
│   ├── _buttons.scss         # Button-Styles
│   └── _forms.scss           # Formular-Styles
│
├── layout/                    # Layout-Strukturen
│   ├── _index.scss           # Index-Datei für layout-Module
│   ├── _navigation.scss      # Navigation-Styles
│   └── _footer.scss          # Footer-Styles
│
├── sections/                  # Seiten-Sektionen
│   ├── _index.scss           # Index-Datei für section-Module
│   ├── _hero.scss            # Hero-Sektion
│   ├── _about.scss           # About-Sektion
│   ├── _next-concert.scss    # Next Concert-Sektion
│   ├── _gallery.scss         # Gallery-Sektion & Lightbox
│   ├── _instagram.scss       # Instagram-Sektion
│   └── _contact.scss         # Contact-Sektion
│
└── README.md                  # Diese Datei
```

## Moderne SCSS-Syntax

Das Projekt verwendet die moderne `@use`/`@forward`-Syntax statt der deprecated `@import`-Direktive:

### @use vs @import

```scss
// ❌ Alt (deprecated)
@import 'variables';
@import 'base';

// ✅ Neu (modern)
@use 'base/variables' as *;  // Lädt Variablen ohne Namespace
@use 'base';                  // Lädt mit Namespace (base.$color-brass)
```

### Module mit @forward

Jeder Ordner hat eine `_index.scss`-Datei, die alle Module des Ordners weiterleitet:

```scss
// base/_index.scss
@forward 'variables';
@forward 'base';
@forward 'animations';
```

Dadurch kann man in `main.scss` einfach schreiben:
```scss
@use 'base';  // Lädt alle base-Module
```

## Variablen

Alle Farben, Schriftarten und andere Konfigurationswerte sind in `base/_variables.scss` definiert:

### Farben
- `$color-bg-dark` - Haupthintergrund (#0a0a0a)
- `$color-bg-medium` - Mittlerer Hintergrund (#1a1514)
- `$color-burgundy` - Akzentfarbe Burgundy (#8b1e3f)
- `$color-brass` - Akzentfarbe Brass/Gold (#d4a574)
- `$color-text-light` - Heller Text (#f5f5f5)
- `$color-text-muted` - Gedämpfter Text (#b8b8b8)

### Schriftarten
- `$font-heading` - 'Playfair Display', serif (Überschriften)
- `$font-body` - 'Inter', sans-serif (Fließtext)

### Transitions
- `$transition-smooth` - cubic-bezier(0.4, 0, 0.2, 1)

## Module verwenden

### In einem neuen Modul Variablen nutzen

```scss
// sections/_new-section.scss
@use '../base/variables' as *;  // Importiert alle Variablen ohne Namespace

.new-section {
    background: $color-bg-dark;
    color: $color-text-light;
}
```

### Neues Modul zum Ordner hinzufügen

1. Erstelle Datei im entsprechenden Ordner: `sections/_new-section.scss`
2. Füge `@use '../base/variables' as *;` am Anfang hinzu
3. Aktualisiere die `_index.scss` im Ordner:
   ```scss
   @forward 'new-section';
   ```

Das Modul wird automatisch in `main.scss` geladen!

## Organisationsprinzip

Die Module sind nach Verantwortlichkeit organisiert:

1. **base/** - Grundlegende Styles, die überall verwendet werden
2. **utilities/** - Helper-Klassen für schnelles Styling
3. **components/** - Wiederverwendbare UI-Komponenten
4. **layout/** - Strukturelle Layout-Elemente
5. **sections/** - Spezifische Sektionen der Website

## Best Practices

✅ **Do:**
- Verwende `@use` statt `@import`
- Nutze BEM-Notation (Block__Element--Modifier)
- Verwende Variablen statt harter Werte
- Nutze `clamp()` für responsive Schriftgrößen
- Halte Module fokussiert und klein

❌ **Don't:**
- Vermeide tiefe Verschachtelungen (max. 3-4 Ebenen)
- Keine globalen Styles außerhalb von base/
- Keine hartcodierten Farben oder Schriftarten

## Build

Die SCSS-Dateien werden von Vite automatisch kompiliert:

```bash
npm run dev    # Development mit HMR
npm run build  # Production Build
npm run preview # Preview des Production Builds
```

## Vorteile dieser Struktur

1. **Modular** - Jede Datei hat einen klaren Zweck
2. **Wartbar** - Änderungen sind einfach zu finden
3. **Skalierbar** - Neue Module lassen sich leicht hinzufügen
4. **Performance** - Sass kann Abhängigkeiten optimieren
5. **Team-freundlich** - Mehrere Entwickler können parallel arbeiten
6. **Modern** - Nutzt aktuelle Sass-Features ohne Deprecation-Warnungen
