import Lenis from 'lenis';
import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

// Declare global Cloudinary type from CDN script
declare global {
  interface Window {
    cloudinary: {
      Cloudinary: new (config: { cloud_name: string; secure?: boolean }) => {
        url: (publicId: string, options?: any) => string;
        responsive: (options?: any) => void;
      };
    };
  }
}

// =========================================
// Smooth Scrolling with Lenis
// =========================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Handle anchor link clicks for smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = anchor.getAttribute('href');
    if (target && target !== '#') {
      const element = document.querySelector(target);
      if (element) {
        lenis.scrollTo(element as HTMLElement, {
          offset: -80,
          duration: 1.5,
        });
      }
    }
  });
});

// =========================================
// Navigation Show/Hide on Scroll
// =========================================

const nav = document.querySelector('.nav') as HTMLElement;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Show nav after scrolling past hero
  if (currentScrollY > window.innerHeight * 0.5) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
});

// =========================================
// Mobile Burger Menu
// =========================================

const burgerMenu = document.getElementById('burger-menu') as HTMLElement;
const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;

// Clone menu items from desktop to mobile menu
const desktopMenu = document.querySelector('.nav__menu') as HTMLElement;
const mobileList = mobileMenu?.querySelector('.nav__mobile-list') as HTMLElement;

if (desktopMenu && mobileList) {
  // Clone the list items
  const menuItems = desktopMenu.querySelectorAll('li');
  menuItems.forEach((item) => {
    const clonedItem = item.cloneNode(true) as HTMLElement;
    mobileList.appendChild(clonedItem);
  });
}

burgerMenu?.addEventListener('click', () => {
  burgerMenu.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu?.querySelectorAll('a');
mobileLinks?.forEach((link) => {
  link.addEventListener('click', () => {
    // Close menu immediately since smooth scroll is handled globally
    burgerMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// =========================================
// Social Media QR Code / Mobile Detection
// =========================================

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

function initSocialMediaSection(platform: 'instagram' | 'youtube') {
  const qrContainer = document.getElementById(`${platform}-qr`) as HTMLElement;
  const mobileContainer = document.getElementById(`${platform}-mobile`) as HTMLElement;
  
  if (!qrContainer || !mobileContainer) return;
  
  if (isMobileDevice()) {
    // Show mobile buttons
    mobileContainer.classList.add('visible');
    qrContainer.classList.remove('visible');
  } else {
    // Show QR code for desktop
    qrContainer.classList.add('visible');
    mobileContainer.classList.remove('visible');
  }
}

function initSocialMediaSections() {
  initSocialMediaSection('instagram');
  initSocialMediaSection('youtube');
}

// Handle window resize
let resizeTimeout: number;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    initSocialMediaSections();
  }, 250);
});

// Initialize on load
initSocialMediaSections();

// =========================================
// Cloudinary Configuration
// =========================================

const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'cjo';

// Initialize Cloudinary URL-gen for building fixed-size URLs
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
  url: {
    secure: true,
  },
});

// Initialize Cloudinary Core for responsive functionality
// Uses global Cloudinary from CDN script (cloudinary-core-shrinkwrap.js)
const cloudinaryInstance = new window.cloudinary.Cloudinary({
  cloud_name: cloudName,
  secure: true,
});

// Hero image public ID (constant for easy replacement)
const HERO_IMAGE_PUBLIC_ID = 'gruppenfoto_hinterhalt';

// Concert poster public ID (constant for easy replacement)
const CONCERT_POSTER_PUBLIC_ID = '251107_hinterhalt_plakat';

// QR code public IDs (constants for easy replacement)
const QR_INSTAGRAM_PUBLIC_ID = 'qr_ig';
const QR_YOUTUBE_PUBLIC_ID = 'qr_yt';

// Logo public ID (constant for easy replacement)
const LOGO_PUBLIC_ID = 'logo';

// Gallery image data
interface GalleryImage {
  publicId: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { publicId: 'sophia_axtmann', alt: 'Sängerin Sophia Axtmann' },
  { publicId: 'saxes', alt: 'Saxophonsection' },
  { publicId: 'gesangsduo_craivoa', alt: 'Gesangsduo auf dem Craivo Jazz Festival' },
  { publicId: 'hinterhalt_buehne', alt: 'Auftritt im Hinterhalt' },
  { publicId: 'bassist', alt: 'Bassist' },
  { publicId: 'gruppenfoto_craiova', alt: 'Gruppenfoto' },
];

// Generate Cloudinary responsive URL
// Uses w_auto/dpr_auto - Cloudinary will automatically replace with actual values based on viewport and DPR
function getResponsiveUrl(publicId: string): string {
  return cloudinaryInstance.url(publicId, {
    crop: 'limit',
    width: 'auto',
    dpr: 'auto',
    quality: 'auto',
    fetchFormat: 'auto',
  });
}

function getGalleryFullUrl(publicId: string): string {
  // Full-size URL for lightbox (not responsive, fixed size)
  return cld
    .image(publicId)
    .resize(scale().width(1920))
    .delivery(format(autoFormat()))
    .delivery(quality(autoQuality()))
    .toURL();
}

function getQrCodeUrl(publicId: string): string {
  // Fixed-size URL for QR codes (250px width is appropriate for QR codes)
  return cld
    .image(publicId)
    .resize(scale().width(250))
    .delivery(format(autoFormat()))
    .delivery(quality(autoQuality()))
    .toURL();
}

