# Cico Jazz Orchester Website

Eine moderne, elegante Website für das Cico Jazz Orchester mit Jazz-Club-Atmosphäre.

## Features

- ✨ **Smooth Scrolling** mit Lenis für ein flüssiges Nutzererlebnis
- 🎨 **Jazz-Club-Design** mit dunklen Tönen, Burgunderrot und goldenen Akzenten
- 📱 **Vollständig responsiv** - optimiert für Desktop, Tablet und Mobile
- 🎭 **Interaktive Galerie** mit Lightbox-Funktion
- 📸 **Instagram Integration**:
  - Desktop: QR-Code zum Scannen mit dem Smartphone
  - Mobile: Direkter Link zur Instagram-App
- 📝 **Kontaktformular** mit Validierung
- 🚀 **Statische Website** - perfekt für Cloudflare Pages
- ⚡ **Vite** für schnelle Entwicklung mit Hot Module Replacement
- 🎯 **TypeScript** für typ-sichere Entwicklung
- 💅 **SCSS** für modulares, wartbares Styling

## Technologie-Stack

- **HTML5** - Semantische Struktur
- **SCSS** - Modernes CSS mit Variablen und Nesting
- **TypeScript** - Typ-sicheres JavaScript
- **Vite** - Build-Tool und Dev-Server
- **Lenis** - Smooth Scrolling Library
- **vite-plugin-image-optimizer** - Automatische Bildkompression
- **sharp** - High-performance Image Processing

## Lokale Entwicklung

### Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn

### Installation

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Der Dev-Server läuft standardmäßig auf `http://localhost:5173`

### Build für Produktion

```bash
# Production Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## Deployment auf Cloudflare Pages

### Option 1: Git-basiertes Deployment (Empfohlen)

1. Repository auf GitHub/GitLab pushen
2. Cloudflare Dashboard öffnen → Pages → Create a project
3. Repository verbinden
4. Build-Einstellungen:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
5. Deploy!

### Option 2: Direktes Upload

```bash
# Build erstellen
npm run build

# Wrangler installieren (falls nicht vorhanden)
npm install -g wrangler

# Bei Cloudflare anmelden
wrangler login

# Zu Cloudflare Pages deployen
wrangler pages publish dist --project-name=cico-jazz-orchester
```

### Umgebungsvariablen (Optional)

Für das Kontaktformular können Sie einen Backend-Service wie Formspree oder Netlify Forms verwenden. Fügen Sie die entsprechenden Umgebungsvariablen in Cloudflare Pages hinzu.

## Struktur

```
CJO_Website/
├── pages/                    # Zusätzliche HTML-Seiten
│   └── impressum.html       # Impressum (Multi-Page)
├── src/
│   ├── main.ts              # TypeScript Hauptdatei
│   └── styles/              # Modulare SCSS-Struktur
│       ├── main.scss        # Haupt-Entry-Point
│       ├── base/            # Grundlagen (Variablen, Reset)
│       ├── utilities/       # Helper-Klassen
│       ├── components/      # Wiederverwendbare Komponenten
│       ├── layout/          # Layout-Strukturen
│       └── sections/        # Seiten-Sektionen
├── index.html               # HTML Hauptdatei
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite + Image Optimizer Config
├── README.md
└── PROJECT_STRUCTURE.md     # Detaillierte Struktur-Doku
```

## Anpassungen

### Farben ändern

Die Farbvariablen befinden sich in `src/styles/main.scss`:

```scss
$color-bg-dark: #0a0a0a;
$color-burgundy: #8b1e3f;
$color-brass: #d4a574;
// ... weitere Farben
```

### Inhalte aktualisieren

- **Hero-Sektion**: `index.html` - Zeile 11-28
- **Über Uns**: `index.html` - Zeile 67-79
- **Nächstes Konzert**: `index.html` - Zeile 83-140
- **Galerie**: Fügen Sie Bilder in `assets/` hinzu und aktualisieren Sie die Galerie-Sektion

### Kontaktformular Backend

Das Kontaktformular ist derzeit Frontend-only. Für echte E-Mail-Funktionalität:

1. **Formspree**: 
   - Erstellen Sie ein kostenloses Konto auf [formspree.io](https://formspree.io)
   - Fügen Sie `action="https://formspree.io/f/YOUR_FORM_ID"` zum `<form>` hinzu

2. **Netlify Forms**:
   - Fügen Sie `netlify` und `name="contact"` zum `<form>` hinzu
   - Bei Cloudflare Pages müssen Sie einen Netlify Function Endpoint verwenden

3. **Custom Backend**:
   - Erstellen Sie einen Cloudflare Worker als Backend
   - Aktualisieren Sie `src/main.ts` - Funktion `contactForm.addEventListener('submit', ...)`

## Browser-Kompatibilität

- Chrome/Edge (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)
- iOS Safari (iOS 14+)
- Chrome Mobile (neueste Version)

## Performance

- ✨ **Smooth Scrolling** mit Hardware-Beschleunigung
- 🖼️ **Automatische Bildoptimierung** mit `vite-plugin-image-optimizer`:
  - JPEG: 85% Qualität mit mozjpeg Kompression
  - PNG: 85% Qualität, Kompressions-Level 9
  - **Durchschnittlich 80-85% Größensenkung** bei den Bildern
  - **Gesamtersparnis: ~35 MB pro Build**
- 🔄 **Lazy Loading** für Bilder
- 📦 **Minimierte CSS/JS** im Production Build
- 🚀 **Modernes Scss-Build** mit modern-compiler API

## Lizenz

Alle Rechte vorbehalten © 2025 Cico Jazz Orchester

## Kontakt

Für Fragen zur Website: info@cicojazzorchester.de

