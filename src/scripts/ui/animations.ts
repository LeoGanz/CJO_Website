import Lenis from 'lenis';

export const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

export function initAnimations() {
    // =========================================
    // Smooth Scrolling with Lenis
    // =========================================

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
                    const isMobile = window.innerWidth <= 768;
                    lenis.scrollTo(element as HTMLElement, {
                        offset: isMobile ? 0 : -80,
                        duration: 1.5,
                    });
                }
            }
        });
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
}
