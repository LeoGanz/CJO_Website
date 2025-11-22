import { getResponsiveUrl, getGalleryFullUrl, cloudinaryInstance } from '../utils/cloudinary';
import { lenis } from './animations';

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

export function initGallery() {
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

        initLightbox();
    }
}

// =========================================
// Gallery Lightbox
// =========================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox') as HTMLElement;
    const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
    const lightboxClose = document.getElementById('lightbox-close') as HTMLElement;
    const lightboxPrev = document.getElementById('lightbox-prev') as HTMLElement;
    const lightboxNext = document.getElementById('lightbox-next') as HTMLElement;

    if (!lightbox || !lightboxImage) return;

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

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

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
