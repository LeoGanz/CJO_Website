import { lenis } from './animations';

// Concert Date: Saturday, October 24, 2026 at 20:00 CEST (UTC+2)
const CONCERT_DATE_ISO = '2026-10-24T00:00:00+02:00';

export function calculateDaysUntilConcert(): { days: number; text: string; shortText: string } {
    const concertTime = new Date(CONCERT_DATE_ISO).getTime();
    const nowTime = new Date().getTime();
    const diffMs = concertTime - nowTime;

    // Convert milliseconds to full calendar days remaining
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let text = '';
    let shortText = '';

    if (days > 1) {
        text = `in ${days} Tagen`;
        shortText = `Noch ${days} Tage`;
    } else if (days === 1) {
        text = 'morgen';
        shortText = 'Morgen!';
    } else if (days === 0) {
        text = 'heute Abend';
        shortText = 'HEUTE!';
    } else {
        text = 'bereits stattgefunden';
        shortText = 'Beendet';
    }

    return { days, text, shortText };
}

export function initConcertHighlight(): void {
    const { days, text, shortText } = calculateDaysUntilConcert();

    // Update all dynamic countdown elements across the page
    const countdownElements = document.querySelectorAll<HTMLElement>('[data-concert-countdown]');
    countdownElements.forEach((el) => {
        const format = el.getAttribute('data-format') || 'full';
        if (format === 'short') {
            el.textContent = shortText;
        } else if (format === 'days-only') {
            el.textContent = String(Math.max(0, days));
        } else {
            el.textContent = text;
        }
    });

    // =========================================
    // Concert Poster Lightbox Trigger
    // =========================================
    const posterContainer = document.querySelector('.concert__poster');
    const lightbox = document.getElementById('lightbox') as HTMLElement;
    const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
    const lightboxPrev = document.getElementById('lightbox-prev') as HTMLElement;
    const lightboxNext = document.getElementById('lightbox-next') as HTMLElement;

    if (posterContainer && lightbox && lightboxImage) {
        posterContainer.addEventListener('click', () => {
            const posterImg = posterContainer.querySelector('img') as HTMLImageElement;
            const fullPosterUrl = posterImg?.getAttribute('data-full-url') || posterImg?.src || '/assets/2026-09-25 Plakat Hinterhalt 24.10.26.png';

            lightboxImage.src = fullPosterUrl;
            lightboxImage.alt = 'Konzertplakat Kulturbühne Hinterhalt 24.10.2026';

            // Hide prev/next buttons for single poster display
            if (lightboxPrev) lightboxPrev.style.display = 'none';
            if (lightboxNext) lightboxNext.style.display = 'none';

            lightbox.classList.add('active');
            if (lenis) {
                lenis.stop();
            }
        });
    }
}
