export function hideSplashScreen(startTime, minDurationMs = 1500) {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDurationMs - elapsedTime);

    // Wait for the remaining duration to ensure smooth orbital presentation
    setTimeout(() => {
        splash.classList.add('fade-out');

        // Clean up from layout tree after fade-out transition finishes (800ms)
        setTimeout(() => {
            splash.style.display = 'none';
        }, 800);
    }, remainingTime);
}
