/**
 * counter.js — Visitor Counter
 * Uses localStorage for instant display + CountAPI for persistent tracking.
 */

export function initVisitorCounter() {
    const STORAGE_KEY = 'hafiz-portfolio-visits';
    const NAMESPACE = 'alhafiztaufikur-portfolio-v2';
    const KEY = 'visits';

    // Inject counter element into footer
    const footer = document.querySelector('.footer-content');
    if (!footer) return;

    const counterEl = document.createElement('p');
    counterEl.className = 'visitor-counter';
    counterEl.id = 'visitor-counter';
    counterEl.innerHTML = '<span class="counter-dot"></span> <span id="visit-count">—</span> visitors';
    footer.appendChild(counterEl);

    // Increment local count immediately for instant feedback
    const localCount = (parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)) + 1;
    localStorage.setItem(STORAGE_KEY, String(localCount));

    // Show local count immediately
    const countEl = document.getElementById('visit-count');
    if (countEl) animateCount(countEl, localCount);

    // Try to fetch from CountAPI for persistent cross-device count
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(res => res.json())
        .then(data => {
            if (countEl && data.value && data.value > localCount) {
                animateCount(countEl, data.value);
            }
        })
        .catch(() => {
            // silently fail — local count is already showing
        });
}

function animateCount(el, target) {
    const duration = 1000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
}

