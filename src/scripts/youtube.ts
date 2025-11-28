/**
 * Privacy-Focused YouTube Player
 * Implements two-click consent pattern for GDPR compliance
 */

import thumbnailTemplate from '../templates/youtube-thumbnail.html?raw';
import consentTemplate from '../templates/youtube-consent.html?raw';
import iframeTemplate from '../templates/youtube-iframe.html?raw';

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

        this.consentGiven = sessionStorage.getItem(`youtube-consent`) === 'true';

        if (this.consentGiven) {
            this.embedPlayer();
        } else {
            this.renderThumbnail();
        }
    }

    private renderThumbnail(): void {
        const thumbnailUrl = this.config.cloudinaryId
            ? `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/c_fill,w_1280,h_720,g_auto,f_auto,q_auto/${this.config.cloudinaryId}`
            : `https://img.youtube.com/vi/${this.config.videoId}/maxresdefault.jpg`;

        const html = thumbnailTemplate
            .replace('{{thumbnailUrl}}', thumbnailUrl)
            .replace('{{videoTitle}}', this.config.videoTitle);

        this.container.innerHTML = html;

        const playButton = this.container.querySelector('.youtube-player__play-button');
        playButton?.addEventListener('click', () => this.showConsentDialog());
    }

    private showConsentDialog(): void {
        const modal = document.createElement('div');
        modal.className = 'youtube-consent';
        modal.innerHTML = consentTemplate;

        document.body.appendChild(modal);

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

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

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
        const embedUrl = `https://www.youtube-nocookie.com/embed/${this.config.videoId}?autoplay=1`;

        const html = iframeTemplate
            .replace('{{embedUrl}}', embedUrl)
            .replace('{{videoTitle}}', this.config.videoTitle);

        this.container.innerHTML = html;
    }
}

export function initYouTube(): void {
    const players = document.querySelectorAll<HTMLElement>('.youtube-player');
    players.forEach(container => {
        new YouTubePlayer(container);
    });
}
