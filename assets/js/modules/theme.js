/**
 * theme.js — Manual Dark/Light Theme Toggle
 * Toggles between Dark Mode (Navy Green) and Light Mode (Pure White Grid)
 * via a button click. Persists preference in localStorage.
 */

export function initTheme() {
    const html = document.documentElement;
    const STORAGE_KEY = 'portfolio-theme';

    // Restore saved preference (default: dark)
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyTheme(saved);

    // Wire up the toggle button once it's in the DOM
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
            localStorage.setItem(STORAGE_KEY, next);
        });
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
            updateIcon('moon');
        } else {
            html.removeAttribute('data-theme');
            updateIcon('sun');
        }
    }

    function updateIcon(name) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.innerHTML = '';
        const i = document.createElement('i');
        i.setAttribute('data-lucide', name);
        btn.appendChild(i);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}
