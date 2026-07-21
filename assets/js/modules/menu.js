export function initMobileMenu(toggleId, menuId, linksClass) {
    const menuToggle = document.getElementById(toggleId);
    const navMenu = document.getElementById(menuId);
    const navLinks = document.querySelectorAll(linksClass);

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon && typeof lucide !== 'undefined') {
                if (navMenu.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon && typeof lucide !== 'undefined') {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Sticky navbar header scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let ticking = false;
        let isScrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', isScrolled);

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const nextState = window.scrollY > 50;
                if (nextState !== isScrolled) {
                    navbar.classList.toggle('scrolled', nextState);
                    isScrolled = nextState;
                }
                ticking = false;
            });
        }, { passive: true });
    }
}
