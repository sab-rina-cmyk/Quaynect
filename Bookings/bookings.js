document.addEventListener('DOMContentLoaded', () => {
    // Scroll handling for Hero darkening
    const heroImage = document.querySelector('.hero-image');
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    const heroHeight = heroImage.offsetHeight;

    scrollWrapper.addEventListener('scroll', () => {
        const scrollY = scrollWrapper.scrollTop;
        
        // Darken image as we scroll
        // Map 0 -> heroHeight to 0.3 -> 0.8 darkness
        const darkness = Math.min(0.8, 0.3 + (scrollY / heroHeight) * 0.5);
        heroImage.style.setProperty('--hero-darkness', darkness);
    });

    // Back button functionality
    const backBtn = document.querySelector('.bookings-header .back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // Category Card Interactions
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h4').innerText;
            window.location.href = `category.html?type=${category}`;
        });
    });

    // Policy Accordion Interactions
    const policyRows = document.querySelectorAll('.policy-row');
    policyRows.forEach(row => {
        row.addEventListener('click', () => {
            // Close other rows (optional, comment out for multiple open)
            policyRows.forEach(otherRow => {
                if (otherRow !== row) otherRow.classList.remove('active');
            });
            
            row.classList.toggle('active');
        });
    });
});
