export function initConcertButtonWidths() {
    const syncButtonWidths = () => {
        const buttons = document.querySelectorAll('.tour-dates__btn') as NodeListOf<HTMLElement>;
        const actions = document.querySelectorAll('.tour-dates__action') as NodeListOf<HTMLElement>;
        if (!buttons.length) return;

        // Reset widths to calculate auto width based on content
        actions.forEach(action => {
            action.style.minWidth = '';
        });

        if (window.innerWidth <= 768) {
            return; // on mobile, let CSS width: 100% take over
        }

        // Find max width
        let maxWidth = 0;
        buttons.forEach(btn => {
            const width = btn.getBoundingClientRect().width;
            if (width > maxWidth) {
                maxWidth = width;
            }
        });

        // Apply max width
        if (maxWidth > 0) {
            actions.forEach(action => {
                action.style.minWidth = `${maxWidth}px`;
            });
        }
    };

    // Run initially
    syncButtonWidths();

    // Re-run on resize and font load to be robust
    window.addEventListener('resize', () => {
        requestAnimationFrame(syncButtonWidths);
    });

    if ('fonts' in document) {
        document.fonts.ready.then(() => {
            syncButtonWidths();
        });
    }
}
