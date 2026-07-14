export async function loadComponents() {
    const componentVersion = '2.3.8';
    const components = [
        { id: 'hero-component', url: 'components/hero.html' },
        { id: 'about-component', url: 'components/about.html' },
        { id: 'experience-component', url: 'components/experience.html' },
        { id: 'skills-component', url: 'components/skills.html' },
        { id: 'certifications-component', url: 'components/certifications.html' },
        { id: 'projects-component', url: 'components/projects.html' },
        { id: 'blog-component', url: 'components/blog.html' },
        { id: 'ask-ai-component', url: 'components/ask-ai.html' },
        { id: 'contact-component', url: 'components/contact.html' }
    ];

    const loadPromises = components.map(async (comp) => {
        const container = document.getElementById(comp.id);
        if (!container) return;
        try {
            const response = await fetch(`${comp.url}?v=${componentVersion}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${comp.url}`);
            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error(`Error loading module ${comp.url}:`, error);
            container.innerHTML = `<div style="padding: 2rem; text-align: center; color: red;">Error loading component ${comp.id}</div>`;
        }
    });

    // Wait for all HTML blocks to load in parallel
    await Promise.all(loadPromises);
}
