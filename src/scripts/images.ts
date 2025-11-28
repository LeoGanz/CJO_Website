import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { HtmlImageLayer, responsive, placeholder } from '@cloudinary/html';

// Configuration
const CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'cjo';

// Image public IDs
const HERO_IMAGE_PUBLIC_ID = 'gruppenfoto_hinterhalt';
const CONCERT_POSTER_PUBLIC_ID = '251107_hinterhalt_plakat';
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
    // Hero Background Image
    // =========================================

    const heroBackgroundImg = document.getElementById('hero-background') as HTMLImageElement;
    if (heroBackgroundImg) {
        const heroImage = new CloudinaryImage(HERO_IMAGE_PUBLIC_ID, { cloudName: CLOUD_NAME });
        new HtmlImageLayer(heroBackgroundImg, heroImage, [
            //lazyload(),
            responsive({ steps: 200 }), // 200px step size for responsive images
            placeholder({ mode: 'predominant-color' }) // Show color placeholder while loading
        ]);
    }

    // =========================================
    // Concert Poster Image
    // =========================================

    const concertPosterImg = document.getElementById('concert-poster') as HTMLImageElement;
    if (concertPosterImg) {
        const posterImage = new CloudinaryImage(CONCERT_POSTER_PUBLIC_ID, { cloudName: CLOUD_NAME });
        new HtmlImageLayer(concertPosterImg, posterImage, [
            //lazyload(),
            responsive({ steps: 200 })
        ]);
    }

    // =========================================
    // Logo Images (Fixed Size)
    // =========================================

    // Generate logo URL (400px width for good quality that scales well)
    const smallLogoUrl = cloudinary
        .image(LOGO_PUBLIC_ID)
        .resize(scale().width(120))
        .delivery(format(autoFormat()))
        .delivery(quality(autoQuality()))
        .toURL();

    // Update all logo images
    const navLogo = document.getElementById('nav-logo') as HTMLImageElement;
    const footerLogo = document.getElementById('footer-logo') as HTMLImageElement;

    if (navLogo) navLogo.src = smallLogoUrl;
    if (footerLogo) footerLogo.src = smallLogoUrl;

    // Update favicon
    const faviconLink = document.getElementById('favicon') as HTMLLinkElement;
    if (faviconLink) {
        faviconLink.href = smallLogoUrl;
    }
}

