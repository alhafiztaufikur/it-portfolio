const loadStartTime = Date.now();
 
import { loadComponents } from './modules/loader.js';
import { hideSplashScreen } from './modules/splash.js';
import { initNetworkCanvas } from './modules/canvas.js';
import { initTypingEffect } from './modules/typing.js';
import { initScrollReveal } from './modules/scroll.js';
import { initMobileMenu } from './modules/menu.js';
import { initContactForm } from './modules/contact.js';
import { initScrollSpy } from './modules/scrollspy.js';
import { initTheme } from './modules/theme.js';
import { initVisitorCounter } from './modules/counter.js';
import { initCertificationsModal } from './modules/certifications.js';
 
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Asynchronously load and inject HTML components (hero, about, experience, skills, certs, projects, contact)
    await loadComponents();
 
    // 2. Initialize Lucide Icons after the HTML templates have been injected into the DOM
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
 
    // 3. Initialize Network Particle Canvas background
    initNetworkCanvas('network-canvas');
 
    // 4. Initialize Hero dynamic typing text
    const typingWords = [
        "Python Scripting",
        "Ansible Playbooks",
        "Cisco & Juniper Networks",
        "Infrastructure as Code (IaC)",
        "Linux Servers & APIs"
    ];
    initTypingEffect('typing-text', typingWords);
 
    // 5. Initialize Scroll reveal observation for loaded components
    initScrollReveal('.scroll-reveal');
 
    // 6. Initialize Mobile slide-out drawer menu
    initMobileMenu('menu-toggle', 'nav-menu', '.nav-link');
 
    // 7. Initialize Contact Form simulator and validations
    initContactForm('portfolio-contact-form', 'form-status');
 
    // 8. Initialize ScrollSpy active link highlights and landing sweep transitions
    initScrollSpy();
 
    // 9. Initialize Dark/Light Theme Toggle
    initTheme();
 
    // 10. Initialize Visitor Counter in footer
    initVisitorCounter();
 
    // 11. Initialize Certificate Details Modal
    initCertificationsModal();
 
    // 12. Hide the splash screen loader overlay (forces minimum animation timeline of 1500ms)
    hideSplashScreen(loadStartTime, 1500);
});
