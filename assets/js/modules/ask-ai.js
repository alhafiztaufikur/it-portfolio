/**
 * Ask Hafiz AI - local portfolio assistant.
 * This does not call an external AI API; answers are grounded in portfolio data.
 */
export function initAskAI() {
    const chatLogs = document.getElementById('ask-ai-chat-logs');
    const inputField = document.getElementById('ask-ai-input');
    const askButton = document.getElementById('btn-ask');
    const suggestionsContainer = document.getElementById('ask-ai-suggestions');
    const evidenceText = document.getElementById('evidence-text');

    if (!chatLogs || !inputField || !askButton) return;

    const answers = {
        summary: {
            evidence: 'Profile summary, skills, projects, and contact sections.',
            text: `**Short recruiter summary**
- Hafiz is focused on **IT infrastructure, network support, and systems engineering**.
- Strongest fit: **Junior Network Engineer**, **IT Support**, **Network Automation**, or **Systems Support** roles.
- Portfolio proof includes **BisKita**, **jusPOS**, **Input Barang**, **ESP32 water-level monitoring**, **Project IMK**, and this modular website.
- He combines networking fundamentals, web/app development, IoT, and practical operations discipline.`
        },
        skills: {
            evidence: 'Skills section and project implementation notes.',
            text: `**Core technical strengths**
- **Networking**: Cisco fundamentals, routing/switching concepts, troubleshooting, LAN/WAN awareness.
- **Systems**: Linux basics, Docker exposure, server monitoring, documentation, and support workflows.
- **Development**: PHP, MySQL/MariaDB, JavaScript, Flutter/Dart, REST-style flows, and UI/UX prototyping.
- **IoT**: ESP32 sensor logic, HC-SR04 readings, Blynk status delivery, and simple telemetry dashboards.`
        },
        projects: {
            evidence: 'Projects archive and detail pages.',
            text: `**Projects worth noticing first**
- **BisKita Transit App**: Flutter mobile transport concept for routes, tickets, QR flow, and e-wallet payment.
- **jusPOS Web Point of Sale**: PHP + MySQL cashier system with cart, member, promo, receipt, recap, and admin modules.
- **Input Barang Management**: PHP inventory app for CRUD, stock search, reporting, margin calculation, and print pages.
- **Water Level Monitoring**: ESP32 prototype using HC-SR04 and Blynk to report water height/status.
- **Project IMK - Mobile UI/UX**: Figma interface and prototype case study for a mobile app experience.`
        },
        certifications: {
            evidence: 'Certifications section and linked certificate documents.',
            text: `**Certification highlights**
- **CCNA: Switching, Routing & Wireless Essentials** - Cisco Networking Academy.
- **CCNA: Introduction to Networks** - Cisco Networking Academy.
- **IT Essentials: PC Hardware & Software** - Cisco Networking Academy.
- Additional portfolio context also shows a TKJ/networking path and hands-on infrastructure learning.`
        },
        experience: {
            evidence: 'Experience section and profile narrative.',
            text: `**Experience snapshot**
- Hafiz's path combines Informatics study, TKJ foundations, service/operations discipline, and infrastructure projects.
- The current direction is **Network Automation & Systems Engineering**.
- He is positioning the portfolio around reliable operations: clean documentation, practical troubleshooting, automation mindset, and maintainable systems.`
        },
        rolefit: {
            evidence: 'Role direction, skills, certifications, and project mix.',
            text: `**Role fit**
Hafiz is a strong junior candidate for roles that need someone practical, technical, and trainable:
- Junior Network Engineer
- IT Support / Infrastructure Support
- Network Automation learner
- Systems Support
- Technical implementation intern or junior engineer

The best proof is the mix of networking certificates, IoT monitoring, inventory/POS systems, and project documentation.`
        },
        contact: {
            evidence: 'Contact links and footer links.',
            text: `**Contact Hafiz**
- **Email**: [hafiz.taufik33@gmail.com](mailto:hafiz.taufik33@gmail.com)
- **GitHub**: [github.com/alhafiztaufikur](https://github.com/alhafiztaufikur)
- **LinkedIn**: [Al Hafiz Taufikur Rohman](https://www.linkedin.com/in/al-hafiz-taufikur-rohman)
- You can also use the **Contact Me** button in the navbar.`
        },
        cv: {
            evidence: 'Hero CV action and local CV file.',
            text: `**CV**
Use the **Download CV** button in the hero section to download the CV file directly. The separate **View CV** link is meant for previewing the CV in the browser.`
        },
        figma: {
            evidence: 'Project IMK detail and Figma prototype links.',
            text: `**Project IMK / Figma**
Project IMK is presented as a **mobile UI/UX case study**. It focuses on app structure, clean navigation, wireframing, high-fidelity interface design, and an interactive Figma prototype.`
        },
        fallback: {
            evidence: 'Available local topics.',
            text: `I can answer from Hafiz's portfolio data. Try asking about **projects**, **skills**, **certifications**, **CV**, **experience**, **Project IMK**, or **contact details**.`
        }
    };

    const keywordMap = [
        { keys: ['summary', 'recruiter', 'singkat', 'overview', 'profile', 'profil', 'about', 'tentang'], match: 'summary' },
        { keys: ['skill', 'stack', 'tools', 'kemampuan', 'network', 'automation', 'linux', 'php', 'flutter', 'iot', 'esp32'], match: 'skills' },
        { keys: ['project', 'projects', 'projek', 'biskita', 'juspos', 'input barang', 'water', 'monitoring', 'portfolio', 'porto'], match: 'projects' },
        { keys: ['cert', 'certificate', 'certification', 'sertif', 'ccna', 'it essentials', 'cisco'], match: 'certifications' },
        { keys: ['experience', 'pengalaman', 'education', 'pendidikan', 'career', 'karir', 'intern', 'kerja'], match: 'experience' },
        { keys: ['role', 'fit', 'job', 'posisi', 'cocok', 'recruit', 'junior'], match: 'rolefit' },
        { keys: ['contact', 'email', 'linkedin', 'github', 'hubungi', 'kontak', 'instagram'], match: 'contact' },
        { keys: ['cv', 'resume', 'download', 'unduh'], match: 'cv' },
        { keys: ['figma', 'imk', 'prototype', 'ui', 'ux', 'design'], match: 'figma' }
    ];

    function escapeHTML(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function formatMarkdown(text) {
        return escapeHTML(text)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*)$/gm, '<span class="chat-list-item">$1</span>')
            .replace(/\n/g, '<br>');
    }

    function resolveAnswer(query) {
        const cleanQuery = query.toLowerCase().trim();
        const matched = keywordMap.find(item => item.keys.some(key => cleanQuery.includes(key)));
        return answers[matched?.match || 'fallback'];
    }

    function scrollToBottom() {
        chatLogs.scrollTop = chatLogs.scrollHeight;
    }

    function setEvidence(answer) {
        if (!evidenceText) return;
        evidenceText.textContent = answer.evidence;
    }

    function appendMessage(type, html) {
        const message = document.createElement('div');
        message.className = `chat-msg ${type}`;
        message.innerHTML = `<div class="chat-bubble">${html}</div>`;
        chatLogs.appendChild(message);
        scrollToBottom();
        return message;
    }

    function handleUserQuery(queryText) {
        const clean = queryText.trim();
        if (!clean) return;

        appendMessage('user', escapeHTML(clean));
        inputField.value = '';
        inputField.disabled = true;
        askButton.disabled = true;

        const loadingMessage = appendMessage('bot', '<span class="typing-dots">Scanning portfolio<span class="typing-cursor"></span></span>');
        const answer = resolveAnswer(clean);
        setEvidence(answer);

        window.setTimeout(() => {
            const bubble = loadingMessage.querySelector('.chat-bubble');
            bubble.innerHTML = formatMarkdown(answer.text);

            inputField.disabled = false;
            askButton.disabled = false;
            inputField.focus();
            scrollToBottom();
        }, 380);
    }

    askButton.addEventListener('click', () => handleUserQuery(inputField.value));

    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') handleUserQuery(inputField.value);
    });

    suggestionsContainer?.addEventListener('click', (event) => {
        const chip = event.target.closest('.suggestion-chip');
        if (!chip) return;
        handleUserQuery(chip.dataset.query || chip.textContent || '');
    });
}
