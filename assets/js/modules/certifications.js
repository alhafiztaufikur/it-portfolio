/**
 * certifications.js — Certificate Details Modal
 * Intercepts clicks on certificate cards to display a premium two-column modal.
 */

export function initCertificationsModal() {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;

    const modalImg = document.getElementById('cert-modal-img');
    const modalIssuer = document.getElementById('cert-modal-issuer');
    const modalIssuerShort = document.getElementById('cert-modal-issuer-short');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalDesc = document.getElementById('cert-modal-desc');
    const modalStatus = document.getElementById('cert-modal-status');
    const modalLink = document.getElementById('cert-modal-link');
    const closeBtn = document.getElementById('cert-modal-close-btn');

    // Intercept clicks on certificate cards
    function bindCardClicks() {
        const cards = document.querySelectorAll('.cert-card');
        cards.forEach(card => {
            // Prevent multiple click listeners
            if (card.dataset.hasModalListener) return;
            card.dataset.hasModalListener = 'true';

            card.addEventListener('click', (e) => {
                e.preventDefault();

                // Extract details from card elements
                const img = card.querySelector('.cert-image-container img');
                const issuer = card.querySelector('.cert-issuer');
                const title = card.querySelector('.cert-title');
                const desc = card.querySelector('.cert-desc');
                const status = card.querySelector('.cert-status');

                const imgSrc = img ? img.getAttribute('src') : '';
                const issuerText = issuer ? issuer.innerText : '';
                const titleText = title ? title.innerText : '';
                const descText = desc ? desc.innerText : '';
                const statusText = status ? status.innerText : 'Selesai';
                const fileLink = card.getAttribute('href') || '';

                // Populate modal
                if (modalImg) modalImg.src = imgSrc;
                if (modalIssuer) modalIssuer.innerText = issuerText;
                if (modalIssuerShort) {
                    // Extract short version (before the dot/dash separator)
                    modalIssuerShort.innerText = issuerText.split('·')[0].split('·')[0].trim();
                }
                if (modalTitle) modalTitle.innerText = titleText;
                if (modalDesc) modalDesc.innerText = descText;
                if (modalStatus) modalStatus.innerText = statusText;
                if (modalLink) modalLink.href = fileLink;

                // Open modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            });
        });
    }

    // Initialize click handlers
    bindCardClicks();

    // Re-bind click handlers if dynamic DOM changes (due to asynchronous components injection)
    const observer = new MutationObserver(() => {
        bindCardClicks();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Close Modal Logic
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable body scroll
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside of the container
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
