import { getQrCodeUrl } from '../utils/cloudinary';

// QR code public IDs (constants for easy replacement)
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
}
