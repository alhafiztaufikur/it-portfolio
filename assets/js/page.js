import { initTheme } from './modules/theme.js';
import { initMobileMenu } from './modules/menu.js?v=2.0.3';
import { initScrollReveal } from './modules/scroll.js';
import { initBackToTop } from './modules/scroll-top.js?v=2.0.1';
import { initCertificationsModal } from './modules/certifications.js';
import { initAskAI } from './modules/ask-ai.js?v=2.0.2';
import { initProjectDetails } from './modules/projects.js?v=2.0.1';
import { initPageTransitions } from './modules/page-transition.js?v=2.0.3';

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    await loadPageComponents();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initMobileMenu('menu-toggle', 'nav-menu', '.nav-link');
    initBackToTop();
    initScrollReveal('.scroll-reveal');
    initCertificationsModal();
    initAskAI();
    initProjectDetails();
    initPageTransitions();
    bindCertificatesToggle();
    animateSkillBars();
    setActiveNav();
});

async function loadPageComponents() {
    const componentVersion = '2.5.1';
    const target = document.getElementById('page-component');
    const urls = (document.body.dataset.components || document.body.dataset.component || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (!target || urls.length === 0) return;

    try {
        const fragments = await Promise.all(urls.map(async (url) => {
            const response = await fetch(`${url}?v=${componentVersion}`);
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
            return response.text();
        }));

        target.innerHTML = fragments.join('\n');
    } catch (error) {
        console.error('Error loading page component:', error);
        target.innerHTML = '<section class="section"><div class="container"><p style="color:red;text-align:center;">Error loading page content.</p></div></section>';
    }
}

function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isHome = page === 'home' && href.endsWith('index.html');
        const isMatch = href.includes(`${page}.html`);
        link.classList.toggle('active', isHome || isMatch);
    });
}

function bindCertificatesToggle() {
    const btnViewCerts = document.getElementById('btn-view-certs');
    if (!btnViewCerts) return;

    btnViewCerts.addEventListener('click', () => {
        const gallery = document.getElementById('certs-gallery');
        if (!gallery) return;

        const isOpen = gallery.classList.toggle('open');
        btnViewCerts.classList.toggle('open', isOpen);
        const textNodes = [...btnViewCerts.childNodes].filter(node => node.nodeType === 3);
        if (textNodes.length) {
            textNodes[0].textContent = isOpen ? ' Hide Certificate Gallery ' : ' View Certificate Gallery ';
        }

        if (isOpen) {
            if (typeof lucide !== 'undefined') lucide.createIcons();
            setTimeout(() => gallery.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        }
    });
}

function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const fill = entry.target;
            const w = fill.style.getPropertyValue('--bar-w') || '1';
            fill.style.transform = `scaleX(${w})`;
            fill.classList.add('animated');
            barObserver.unobserve(fill);
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => barObserver.observe(bar));
}
