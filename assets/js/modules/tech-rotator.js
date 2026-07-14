/**
 * tech-rotator.js — Dynamic Technology Card Rotator
 * Cycles through different technologies (Java, Python, Docker, Cisco, Linux, Ansible, Grafana, HTML5, IoT)
 * on the hero section card every ~1.5s with smooth transition animations.
 */

const TECH_DATA = [
    {
        name: "Java",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.07 1C14.07 1 12.7 4 11.2 5.5C9.7 7 8 8 8 10C8 12.5 10 13.5 10 13.5C10 13.5 8.5 13 8 12C7.5 11 8.2 9.5 9 8.5C9.8 7.5 11.5 6.5 12.5 4C13.5 1.5 14.07 1 14.07 1Z" fill="#EA2D42"/>
            <path d="M17.07 3C17.07 3 15.7 6 14.2 7.5C12.7 9 11 10 11 12C11 14.5 13 15.5 13 15.5C13 15.5 11.5 15 11 14C10.5 13 11.2 11.5 12 10.5C12.8 9.5 14.5 8.5 15.5 6C16.5 3.5 17.07 3 17.07 3Z" fill="#EA2D42"/>
            <path d="M2.5 18C4 18 6.5 19.5 11.5 19.5C16.5 19.5 20.5 18.5 21.5 17.5C22 17 21 16 19.5 16C18 16 16.5 17 11.5 17C6.5 17 4.5 16 3.5 16C2.5 16 1 18 2.5 18Z" fill="#306998"/>
            <path d="M4.5 15.5C4.5 15.5 6 14 11 14C16 14 18.5 15.5 18.5 15.5C18.5 15.5 17 14.5 11 14.5C5 14.5 4.5 15.5 4.5 15.5Z" fill="#306998"/>
            <path d="M3.5 21C5 21 7.5 22.5 11.5 22.5C15.5 22.5 18 21 19.5 20.5C20.5 20.2 21 21.5 19.5 22C18 22.5 15 23.5 11.5 23.5C8 23.5 5 22.5 3.5 22C2 21.5 2 21 3.5 21Z" fill="#306998"/>
        </svg>`
    },
    {
        name: "Python",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.95 2C8.75 2 8.42 2.14 7.16 2.7c-1.25.56-2.16 1.34-2.8 2.53C3.72 6.42 3.58 7.33 3.58 10.45h3.45c0-2.3.2-2.92.74-3.46.54-.54 1.15-.75 3.46-.75h4.15c2.3 0 2.92.2 3.46.75s.74 1.15.74 3.46V13.9H11.95c-3.12 0-4.03-.14-5.22-.78a5.52 5.52 0 0 1-2.53-2.8C3.56 9.07 3.56 8.74 3.56 5.55S3.56 2 11.95 2z" fill="#306998"/>
            <path d="M12.05 22c3.2 0 3.53-.14 4.79-.7 1.25-.56 2.16-1.34 2.8-2.53.64-1.19.78-2.1.78-5.22h-3.45c0 2.3-.2 2.92-.74 3.46-.54.54-1.15.75-3.46.75H8.62c-2.3 0-2.92-.2-3.46-.75S4.42 16 4.42 13.7v-3.45H12.05c3.12 0 4.03.14 5.22.78a5.52 5.52 0 0 1 2.53 2.8c.64 1.25.64 1.58.64 4.77S20.44 22 12.05 22z" fill="#FFE873"/>
            <circle cx="8.5" cy="5.5" r="0.75" fill="#fff"/>
            <circle cx="15.5" cy="18.5" r="0.75" fill="#111"/>
        </svg>`
    },
    {
        name: "Docker",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="6" y="8" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="10" y="8" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="6" y="4" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="10" y="4" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="14" y="8" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="14" y="4" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <rect x="18" y="8" width="3" height="3" rx="0.5" fill="#0db7ed"/>
            <path d="M2.5 13.5C2.5 13.5 4.5 12 7.5 12C11 12 13 14 15.5 14C19 14 21.5 12 21.5 12C21.5 12 22 15 19.5 17.5C17 20 12.5 20.5 9.5 20C5.5 19.3 2.5 16 2.5 13.5Z" fill="#0db7ed"/>
            <path d="M21.5 12C22.5 11 23 9.5 23 9.5C23 9.5 22.5 11.5 21.5 12Z" fill="#0db7ed"/>
        </svg>`
    },
    {
        name: "Cisco",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="10" width="2" height="4" rx="1" fill="#00baf2"/>
            <rect x="5" y="6" width="2" height="12" rx="1" fill="#00baf2"/>
            <rect x="8" y="3" width="2" height="18" rx="1" fill="#00baf2"/>
            <rect x="11" y="8" width="2" height="8" rx="1" fill="#00baf2"/>
            <rect x="14" y="3" width="2" height="18" rx="1" fill="#00baf2"/>
            <rect x="17" y="6" width="2" height="12" rx="1" fill="#00baf2"/>
            <rect x="20" y="10" width="2" height="4" rx="1" fill="#00baf2"/>
        </svg>`
    },
    {
        name: "Linux",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8 2 6 5 6 9.5C6 11 6.5 13.5 7.5 15C7 16 6 17 5 18C4.5 18.5 5 19.5 6 19.5C8 19.5 9.5 18.5 10 17.5C11 18 11.5 18 12 18C12.5 18 13 18 14 17.5C14.5 18.5 16 19.5 18 19.5C19 19.5 19.5 18.5 19 18C18 17 17 16 16.5 15C17.5 13.5 18 11 18 9.5C18 5 16 2 12 2Z" fill="#111827"/>
            <ellipse cx="9.5" cy="9.5" rx="1.5" ry="2" fill="#fff"/>
            <circle cx="9.5" cy="9.5" r="0.75" fill="#000"/>
            <ellipse cx="14.5" cy="9.5" rx="1.5" ry="2" fill="#fff"/>
            <circle cx="14.5" cy="9.5" r="0.75" fill="#000"/>
            <path d="M10.5 11.5C10.5 11.5 11 13.5 12 13.5C13 13.5 13.5 11.5 13.5 11.5H10.5Z" fill="#fbbf24"/>
            <path d="M6.5 20C5.5 20.5 5 22 7 22C8.5 22 9.5 21.5 10 20.5L6.5 20Z" fill="#fbbf24"/>
            <path d="M17.5 20C18.5 20.5 19 22 17 22C15.5 22 14.5 21.5 14 20.5L17.5 20Z" fill="#fbbf24"/>
        </svg>`
    },
    {
        name: "Ansible",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#EE0000"/>
            <path d="M12 4.5L5.5 17.5H8.5L10 14.5H14L15.5 17.5H18.5L12 4.5ZM12 8.5L13.25 11.5H10.75L12 8.5Z" fill="#FFFFFF"/>
        </svg>`
    },
    {
        name: "Grafana",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="#f47a20"/>
        </svg>`
    },
    {
        name: "HTML5",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 2H21.5L19.5 20L12 22L4.5 20L2.5 2Z" fill="#E34F26"/>
            <path d="M12 3.8V20.2L18 18.6L19.6 3.8H12Z" fill="#EF652A"/>
            <path d="M12 8.5H8.5L8.7 10.8H12V13H9.1L9.3 15.3L12 16L14.7 15.3L15 13H12.7V10.8H15.2L15.5 8.5H12Z" fill="#FFFFFF"/>
        </svg>`
    },
    {
        name: "IoT Systems",
        logo: `<svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="#10b981" stroke-width="2"/>
            <rect x="8" y="8" width="8" height="8" rx="1.5" fill="#10b981"/>
            <line x1="12" y1="1" x2="12" y2="4" stroke="#10b981" stroke-width="2"/>
            <line x1="12" y1="20" x2="12" y2="23" stroke="#10b981" stroke-width="2"/>
            <line x1="1" y1="12" x2="4" y2="12" stroke="#10b981" stroke-width="2"/>
            <line x1="20" y1="12" x2="23" y2="12" stroke="#10b981" stroke-width="2"/>
            <circle cx="12" cy="12" r="1.5" fill="#fff"/>
            <path d="M 8 7 A 6 6 0 0 1 16 7" stroke="#10b981" stroke-width="1.5" fill="none"/>
        </svg>`
    }
];

export function initTechRotator() {
    const container = document.getElementById('tech-logo-container');
    const label = document.getElementById('tech-name-label');
    if (!container || !label) return;

    let currentIndex = 0;

    // Load initial item
    container.innerHTML = TECH_DATA[currentIndex].logo;
    label.textContent = TECH_DATA[currentIndex].name;

    // Rotate every 1.5 seconds
    setInterval(() => {
        container.classList.add('fade-out');
        label.classList.add('fade-out');

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % TECH_DATA.length;
            container.innerHTML = TECH_DATA[currentIndex].logo;
            label.textContent = TECH_DATA[currentIndex].name;

            container.classList.remove('fade-out');
            label.classList.remove('fade-out');
        }, 300); // waits for fade-out transition (300ms) to complete
    }, 1500);
}
