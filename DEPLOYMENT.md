# Deployment Guide für Cloudflare Pages

## Vorbereitungen

1. Stellen Sie sicher, dass alle Änderungen committed sind
2. Testen Sie den Production Build lokal:
   ```bash
   npm run build
   npm run preview
   ```

## Cloudflare Pages Setup

### Erstmaliges Setup

1. **Cloudflare Dashboard öffnen**
   - Gehen Sie zu https://dash.cloudflare.com
   - Navigieren Sie zu "Pages" im linken Menü

2. **Neues Projekt erstellen**
   - Klicken Sie auf "Create a project"
   - Wählen Sie "Connect to Git"

3. **Repository verbinden**
   - Autorisieren Sie Cloudflare mit GitHub/GitLab
   - Wählen Sie das Repository aus

4. **Build-Konfiguration**
   ```
   Project name: cico-jazz-orchester (oder Ihr bevorzugter Name)
   Production branch: main (oder master)
   Build command: npm run build
   Build output directory: dist
   Root directory: / (leer lassen)
   ```

5. **Environment Variables** (optional)
   - Derzeit keine notwendig
   - Später für Backend-Services (z.B. Kontaktformular API)

6. **Deploy**
   - Klicken Sie auf "Save and Deploy"
   - Erste Deployment dauert 2-3 Minuten

### Nach jedem Update

Cloudflare Pages deployed automatisch bei jedem Push zum Repository!

```bash
git add .
git commit -m "Update: Beschreibung der Änderungen"
git push origin main
```

Cloudflare baut und deployed automatisch innerhalb von 2-3 Minuten.

## Custom Domain einrichten

1. **Im Cloudflare Dashboard**
   - Gehen Sie zu Ihrem Pages-Projekt
   - Klicken Sie auf "Custom domains"
   - Klicken Sie auf "Set up a custom domain"

2. **Domain hinzufügen**
   - Geben Sie Ihre Domain ein (z.B. `cicojazzorchester.de`)
   - Cloudflare zeigt Ihnen die DNS-Einstellungen

3. **DNS-Konfiguration**
   - Wenn Domain bereits bei Cloudflare: Automatisch konfiguriert
   - Wenn Domain extern: Fügen Sie die CNAME-Records hinzu:
     ```
     CNAME @ your-project.pages.dev
     CNAME www your-project.pages.dev
     ```

4. **SSL/HTTPS**
   - Cloudflare aktiviert automatisch SSL
   - Zertifikat wird innerhalb von 24h ausgestellt

## Kontaktformular Backend (Optional)

Da die Seite statisch ist, benötigt das Kontaktformular einen Backend-Service:

### Option 1: Formspree (Einfachste Lösung)

1. Kostenlos anmelden auf https://formspree.io
2. Neues Formular erstellen
3. In `index.html` das `<form>` Tag anpassen:
   ```html
   <form class="contact__form" id="contact-form" 
         action="https://formspree.io/f/YOUR_FORM_ID" 
         method="POST">
   ```
4. JavaScript in `src/main.ts` kann entfernt/vereinfacht werden

### Option 2: Cloudflare Workers

1. Worker erstellen für E-Mail-Versand
2. In `src/main.ts` die API-URL anpassen
3. Worker bei Cloudflare deployen

Beispiel Worker-Code:
```javascript
export default {
  async fetch(request) {
    const formData = await request.json();
    
    // E-Mail über SendGrid, Mailgun, etc. versenden
    // ...
    
    return new Response(JSON.stringify({ success: true }));
  }
}
```

### Option 3: Netlify Functions

Falls Sie auf Netlify wechseln, können Sie Netlify Forms verwenden:
```html
<form name="contact" netlify>
```

## Monitoring & Analytics

### Cloudflare Analytics

Cloudflare Pages bietet kostenlose Analytics:
- Besucher-Statistiken
- Traffic-Quellen
- Performance-Metriken

### Google Analytics (Optional)

In `index.html` vor `</head>` einfügen:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Performance-Optimierung

### Bilder optimieren

Vor dem Deployment Bilder komprimieren:

```bash
# Mit ImageMagick (empfohlen für JPG)
convert assets/DSCF9100.JPG -quality 85 -strip assets/DSCF9100.JPG

# Oder mit TinyPNG (Online-Tool)
# https://tinypng.com
```

### WebP-Format nutzen

Moderne Browser unterstützen WebP:
```bash
# Konvertierung mit cwebp
cwebp -q 85 assets/DSCF9100.JPG -o assets/DSCF9100.webp
```

In HTML beide Formate anbieten:
```html
<picture>
  <source srcset="assets/DSCF9100.webp" type="image/webp">
  <img src="assets/DSCF9100.JPG" alt="Konzert">
</picture>
```

## Troubleshooting

### Build schlägt fehl

**Lösung 1:** Node-Version prüfen
```bash
# In Cloudflare Pages Build Settings
NODE_VERSION=18
```

**Lösung 2:** Dependencies überprüfen
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Bilder werden nicht angezeigt

- Prüfen Sie die Pfade (relativ zu `index.html`)
- Cloudflare Pages berücksichtigt case-sensitivity
- Stellen Sie sicher, dass alle Bilder im Repository sind

### Smooth Scrolling funktioniert nicht

- Browser-Cache leeren
- DevTools Console auf Fehler prüfen
- Lenis-Version überprüfen

### Instagram QR-Code erscheint nicht

- QRCode-Library korrekt installiert?
- Console-Fehler prüfen
- Canvas-Element im DOM vorhanden?

## Backup & Rollback

Cloudflare Pages speichert alle Deployments:

1. Im Dashboard zu "Deployments" navigieren
2. Frühere Version auswählen
3. "Rollback" oder "Retry" klicken

## Kosten

Cloudflare Pages ist kostenlos für:
- Unbegrenzte Requests
- Unbegrenzte Bandwidth
- 500 Builds pro Monat
- 20.000 Dateien

Perfekt für diese Website!

## Support

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Community Discord**: https://discord.gg/cloudflaredev
- **Website-Entwickler**: siehe Impressum

