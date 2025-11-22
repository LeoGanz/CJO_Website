export function initNavigation() {
    // =========================================
    // Navigation Show/Hide on Scroll
    // =========================================

    const nav = document.querySelector('.nav') as HTMLElement;

    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Show nav after scrolling past hero
            if (currentScrollY > window.innerHeight * 0.5) {
                nav.classList.add('visible');
            } else {
                nav.classList.remove('visible');
            }
        });
    }

    // =========================================
    // Mobile Burger Menu
    // =========================================

    const burgerMenu = document.getElementById('burger-menu') as HTMLElement;
    const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;

    // Clone menu items from desktop to mobile menu
    const desktopMenu = document.querySelector('.nav__menu') as HTMLElement;
    const mobileList = mobileMenu?.querySelector('.nav__mobile-list') as HTMLElement;

    if (desktopMenu && mobileList) {
        // Clone the list items
        const menuItems = desktopMenu.querySelectorAll('li');
        menuItems.forEach((item) => {
            const clonedItem = item.cloneNode(true) as HTMLElement;
            mobileList.appendChild(clonedItem);
        });
    }

    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                // Close menu immediately since smooth scroll is handled globally
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}
