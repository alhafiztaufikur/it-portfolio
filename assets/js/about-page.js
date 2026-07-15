/**
 * about-page.js — Lightweight orchestrator for the standalone About page.
 * Handles theme, navbar, scroll reveal, and mobile menu.
 */

import { initTheme } from './modules/theme.js';
import { initMobileMenu } from './modules/menu.js?v=2.0.3';
import { initScrollReveal } from './modules/scroll.js';
import { initBackToTop } from './modules/scroll-top.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Restore theme preference
    initTheme();

    // 1.5. Initialize Back to Top Button
    initBackToTop();

    // 2. Mobile menu toggle
    initMobileMenu('menu-toggle', 'nav-menu', '.nav-link');

    // 3. Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 4. Scroll reveal for elements
    initScrollReveal('.scroll-reveal');

    // 5. Mark active nav link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === 'about.html') {
            link.classList.add('active');
        }
    });
});