function getLogoUrl(publicId: string): string {
  // Logo URL - fixed size (400px for good quality that scales well)
  // SVG format will be preserved with auto format
  return cld
    .image(publicId)
    .resize(scale().width(400))
    .delivery(format(autoFormat()))
    .delivery(quality(autoQuality()))
    .toURL();
}

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
// QR Code Images Setup
// =========================================

const qrInstagramImg = document.querySelector('#instagram-qr img') as HTMLImageElement;
const qrYouTubeImg = document.querySelector('#youtube-qr img') as HTMLImageElement;

if (qrInstagramImg) {
  qrInstagramImg.src = getQrCodeUrl(QR_INSTAGRAM_PUBLIC_ID);
}

if (qrYouTubeImg) {
  qrYouTubeImg.src = getQrCodeUrl(QR_YOUTUBE_PUBLIC_ID);
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

// =========================================
// Dynamic Gallery Generation
// =========================================

const galleryGrid = document.querySelector('.gallery__grid') as HTMLElement;

if (galleryGrid) {
  // Clear existing static content
  galleryGrid.innerHTML = '';
  
  // Generate gallery items with responsive images
  galleryImages.forEach((image, index) => {
    const responsiveUrl = getResponsiveUrl(image.publicId);
    const fullUrl = getGalleryFullUrl(image.publicId);
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery__item';
    galleryItem.setAttribute('data-image', String(index + 1));
    galleryItem.setAttribute('data-full-url', fullUrl);
    
    const img = document.createElement('img');
    // Use data-src for responsive images (Cloudinary will update src automatically)
    img.setAttribute('data-src', responsiveUrl);
    img.alt = image.alt;
    // Add cld-responsive class for Cloudinary responsive functionality
    img.classList.add('cld-responsive');
    
    const overlay = document.createElement('div');
    overlay.className = 'gallery__overlay';
    
    const icon = document.createElement('span');
    icon.className = 'gallery__icon';
    icon.textContent = '+';
    
    overlay.appendChild(icon);
    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    galleryGrid.appendChild(galleryItem);
  });
  
  // Initialize Cloudinary responsive functionality after gallery items are created
  // This will automatically detect viewport width and DPR, then update image URLs
  cloudinaryInstance.responsive();
}

// =========================================
// Gallery Lightbox
// =========================================

const lightbox = document.getElementById('lightbox') as HTMLElement;
const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
const lightboxClose = document.getElementById('lightbox-close') as HTMLElement;
const lightboxPrev = document.getElementById('lightbox-prev') as HTMLElement;
const lightboxNext = document.getElementById('lightbox-next') as HTMLElement;

let currentImageIndex = 0;
let images: string[] = [];

// Preload all gallery images at 1920px for smooth navigation
function preloadGalleryImages(): void {
  galleryImages.forEach((image) => {
    const fullUrl = getGalleryFullUrl(image.publicId);
    const img = new Image();
    img.src = fullUrl;
  });
}

// Initialize lightbox after gallery is generated
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery__item');
  
  // Get full-size URLs from gallery items
  images = Array.from(galleryItems).map((item) => {
    return item.getAttribute('data-full-url') || '';
  }).filter(url => url !== '');

  // Track if images have been preloaded
  let imagesPreloaded = false;

  function openLightbox(index: number) {
    currentImageIndex = index;
    lightboxImage.src = images[currentImageIndex];
    lightbox.classList.add('active');
    lenis.stop(); // Stop scrolling when lightbox is open
    
    // Preload all images when lightbox is first opened
    if (!imagesPreloaded) {
      preloadGalleryImages();
      imagesPreloaded = true;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lenis.start(); // Resume scrolling when lightbox is closed
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImage.src = images[currentImageIndex];
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex];
  }

  // Event listeners for gallery
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Close lightbox on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    }
  });
}

// Initialize lightbox after gallery is created
if (galleryGrid) {
  initLightbox();
}

// =========================================
// Contact Form Handling
// =========================================

const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const formMessage = document.getElementById('form-message') as HTMLElement;


contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  // Since this is a static site, we'll show a success message
  // In production, you would send this to a backend API or service like Formspree, Netlify Forms, etc.
  
  try {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    formMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir melden uns so bald wie möglich bei Ihnen.';
    formMessage.className = 'form-message success';

    // Reset form
    contactForm.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.className = 'form-message';
    }, 5000);

    // Log data for development (remove in production)
    console.log('Form submission:', data);
  } catch (error) {
    // Show error message
    formMessage.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
    formMessage.className = 'form-message error';

    setTimeout(() => {
      formMessage.className = 'form-message';
    }, 5000);
  }
});

// =========================================
// Scroll Animations (Fade In on Scroll)
// =========================================

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe sections for animation
const sections = document.querySelectorAll('section');
sections.forEach((section) => {
  observer.observe(section);
});

// =========================================
// Add smooth reveal animations
// =========================================

const style = document.createElement('style');
style.textContent = `
  /* Default: Animate entire section */
  section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  section.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Hero: No animation */
  section#hero {
    opacity: 1;
    transform: none;
  }

  /* Next Concert & Gallery: Only animate content, not background */
  section#next-concert,
  section#gallery {
    opacity: 1;
    transform: none;
  }

  section#next-concert .container,
  section#gallery .container {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  section#next-concert.animate-in .container,
  section#gallery.animate-in .container {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);


// =========================================
// Console greeting
// =========================================

console.log(
  '%c🎺 Cico Jazz Orchester 🎷',
  'font-size: 20px; font-weight: bold; color: #d4a574;'
);
console.log(
  '%cMusik, die verbindet',
  'font-size: 14px; font-style: italic; color: #8b1e3f;'
);

