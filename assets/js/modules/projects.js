export function initProjectDetails() {
    const modal = document.getElementById('project-detail-modal');
    if (!modal || modal.dataset.bound === 'true') return;

    // Move modal to document body to escape containing blocks (e.g. contain: paint / transform) on ancestors
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    const panels = modal.querySelectorAll('[data-project-panel]');
    const openButtons = document.querySelectorAll('[data-project-open]');
    const closeButtons = modal.querySelectorAll('[data-project-close]');

    if (!panels.length || !openButtons.length) return;

    let lastFocused = null;

    const openProject = (projectId, trigger) => {
        lastFocused = trigger || document.activeElement;

        // Toggle the correct panel
        panels.forEach(panel => {
            panel.classList.toggle('is-active', panel.dataset.projectPanel === projectId);
        });

        // Show the modal
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');

        requestAnimationFrame(() => {
            const scrollContainer = modal.querySelector('.project-detail-scroll-container') || modal.querySelector('.project-detail-dialog');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
        });

        // Re-create Lucide icons inside the newly visible panel
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Focus the close button for keyboard accessibility
        const closeButton = modal.querySelector('.project-detail-close');
        if (closeButton) closeButton.focus({ preventScroll: true });
    };

    const closeProject = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('project-modal-open');

        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus({ preventScroll: true });
        }
    };

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            openProject(button.dataset.projectOpen, button);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', closeProject);
    });

    // Close on backdrop click (click on the modal overlay itself, outside the dialog)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProject();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeProject();
        }
    });

    modal.dataset.bound = 'true';
}
