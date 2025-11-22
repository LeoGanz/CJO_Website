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

const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'cjo';

// Initialize Cloudinary URL-gen for building fixed-size URLs
export const cld = new Cloudinary({
    cloud: {
        cloudName: cloudName,
    },
    url: {
        secure: true,
    },
});

// Initialize Cloudinary Core for responsive functionality
// Uses global Cloudinary from CDN script (cloudinary-core-shrinkwrap.js)
export const cloudinaryInstance = new window.cloudinary.Cloudinary({
    cloud_name: cloudName,
    secure: true,
});

// Generate Cloudinary responsive URL
// Uses w_auto/dpr_auto - Cloudinary will automatically replace with actual values based on viewport and DPR
export function getResponsiveUrl(publicId: string): string {
    return cloudinaryInstance.url(publicId, {
        crop: 'limit',
        width: 'auto',
        dpr: 'auto',
        quality: 'auto',
        fetchFormat: 'auto',
    });
}

export function getGalleryFullUrl(publicId: string): string {
    // Full-size URL for lightbox (not responsive, fixed size)
    return cld
        .image(publicId)
        .resize(scale().width(1920))
        .delivery(format(autoFormat()))
        .delivery(quality(autoQuality()))
        .toURL();
}

export function getQrCodeUrl(publicId: string): string {
    // Fixed-size URL for QR codes (250px width is appropriate for QR codes)
    return cld
        .image(publicId)
        .resize(scale().width(250))
        .delivery(format(autoFormat()))
        .delivery(quality(autoQuality()))
        .toURL();
}

export function getLogoUrl(publicId: string): string {
    // Logo URL - fixed size (400px for good quality that scales well)
    // SVG format will be preserved with auto format
    return cld
        .image(publicId)
        .resize(scale().width(400))
        .delivery(format(autoFormat()))
        .delivery(quality(autoQuality()))
        .toURL();
}
