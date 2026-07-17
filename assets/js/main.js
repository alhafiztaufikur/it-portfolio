import { loadComponents } from './modules/loader.js?v=2.5.2';
import { initNetworkCanvas } from './modules/canvas.js?v=2.0.4';
import { initTypingEffect } from './modules/typing.js';
import { initScrollReveal } from './modules/scroll.js';
import { initMobileMenu } from './modules/menu.js?v=2.0.3';
import { initTheme } from './modules/theme.js?v=2.0.1';
import { initCertificationsModal } from './modules/certifications.js';
import { initTechRotator } from './modules/tech-rotator.js';
import { initAskAI } from './modules/ask-ai.js?v=2.0.2';
import { initBackToTop } from './modules/scroll-top.js?v=2.0.1';
import { initProjectDetails } from './modules/projects.js?v=2.0.1';
import { initPageTransitions } from './modules/page-transition.js?v=2.1.1';
 
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initMobileMenu('menu-toggle', 'nav-menu', '.nav-link');
    initBackToTop();
    initPageTransitions();

    renderLucideIcons();

    // 1. Asynchronously load and inject homepage components
    await loadComponents();
 
    // 2. Initialize Lucide Icons after the HTML templates have been injected into the DOM
    renderLucideIcons();
 
    // 5.5. Initialize homepage interactive modules
    initCertificationsModal();
    initAskAI();
    initProjectDetails();
 
    // 6. Initialize ambient network animation
    initNetworkCanvas('network-canvas');
 
    // 7. Initialize Hero Tech Card Rotator
    initTechRotator();

    // 8. Initialize Hero dynamic typing text (if typing-text exists on page)
    const typingWords = [
        "Python Scripting",
        "Ansible Playbooks",
        "Cisco & Juniper Networks",
        "Infrastructure as Code (IaC)",
        "Linux Servers & APIs"
    ];
    initTypingEffect('typing-text', typingWords);
 
    // 9. Initialize Scroll reveal observation for loaded components
    initScrollReveal('.scroll-reveal');

    // 10. Animate skill progress bars when in viewport
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const w = fill.style.getPropertyValue('--bar-w') || '1';
                fill.style.transform = `scaleX(${w})`;
                fill.classList.add('animated');
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-bar-fill').forEach(el => barObserver.observe(el));

    // 11. Certificates gallery toggle
    const btnViewCerts = document.getElementById('btn-view-certs');
    if (btnViewCerts) {
        btnViewCerts.addEventListener('click', () => {
            const gallery = document.getElementById('certs-gallery');
            if (!gallery) return;
            const isOpen = gallery.classList.toggle('open');
            btnViewCerts.classList.toggle('open', isOpen);
            // Swap button text
            const textNodes = [...btnViewCerts.childNodes].filter(n => n.nodeType === 3);
            if (textNodes.length) {
                textNodes[0].textContent = isOpen ? ' Hide Certificate Gallery ' : ' View Certificate Gallery ';
            }
            if (isOpen) {
                // Re-run lucide icons in newly visible content
                renderLucideIcons();
                setTimeout(() => gallery.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
            }
        });
    }
});

function renderLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        return;
    }

    window.addEventListener('lucide-ready', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, { once: true });
}
