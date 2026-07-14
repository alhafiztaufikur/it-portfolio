const INTERNAL_PAGE_PATTERN = /\/?(index|about|experience|skills|certifications|projects|articles|contact)\.html$/;

export function initPageTransitions() {
    revealPage();
    bindInternalLinks();

    window.addEventListener('pageshow', () => {
        document.body.classList.remove('page-exit');
        revealPage();
    });
}

function revealPage() {
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('page-loading');
    });
}

function bindInternalLinks() {
    if (document.documentElement.dataset.pageTransitionBound === 'true') return;
    document.documentElement.dataset.pageTransitionBound = 'true';

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link || shouldSkipLink(event, link)) return;

        const url = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);
        const targetPath = url.pathname.replace(/\/+$/, '');
        const currentPath = current.pathname.replace(/\/+$/, '') || '/index.html';

        if (url.origin !== current.origin || !INTERNAL_PAGE_PATTERN.test(targetPath)) return;
        if (targetPath === currentPath && url.hash === current.hash) return;

        event.preventDefault();
        document.body.classList.add('page-exit');
        document.documentElement.classList.add('page-loading');

        window.setTimeout(() => {
            window.location.href = url.href;
        }, 140);
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
