export function initProjectDetails() {
    const modal = document.getElementById('project-detail-modal');
    if (!modal || modal.dataset.bound === 'true') return;

    const panels = modal.querySelectorAll('[data-project-panel]');
    const openButtons = document.querySelectorAll('[data-project-open]');
    const closeButtons = modal.querySelectorAll('[data-project-close]');

    if (!panels.length || !openButtons.length) return;

    let lastFocused = null;

    const openProject = (projectId, trigger) => {
        lastFocused = trigger || document.activeElement;

        panels.forEach(panel => {
            panel.classList.toggle('is-active', panel.dataset.projectPanel === projectId);
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('project-modal-open');

        const closeButton = modal.querySelector('.project-detail-close');
        if (closeButton) closeButton.focus({ preventScroll: true });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
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

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeProject();
        }
    });

    modal.dataset.bound = 'true';
}
