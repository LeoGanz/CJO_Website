import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

// Configuration
const CLOUD_NAME = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'cjo';

// Initialize Cloudinary for URL generation
const cloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUD_NAME,
    },
    url: {
        secure: true,
    },
});

// QR code public IDs
const QR_INSTAGRAM_PUBLIC_ID = 'qr_ig';
const QR_YOUTUBE_PUBLIC_ID = 'qr_yt';

export function initSocialMedia() {
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
    // QR Code Images
    // =========================================

    const qrInstagramImg = document.querySelector('#instagram-qr img') as HTMLImageElement;
    const qrYouTubeImg = document.querySelector('#youtube-qr img') as HTMLImageElement;

    if (qrInstagramImg) {
        // Generate QR code URL (250px width for QR codes)
        qrInstagramImg.src = cloudinary
            .image(QR_INSTAGRAM_PUBLIC_ID)
            .resize(scale().width(250))
            .delivery(format(autoFormat()))
            .delivery(quality(autoQuality()))
            .toURL();
    }

    if (qrYouTubeImg) {
        // Generate QR code URL (250px width for QR codes)
        qrYouTubeImg.src = cloudinary
            .image(QR_YOUTUBE_PUBLIC_ID)
            .resize(scale().width(250))
            .delivery(format(autoFormat()))
            .delivery(quality(autoQuality()))
            .toURL();
    }
}
