document.addEventListener('DOMContentLoaded', () => {
    // At a Glance Slider Logic
    const slider = document.getElementById('glance-slider');
    const dots = document.querySelectorAll('.glance-dot');
    
    if (slider && dots.length > 0) {
        let scrollInterval;

        const updateDots = () => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('w-4', 'bg-gray-800');
                    dot.classList.remove('w-1.5', 'bg-gray-300');
                } else {
                    dot.classList.add('w-1.5', 'bg-gray-300');
                    dot.classList.remove('w-4', 'bg-gray-800');
                }
            });
        };

        const autoAdvance = () => {
            const maxScroll = slider.scrollWidth - slider.offsetWidth;
            if (slider.scrollLeft >= maxScroll - 5) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
            }
        };

        slider.addEventListener('scroll', updateDots);

        // Start auto-advance timer
        const startTimer = () => {
            scrollInterval = setInterval(autoAdvance, 5000);
        };

        // Pause on touch/interaction
        slider.addEventListener('touchstart', () => clearInterval(scrollInterval));
        slider.addEventListener('touchend', startTimer);
        
        startTimer();
    }
});
