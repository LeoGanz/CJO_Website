import { getResponsiveUrl, getLogoUrl, cloudinaryInstance } from '../utils/cloudinary';

// Hero image public ID (constant for easy replacement)
const HERO_IMAGE_PUBLIC_ID = 'gruppenfoto_hinterhalt';

// Concert poster public ID (constant for easy replacement)
const CONCERT_POSTER_PUBLIC_ID = '251107_hinterhalt_plakat';

// Logo public ID (constant for easy replacement)
const LOGO_PUBLIC_ID = 'logo';

export function initImages() {
    // =========================================
    // Hero Background Image Setup
    // =========================================

    const heroBackgroundImg = document.getElementById('hero-background') as HTMLImageElement;
    if (heroBackgroundImg) {
        heroBackgroundImg.setAttribute('data-src', getResponsiveUrl(HERO_IMAGE_PUBLIC_ID));
    }

    // =========================================
    // Concert Poster Image Setup
    // =========================================

    const concertPosterImg = document.getElementById('concert-poster') as HTMLImageElement;
    if (concertPosterImg) {
        concertPosterImg.setAttribute('data-src', getResponsiveUrl(CONCERT_POSTER_PUBLIC_ID));
    }

    // =========================================
    // Logo Images Setup
    // =========================================

    const logoUrl = getLogoUrl(LOGO_PUBLIC_ID);

    // Update all logo images by ID
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

    // Initialize Cloudinary responsive images
    // This will process all images with class "cld-responsive" and "data-src" attribute
    cloudinaryInstance.responsive();
}
