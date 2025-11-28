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
    part2VideoId?: string;
}

class YouTubePlayer {
    private static readonly CLOUD_NAME = 'cjo';
    private static instances: YouTubePlayer[] = [];
    private static consentGiven: boolean = sessionStorage.getItem('youtube-consent') === 'true';

    private container: HTMLElement;
    private config: YouTubePlayerConfig;

    constructor(container: HTMLElement) {
        this.container = container;
        this.config = {
            videoId: container.dataset.videoId || '',
            videoTitle: container.dataset.videoTitle || 'YouTube Video',
            cloudinaryId: container.dataset.cloudinaryId,
            part2VideoId: container.dataset.part2VideoId
        };

        YouTubePlayer.instances.push(this);

        if (YouTubePlayer.consentGiven) {
            this.embedPlayer();
            this.setupPart2Link();
        } else {
            this.renderThumbnail();
        }
    }

    private renderThumbnail(): void {
        const thumbnailUrl = this.config.cloudinaryId
            ? `https://res.cloudinary.com/${YouTubePlayer.CLOUD_NAME}/image/upload/c_fill,w_1280,h_720,g_auto,f_auto,q_auto/${this.config.cloudinaryId}`
            : `https://img.youtube.com/vi/${this.config.videoId}/maxresdefault.jpg`;

        const html = thumbnailTemplate
            .replace('{{thumbnailUrl}}', thumbnailUrl)
            .replace('{{videoTitle}}', this.config.videoTitle);

        this.container.innerHTML = html;

        const thumbnail = this.container.querySelector('.youtube-player__thumbnail');
        thumbnail?.addEventListener('click', () => this.showConsentDialog());
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
            this.giveConsentForAll();
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

    private giveConsentForAll(): void {
        YouTubePlayer.consentGiven = true;
        sessionStorage.setItem('youtube-consent', 'true');

        YouTubePlayer.instances.forEach(player => {
            const shouldAutoplay = player === this;
            player.embedPlayer(shouldAutoplay);
            player.setupPart2Link();
        });
    }

    private embedPlayer(autoplay: boolean = false): void {
        const embedUrl = `https://www.youtube-nocookie.com/embed/${this.config.videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`;

        const html = iframeTemplate
            .replace('{{embedUrl}}', embedUrl)
            .replace('{{videoTitle}}', this.config.videoTitle);

        this.container.innerHTML = html;
    }

    // custom logic to show part 2 of the main concert
    private setupPart2Link(): void {
        if (!this.config.part2VideoId) return;

        const part2Container = this.container.parentElement?.querySelector('.coming-soon__part2-container') as HTMLElement;
        if (!part2Container) return;

        setTimeout(() => {
            part2Container.style.display = 'block';

            const link = part2Container.querySelector('.coming-soon__part2-link') as HTMLElement;
            const part2Player = part2Container.querySelector('.youtube-player--part2') as HTMLElement;

            link?.addEventListener('click', (e) => {
                e.preventDefault();
                link.style.display = 'none';
                part2Player.style.display = 'block';

                new YouTubePlayer(part2Player);
            });
        }, 5 * 60 * 1000); // 5 minutes
    }
}

export function initYouTube(): void {
    const players = document.querySelectorAll<HTMLElement>('.youtube-player');
    players.forEach(container => {
        new YouTubePlayer(container);
    });
}
