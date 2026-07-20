/**
 * cv-modal.js — Interactive CV Preview & Download Modal Module
 * Intercepts clicks on "Download CV" or "View CV" buttons, displays a clean modal preview of the CV first,
 * and allows printing or downloading the PDF/HTML directly from within the modal.
 */

export function initCvModal() {
    // 1. Ensure CV Modal Overlay HTML exists in the body
    let modal = document.getElementById('cv-preview-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cv-preview-modal';
        modal.className = 'cv-modal-overlay';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="cv-modal-backdrop" data-cv-close></div>
            <div class="cv-modal-dialog" role="dialog" aria-modal="true" aria-label="Curriculum Vitae Preview">
                <header class="cv-modal-header">
                    <div class="cv-modal-header-info">
                        <div class="cv-modal-badge"><i data-lucide="file-text"></i> CV PREVIEW</div>
                        <h3 class="cv-modal-title">Al Hafiz Taufikur Rohman — Curriculum Vitae</h3>
                    </div>
                    <div class="cv-modal-header-actions">
                        <button type="button" class="cv-modal-btn cv-modal-btn-print" id="cv-modal-print-btn">
                            <i data-lucide="printer"></i>
                            <span>Print / Save PDF</span>
                        </button>
                        <a href="assets/docs/cv-en.html" download="Al-Hafiz-Taufikur-Rohman-CV.html" class="cv-modal-btn cv-modal-btn-download" id="cv-modal-download-btn">
                            <i data-lucide="download"></i>
                            <span>Download CV</span>
                        </a>
                        <button type="button" class="cv-modal-close" data-cv-close aria-label="Close CV Preview">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                </header>
                <div class="cv-modal-body">
                    <iframe id="cv-modal-iframe" src="assets/docs/cv-en.html" title="Curriculum Vitae Document"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Re-render Lucide icons for the newly injected modal elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    const iframe = document.getElementById('cv-modal-iframe');
    const printBtn = document.getElementById('cv-modal-print-btn');
    const downloadBtn = document.getElementById('cv-modal-download-btn');

    // Print button logic
    if (printBtn && iframe) {
        printBtn.onclick = () => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            } catch (err) {
                console.error("Print error:", err);
                window.open('assets/docs/cv-en.html', '_blank');
            }
        };
    }

    // Direct download button logic inside modal
    if (downloadBtn) {
        downloadBtn.onclick = (e) => {
            e.stopPropagation(); // Stop event propagation so openModal doesn't intercept
            // Allow natural browser download link behavior
        };
    }

    function openModal(e) {
        if (e) e.preventDefault();
        
        // Reload iframe if needed to make sure it's fresh
        if (iframe && iframe.src) {
            iframe.src = 'assets/docs/cv-en.html?t=' + Date.now();
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Bind event listeners to trigger buttons ONLY outside the modal
    function bindTriggers() {
        const triggers = document.querySelectorAll('[data-open-cv-modal], a[href*="cv-en.html"]');
        triggers.forEach(trigger => {
            // Exclude modal's internal download button!
            if (trigger.id === 'cv-modal-download-btn' || trigger.closest('.cv-modal-header-actions')) {
                return;
            }
            if (trigger.dataset.hasCvListener) return;
            trigger.dataset.hasCvListener = 'true';
            trigger.addEventListener('click', openModal);
        });
    }

    bindTriggers();

    // Re-bind on MutationObserver in case components load dynamically
    const observer = new MutationObserver(() => bindTriggers());
    observer.observe(document.body, { childList: true, subtree: true });

    // Close buttons & backdrop handling
    modal.querySelectorAll('[data-cv-close]').forEach(closeEl => {
        closeEl.addEventListener('click', closeModal);
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
