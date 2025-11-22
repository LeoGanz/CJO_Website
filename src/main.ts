import { initAnimations } from './scripts/ui/animations';
import { initNavigation } from './scripts/ui/navigation';
import { initGallery } from './scripts/ui/gallery';
import { initSocialMedia } from './scripts/ui/social';
import { initForms } from './scripts/ui/forms';
import { initImages } from './scripts/ui/images';

// Initialize all modules
initAnimations();
initNavigation();
initGallery();
initSocialMedia();
initForms();
initImages();

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
