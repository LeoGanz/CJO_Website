import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { HtmlImageLayer, responsive, placeholder } from '@cloudinary/html';

// Configuration
const CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'cjo';

// ============================================================================
// CLOUDINARY PUBLIC IDs FOR TEMPORARY CONCERT ASSETS (24.10.2026)
// Insert your Cloudinary public IDs here once uploaded to Cloudinary:
// Leave empty string ('') to automatically serve directly from local /assets/.
// ============================================================================
export const TEMPORARY_HERO_BACKGROUND_CLOUDINARY_ID = 'hero_band1_wsvuty'; // <-- INSERT HERO BACKGROUND ID HERE (e.g. 'hero_band1')
export const TEMPORARY_CONCERT_POSTER_CLOUDINARY_ID = '2026-09-25_Plakat_Hinterhalt_24.10.26_yxgelu';   // <-- INSERT CONCERT POSTER ID HERE (e.g. 'plakat_hinterhalt_241026')

// Local asset paths (used when Cloudinary IDs are not set or during local development)
const LOCAL_HERO_BACKGROUND_PATH = '/assets/hero_band1.png';
const LOCAL_CONCERT_POSTER_PATH = '/assets/2026-09-25 Plakat Hinterhalt 24.10.26.png';

// Standard non-temporary public IDs
const LOGO_PUBLIC_ID = 'logo';

// Initialize Cloudinary for URL generation
const cloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUD_NAME,
    },
    url: {
        secure: true,
    },
});

export function initImages() {
    // =========================================
    // Hero Background Image (Concert Special)
    // =========================================
    const heroBackgroundImg = document.getElementById('hero-background') as HTMLImageElement;
    if (heroBackgroundImg) {
        if (TEMPORARY_HERO_BACKGROUND_CLOUDINARY_ID) {
            const heroImage = new CloudinaryImage(TEMPORARY_HERO_BACKGROUND_CLOUDINARY_ID, { cloudName: CLOUD_NAME });
            new HtmlImageLayer(heroBackgroundImg, heroImage, [
                responsive({ steps: 200 }),
                placeholder({ mode: 'predominant-color' })
            ]);
            heroBackgroundImg.onerror = () => {
                heroBackgroundImg.src = LOCAL_HERO_BACKGROUND_PATH;
            };
        } else {
            heroBackgroundImg.src = LOCAL_HERO_BACKGROUND_PATH;
        }
    }

    // =========================================
    // Concert Poster Image (Concert Special)
    // =========================================
    const concertPosterImg = document.getElementById('concert-poster') as HTMLImageElement;
    if (concertPosterImg) {
        if (TEMPORARY_CONCERT_POSTER_CLOUDINARY_ID) {
            const posterImage = new CloudinaryImage(TEMPORARY_CONCERT_POSTER_CLOUDINARY_ID, { cloudName: CLOUD_NAME });
            new HtmlImageLayer(concertPosterImg, posterImage, [
                responsive({ steps: 200 })
            ]);
            concertPosterImg.onerror = () => {
                concertPosterImg.src = LOCAL_CONCERT_POSTER_PATH;
            };
        } else {
            concertPosterImg.src = LOCAL_CONCERT_POSTER_PATH;
        }
    }

    // =========================================
    // Logo Images (Fixed Size)
    // =========================================
    const logoUrl = cloudinary
        .image(LOGO_PUBLIC_ID)
        .resize(scale().width(400))
        .delivery(format(autoFormat()))
        .delivery(quality(autoQuality()))
        .toURL();

    // Update all logo images
    const heroLogo = document.getElementById('hero-logo') as HTMLImageElement;
    const navLogo = document.getElementById('nav-logo') as HTMLImageElement;
    const footerLogo = document.getElementById('footer-logo') as HTMLImageElement;

    if (heroLogo) heroLogo.src = logoUrl;
    if (navLogo) navLogo.src = logoUrl;
    if (footerLogo) footerLogo.src = logoUrl;

    // Update favicon
    const faviconLink = document.getElementById('favicon') as HTMLLinkElement;
    if (faviconLink) {
        faviconLink.href = logoUrl;
    }
}


