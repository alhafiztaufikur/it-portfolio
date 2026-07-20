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
- Hafiz is an Informatics Engineering student at **Bani Saleh University (GPA: 3.91/4.00)** with a strong background in Computer Network Engineering.
- Supported by **Cisco CCNA** & **BNSP national professional certifications**.
- Practical experience in Store Operations (PT. Sewu Segar Primatama), PPIC Inventory Planning (PT. Dharma Controlcable Indonesia), and PPK Ormawa Organization Leadership.
- Strongest fit: **Junior Network Engineer**, **IT Support**, **Network Automation**, or **Systems Support** roles.`
        },
        skills: {
            evidence: 'Skills section and project implementation notes.',
            text: `**Core technical strengths**
- **Hard Skills**: Network Design & Configuration (Cisco, MikroTik RouterOS), Physical Network Installation (crimping UTP/STP cables with RJ45), Hardware Maintenance & Troubleshooting, Operating Systems (Windows, Linux / Ubuntu).
- **Soft Skills**: Analytical Thinking, Problem Solving, Effective Communication, Adaptability, Time Management, Team Coordination.
- **Projects & Automation**: Water Level Monitoring (ESP32 + Blynk), Wazuh SIEM Implementation, Interactive Vanilla JS Portfolio.`
        },
        projects: {
            evidence: 'Projects archive and detail pages.',
            text: `**Projects worth noticing first**
- **Interactive Portfolio Website**: Developed a responsive portfolio using modular Vanilla JS, CLI loader, theme switcher, and AI recruiter chatbot.
- **Water Level Monitoring**: Built an ESP32 IoT prototype reading water level via HC-SR04 ultrasonic sensor and publishing status to Blynk IoT cloud.
- **Wazuh SIEM Implementation**: Designed a real-time network threat detection architecture using Wazuh SIEM for log management and security alerts.
- **BisKita Transit App & jusPOS POS**: Flutter transport concept and PHP/MySQL cashier system.`
        },
        certifications: {
            evidence: 'Certifications section and linked certificate documents.',
            text: `**Certifications vault**
- **Cisco CCNA: Introduction to Networks** - Cisco Networking Academy.
- **Cisco CCNA: Switching, Routing, and Wireless Essentials** - Cisco Networking Academy.
- **Cisco IT Essentials: PC Hardware & Software** - Cisco Networking Academy.
- **BNSP Certificate of Competence** - Computer & Network Engineering.
- **BNSP Certificate of Competence** - Intermediate Computer Operator.
- **Oracle Academy** - Database Design.`
        },
        experience: {
            evidence: 'Experience section and profile narrative.',
            text: `**Experience snapshot**
- **Bani Saleh University**: Bachelor of Informatics Engineering (Sep 2023 - Present) — GPA 3.91 / 4.00.
- **PPK Ormawa HMTI**: Community service team empowering local cooperative in Cimuning Village through digital marketing (Jul 2026 - Sep 2026).
- **PT. Sewu Segar Primatama**: Store Operations Staff handling POS transactions, daily sales reports, and stock opname (06 Feb 2025 - 16 Jun 2026).
- **PT. Dharma Controlcable Indonesia**: Production Planning and Inventory Control managing Master Production Schedule and MRP raw material inventory (May 2022 - 31 Aug 2022).
- **SMK Yadika 13 Tambun**: Computer & Network Engineering (Jul 2020 - May 2023) — Score: 90.27.
- **Notable Achievement**: Network Competition Participant (E-Time 2025) at Jakarta State Polytechnic.`
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
