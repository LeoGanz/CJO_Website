import Lenis from 'lenis';

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
// Gallery Lightbox
// =========================================

const galleryItems = document.querySelectorAll('.gallery__item');
const lightbox = document.getElementById('lightbox') as HTMLElement;
const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
const lightboxClose = document.getElementById('lightbox-close') as HTMLElement;
const lightboxPrev = document.getElementById('lightbox-prev') as HTMLElement;
const lightboxNext = document.getElementById('lightbox-next') as HTMLElement;

let currentImageIndex = 0;
// Get image paths dynamically from the gallery items to work with Vite's hashed filenames
const images: string[] = Array.from(galleryItems).map((item) => {
  const img = item.querySelector('img');
  return img ? img.src : '';
});

function openLightbox(index: number) {
  currentImageIndex = index;
  lightboxImage.src = images[currentImageIndex];
  lightbox.classList.add('active');
  lenis.stop(); // Stop scrolling when lightbox is open
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
// Preload critical images
// =========================================

const criticalImages = [
  '/assets/logo.svg',
  '/assets/251107_hinterhalt_plakat.png',
];

criticalImages.forEach((src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
});

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

