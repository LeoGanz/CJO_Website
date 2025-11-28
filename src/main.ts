import { initAnimations } from './scripts/animations';
import { initNavigation } from './scripts/navigation';
import { initGallery } from './scripts/gallery';
import { initSocialMedia } from './scripts/social';
import { initForms } from './scripts/forms';
import { initImages } from './scripts/images';
import { initFog } from './scripts/fog';
import { initYouTube } from './scripts/youtube';

// Initialize all modules
initAnimations();
initNavigation();
initGallery();
initSocialMedia();
initForms();
initImages();
initFog();
initYouTube();

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
