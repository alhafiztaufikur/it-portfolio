export function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('main > div > section, header, main > section');
    const scrollDownBtn = document.querySelector('.scroll-indicator');

    // 1. Cyber scan line sweep trigger on click
    function triggerSectionFlash(targetId) {
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        // Clear any active flashes on other sections
        document.querySelectorAll('.section-flash').forEach(el => {
            el.classList.remove('section-flash');
        });

        // Trigger neon scan sweep
        targetSection.classList.add('section-flash');

        // Cleanup after animation completes (1200ms)
        setTimeout(() => {
            targetSection.classList.remove('section-flash');
        }, 1200);
    }

    // 2. Intercept click events for navbar links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Smooth scroll directly to section
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    triggerSectionFlash(targetId);
                }
            }
        });
    });

    // 3. Intercept click events for Hero scroll down button
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                triggerSectionFlash(targetId);
            }
        });
    }

    // 4. Update active nav menu link on viewport scroll
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            // Detect if section is in viewport focus
            if (window.scrollY >= sectionTop - 120) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}` || (currentSectionId === 'hero' && href === '#')) {
                link.classList.add('active');
            }
        });
    });
}
