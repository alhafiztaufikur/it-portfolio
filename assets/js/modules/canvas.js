export function initNetworkCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 22;
    const connectionDistance = 95;
    const connectionDistanceSq = connectionDistance * connectionDistance;
    let particleColor = 'rgba(16, 185, 129, 0.4)';
    let lineRGB = '52, 211, 153';
    let lineHoverRGB = '16, 185, 129';
    let lastFrame = 0;
    let animationId = null;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let isScrolling = false;
    let scrollTimer = null;
    let resizeTimer = null;
    
    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    function refreshThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        particleColor = styles.getPropertyValue('--canvas-particle').trim() || particleColor;
        lineRGB = styles.getPropertyValue('--canvas-line').trim() || lineRGB;
        lineHoverRGB = styles.getPropertyValue('--canvas-line-hover').trim() || lineHoverRGB;
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
        canvas.width = Math.floor(viewportWidth * dpr);
        canvas.height = Math.floor(viewportHeight * dpr);
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        if (window.innerWidth < 768) {
            particleCount = 4;
        } else {
            particleCount = 10;
        }
        refreshThemeColors();
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * viewportWidth;
            this.y = Math.random() * viewportHeight;
            this.vx = (Math.random() - 0.5) * 0.32;
            this.vy = (Math.random() - 0.5) * 0.32;
            this.size = Math.random() * 1.5 + 1.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > viewportWidth) this.vx = -this.vx;
            if (this.y < 0 || this.y > viewportHeight) this.vy = -this.vy;

            if (!isScrolling && mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0 && distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x += (dx / distance) * force * 0.8;
                    this.y += (dy / distance) * force * 0.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < connectionDistanceSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - (dist / connectionDistance)) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            if (!isScrolling && mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const alpha = (1 - (dist / mouse.radius)) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${lineHoverRGB}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate(timestamp = 0) {
        animationId = requestAnimationFrame(animate);
        if (isScrolling) {
            cancelAnimationFrame(animationId);
            animationId = null;
            return;
        }
        if (timestamp - lastFrame < 66) return;
        lastFrame = timestamp;

        ctx.clearRect(0, 0, viewportWidth, viewportHeight);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        isScrolling = true;
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
            isScrolling = false;
            lastFrame = 0;
            if (!animationId && !document.hidden) animate();
        }, 180);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (!document.hidden && !animationId) {
            lastFrame = 0;
            animate();
        }
    });

    const themeObserver = new MutationObserver(refreshThemeColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            resizeCanvas();
            if (!animationId && !document.hidden) animate();
        }, 120);
    }, { passive: true });
    resizeCanvas();
    animate();
}
