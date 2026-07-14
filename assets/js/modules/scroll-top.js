/**
 * scroll-top.js — Back to Top Button Orchestrator
 */
export function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // Show/hide button on scroll
    let ticking = false;
    let isVisible = window.scrollY > 300;
    btn.classList.toggle('visible', isVisible);

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const nextState = window.scrollY > 300;
            if (nextState !== isVisible) {
                btn.classList.toggle('visible', nextState);
                isVisible = nextState;
            }
            ticking = false;
        });
    }, { passive: true });

    // Smooth scroll to top when clicked
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
