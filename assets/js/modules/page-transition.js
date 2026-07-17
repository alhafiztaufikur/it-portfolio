import { loadComponents } from './loader.js?v=2.5.1';
import { initNetworkCanvas } from './canvas.js?v=2.0.4';
import { initTypingEffect } from './typing.js';
import { initScrollReveal } from './scroll.js';
import { initMobileMenu } from './menu.js?v=2.0.3';
import { initTheme } from './theme.js?v=2.0.1';
import { initCertificationsModal } from './certifications.js';
import { initTechRotator } from './tech-rotator.js';
import { initAskAI } from './ask-ai.js?v=2.0.2';
import { initBackToTop } from './scroll-top.js?v=2.0.1';
import { initProjectDetails } from './projects.js?v=2.0.1';

const INTERNAL_PAGE_PATTERN = /\/?(index|about|experience|skills|certifications|projects|articles|contact)\.html$/;
const COMPONENT_VERSION = '2.5.1';
const COMPONENT_PATHS = [
    'components/hero.html',
    'components/about.html',
    'components/experience.html',
    'components/skills.html',
    'components/certifications.html',
    'components/projects.html',
    'components/blog.html',
    'components/ask-ai.html',
    'components/contact.html'
];
const prefetchedPages = new Set();
let isNavigating = false;

export function initPageTransitions() {
    bindClientNavigation();
    bindLinkPrefetch();
    warmNavigationCache();
}

function bindClientNavigation() {
    if (document.documentElement.dataset.clientNavigationBound === 'true') return;
    document.documentElement.dataset.clientNavigationBound = 'true';

    document.addEventListener('click', (event) => {
        const link = event.target.closest?.('a[href]');
        if (!link || shouldSkipLink(event, link) || !isInternalPage(link.href)) return;

        const url = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);
        if (url.pathname === current.pathname && url.search === current.search && url.hash === current.hash) return;
        if (url.hash && url.pathname === current.pathname) return;

        event.preventDefault();
        navigateTo(url.href);
    });

    window.addEventListener('popstate', () => {
        navigateTo(window.location.href, { replace: true, fromHistory: true });
    });
}

async function navigateTo(href, options = {}) {
    if (isNavigating) return;
    isNavigating = true;

    try {
        const response = await fetch(href, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${href}`);

        const html = await response.text();
        const nextDocument = new DOMParser().parseFromString(html, 'text/html');
        const nextBody = nextDocument.body;
        if (!nextBody) throw new Error('Missing body in target page');

        const swap = () => {
            swapDocument(nextDocument);

            if (!options.fromHistory) {
                if (options.replace) {
                    window.history.replaceState({}, '', href);
                } else {
                    window.history.pushState({}, '', href);
                }
            }
        };

        if (document.startViewTransition) {
            const transition = document.startViewTransition(swap);
            await transition.updateCallbackDone;
        } else {
            swap();
        }

        window.scrollTo(0, 0);
        initializeSwappedPage();
    } catch (error) {
        console.error('Client navigation failed:', error);
        window.location.href = href;
    } finally {
        isNavigating = false;
    }
}

function swapDocument(nextDocument) {
    document.title = nextDocument.title || document.title;

    const nextDescription = nextDocument.querySelector('meta[name="description"]');
    const currentDescription = document.querySelector('meta[name="description"]');
    if (nextDescription && currentDescription) {
        currentDescription.setAttribute('content', nextDescription.getAttribute('content') || '');
    }

    [...document.body.attributes].forEach((attr) => document.body.removeAttribute(attr.name));
    [...nextDocument.body.attributes].forEach((attr) => document.body.setAttribute(attr.name, attr.value));
    document.body.innerHTML = nextDocument.body.innerHTML;
    document.body.style.overflow = '';
    document.body.classList.remove('project-modal-open');
}

async function initializeSwappedPage() {
    initTheme();
    initMobileMenu('menu-toggle', 'nav-menu', '.nav-link');
    initBackToTop();
    setActiveNav();
    renderLucideIcons();

    if (document.body.classList.contains('home-body')) {
        await loadComponents();
        renderLucideIcons();
        initCertificationsModal();
        initAskAI();
        initProjectDetails();
        initNetworkCanvas('network-canvas');
        initTechRotator();
        initTypingEffect('typing-text', [
            'Python Scripting',
            'Ansible Playbooks',
            'Cisco & Juniper Networks',
            'Infrastructure as Code (IaC)',
            'Linux Servers & APIs'
        ]);
        initScrollReveal('.scroll-reveal');
        animateSkillBars();
        bindCertificatesToggle();
        return;
    }

    await loadPageComponents();
    renderLucideIcons();
    initScrollReveal('.scroll-reveal');
    initCertificationsModal();
    initAskAI();
    initProjectDetails();
    bindCertificatesToggle();
    animateSkillBars();
}

async function loadPageComponents() {
    const target = document.getElementById('page-component');
    const urls = (document.body.dataset.components || document.body.dataset.component || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);

    if (!target || urls.length === 0) return;

    try {
        const fragments = await Promise.all(urls.map(async (url) => {
            const response = await fetch(`${url}?v=${COMPONENT_VERSION}`, { cache: 'force-cache' });
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

    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isHome = (!page || page === 'home') && href.endsWith('index.html');
        const isMatch = page && href.includes(`${page}.html`);
        link.classList.toggle('active', Boolean(isHome || isMatch));
    });
}

function bindCertificatesToggle() {
    const btnViewCerts = document.getElementById('btn-view-certs');
    if (!btnViewCerts || btnViewCerts.dataset.bound === 'true') return;
    btnViewCerts.dataset.bound = 'true';

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
            renderLucideIcons();
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

function renderLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        return;
    }

    window.addEventListener('lucide-ready', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, { once: true });
}

function warmNavigationCache() {
    const run = () => {
        document.querySelectorAll('a[href]').forEach((link) => prefetchLink(link));
        COMPONENT_PATHS.forEach((path) => prefetchUrl(`${path}?v=${COMPONENT_VERSION}`));
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 1200 });
    } else {
        window.setTimeout(run, 350);
    }
}

function bindLinkPrefetch() {
    if (document.documentElement.dataset.pagePrefetchBound === 'true') return;
    document.documentElement.dataset.pagePrefetchBound = 'true';

    ['pointerover', 'focusin', 'touchstart'].forEach((eventName) => {
        document.addEventListener(eventName, (event) => {
            const link = event.target.closest?.('a[href]');
            if (!link) return;
            prefetchLink(link, event);
        }, { passive: true, capture: true });
    });
}

function prefetchLink(link, event = {}) {
    if (shouldSkipLink(event, link)) return;
    if (!isInternalPage(link.href)) return;
    prefetchUrl(link.href);
}

function prefetchUrl(url) {
    const absoluteUrl = new URL(url, window.location.href).href;
    if (prefetchedPages.has(absoluteUrl)) return;

    prefetchedPages.add(absoluteUrl);
    fetch(absoluteUrl, { cache: 'force-cache' }).catch(() => {
        prefetchedPages.delete(absoluteUrl);
    });
}

function shouldSkipLink(event, link) {
    return event.defaultPrevented
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
        || link.target
        || link.hasAttribute('download')
        || link.href.startsWith('mailto:')
        || link.href.startsWith('tel:')
        || link.dataset.noTransition === 'true';
}

function isInternalPage(href) {
    const url = new URL(href, window.location.href);
    const targetPath = url.pathname.replace(/\/+$/, '');
    return url.origin === window.location.origin && INTERNAL_PAGE_PATTERN.test(targetPath);
}
