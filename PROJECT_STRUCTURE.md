# Projekt-Struktur

Dokumentation der Ordnerstruktur des Cico Jazz Orchester Website-Projekts.

## Überblick

```
CJO_Website/
├── index.html                  # Hauptseite (bleibt im Root für Vite)
├── impressum.html             # Impressum/Legal
│
├── src/                        # Source-Code
│   ├── main.ts                # Haupt-TypeScript-Datei
│   └── styles/                # SCSS-Styles (modular organisiert)
│       ├── main.scss          # Haupt-Style-Datei
│       ├── base/              # Grundlagen (Variables, Reset, Animations)
│       ├── utilities/         # Utility-Klassen
│       ├── components/        # Wiederverwendbare Komponenten
│       ├── layout/            # Layout-Strukturen (Navigation, Footer)
│       └── sections/          # Seiten-Sektionen (Hero, About, etc.)
│
├── dist/                       # Build-Output (generiert)
├── node_modules/              # Dependencies
│
└── Konfigurationsdateien:
    ├── package.json           # NPM-Konfiguration
    ├── tsconfig.json          # TypeScript-Konfiguration
    ├── vite.config.ts         # Vite-Konfiguration (Multi-Page)
    ├── README.md              # Projekt-README
    ├── DEPLOYMENT.md          # Deployment-Anleitung
    └── PROJECT_STRUCTURE.md   # Diese Datei
```

## Details

### HTML-Dateien

#### index.html
- **Speicherort:** Root-Verzeichnis
- **Grund:** Vite verwendet `index.html` im Root als Entry Point
- **Inhalt:** Hauptseite mit allen Sektionen (Hero, About, Konzerte, etc.)

#### impressum.html
- **Speicherort:** Root-Verzeichnis
- **Grund:** Konsistenz mit index.html im Root
- **Zugriff:** `/impressum.html` (Dev) oder `/impressum.html` (Production)
- **Link:** Wird im Footer der Hauptseite verlinkt

### Multi-Page-Konfiguration

Die `vite.config.ts` ist für Multi-Page-Apps konfiguriert:

```typescript
rollupOptions: {
  input: {
    main: resolve(__dirname, 'index.html'),
    impressum: resolve(__dirname, 'impressum.html'),
  },
}
```

Dies ermöglicht:
- Separate Builds für jede Seite
- Shared Styles und Scripts
- Optimierte Production Builds

### Styles-Struktur

Die SCSS-Dateien sind modular in Unterordner organisiert:

- **base/**: Grundlegende Styles (Variables, Reset, Animations)
- **utilities/**: Helper-Klassen
- **components/**: Wiederverwendbare UI-Komponenten
- **layout/**: Strukturelle Layout-Elemente
- **sections/**: Spezifische Sektionen der Hauptseite

Siehe `src/styles/README.md` für Details.

### Assets

- Werden über Cloudinary geladen

## Hinzufügen neuer Seiten

### 1. HTML-Datei erstellen
```bash
# Neue Seite im Root erstellen
touch neue-seite.html
```

### 2. Vite-Config aktualisieren
```typescript
// vite.config.ts
rollupOptions: {
  input: {
    main: resolve(__dirname, 'index.html'),
    impressum: resolve(__dirname, 'impressum.html'),
    neueSeite: resolve(__dirname, 'neue-seite.html'), // Neu
  },
}
```

### 3. Styles einbinden
```html
<!-- neue-seite.html -->
<link rel="stylesheet" href="/src/styles/main.scss">
```

### 4. Verlinken
```html
<!-- Von index.html -->
<a href="/neue-seite.html">Neue Seite</a>
```

## Build & Development

```bash
# Development Server starten
npm run dev

# Production Build
npm run build

# Preview des Production Builds
npm run preview
```

### Build-Output

Nach `npm run build` enthält `dist/`:
```
dist/
├── index.html              # Hauptseite
├── impressum.html          # Impressum
└── assets/                 # Optimierte Assets
    ├── *.css               # Kompilierte Styles
    ├── *.js                # Gebündeltes JavaScript
```

## Vorteile dieser Struktur

✅ **Klar organisiert:** Jeder Dateityp hat seinen Platz
✅ **Skalierbar:** Neue Seiten/Komponenten leicht hinzufügbar
✅ **Wartbar:** Modulare Styles mit @use-Syntax
✅ **Performant:** Vite-optimierte Builds + Bildkompression
✅ **Schlanker:** 84% kleinere Bilddateien ohne Qualitätsverlust
✅ **Vite-konform:** Nutzt Vite Best Practices

## Best Practices

1. **Alle HTML-Seiten im Root** - Konsistenz und Vite Convention
3. **Modulare Styles** - Einfacher zu warten
4. **Multi-Page-Config** - Optimierte Builds pro Seite

