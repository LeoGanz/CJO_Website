/**
 * Privacy-Focused YouTube Player
 * Implements two-click consent pattern for GDPR compliance
 */

interface YouTubePlayerConfig {
    videoId: string;
    videoTitle: string;
    cloudinaryId?: string;
}

class YouTubePlayer {
    private container: HTMLElement;
    private config: YouTubePlayerConfig;
    private consentGiven: boolean = false;
    private readonly CLOUD_NAME = 'cjo';

    constructor(container: HTMLElement) {
        this.container = container;
        this.config = {
            videoId: container.dataset.videoId || '',
            videoTitle: container.dataset.videoTitle || 'YouTube Video',
            cloudinaryId: container.dataset.cloudinaryId
        };

        // Check session storage for consent
        this.consentGiven = sessionStorage.getItem(`youtube-consent`) === 'true';

        if (this.consentGiven) {
            this.embedPlayer();
        } else {
            this.renderThumbnail();
        }
    }

    private renderThumbnail(): void {
        // Use Cloudinary thumbnail if provided, otherwise use YouTube thumbnail
        const thumbnailUrl = this.config.cloudinaryId
            ? `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/c_fill,w_1280,h_720,g_auto,f_auto,q_auto/${this.config.cloudinaryId}`
            : `https://img.youtube.com/vi/${this.config.videoId}/maxresdefault.jpg`;

        const thumbnailHTML = `
            <div class="youtube-player__thumbnail">
                <img src="${thumbnailUrl}" alt="${this.config.videoTitle}" loading="lazy">
                <button class="youtube-player__play-button" aria-label="Video abspielen">
                    <svg width="68" height="48" viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="currentColor"/>
                        <path d="M45 24L27 14v20l18-10z" fill="#000"/>
                    </svg>
                </button>
            </div>
        `;

        this.container.innerHTML = thumbnailHTML;

        const playButton = this.container.querySelector('.youtube-player__play-button');
        playButton?.addEventListener('click', () => this.showConsentDialog());
    }

    private showConsentDialog(): void {
        const modal = document.createElement('div');
        modal.className = 'youtube-consent';
        modal.innerHTML = `
            <div class="youtube-consent__dialog">
                <div class="youtube-consent__content">
                    <svg class="youtube-consent__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                    </svg>
                    <h3 class="youtube-consent__title">YouTube Video laden?</h3>
                    <p class="youtube-consent__text">
                        Durch das Laden des Videos akzeptieren Sie die Datenschutzbestimmungen von YouTube.
                        Es wird eine Verbindung zu YouTube hergestellt und Daten können übertragen werden.
                    </p>
                    <p class="youtube-consent__privacy">
                        Mehr Informationen finden Sie in unserer 
                        <a href="/datenschutz.html#youtube" target="_blank">Datenschutzerklärung</a>.
                    </p>
                    <div class="youtube-consent__actions">
                        <button class="youtube-consent__button youtube-consent__button--cancel">
                            Abbrechen
                        </button>
                        <button class="youtube-consent__button youtube-consent__button--accept">
                            Video laden
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const cancelBtn = modal.querySelector('.youtube-consent__button--cancel');
        const acceptBtn = modal.querySelector('.youtube-consent__button--accept');

        const closeModal = () => {
            modal.classList.add('youtube-consent--closing');
            setTimeout(() => modal.remove(), 300);
        };

        cancelBtn?.addEventListener('click', closeModal);

        acceptBtn?.addEventListener('click', () => {
            this.giveConsent();
            closeModal();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on ESC key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('youtube-consent--visible');
        });
    }

    private giveConsent(): void {
        this.consentGiven = true;
        sessionStorage.setItem(`youtube-consent`, 'true');
        this.embedPlayer();
    }

    private embedPlayer(): void {
        const iframeHTML = `
            <div class="youtube-player__iframe">
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube-nocookie.com/embed/${this.config.videoId}" 
                    title="${this.config.videoTitle}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
                </iframe>
            </div>
        `;

        this.container.innerHTML = iframeHTML;
    }
}

export function initYouTube(): void {
    const players = document.querySelectorAll<HTMLElement>('.youtube-player');
    players.forEach(container => {
        new YouTubePlayer(container);
    });
}
