// Filter button interactions and pagination
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const groupCards = document.querySelectorAll('.group-card');
    const scrollContainer = document.getElementById('groups-scroll-container');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    // Section navigation
    const exploreSection = document.getElementById('explore-section');
    const discoverGroupsSection = document.getElementById('discover-groups-section');
    const discoverEventsSection = document.getElementById('discover-events-section');
    const groupsCard = document.getElementById('groups-card');
    const eventsCard = document.getElementById('events-card');
    const backToExploreBtn = document.getElementById('back-to-explore');
    const backToExploreEventsBtn = document.getElementById('back-to-explore-events');
    
    // Events section elements
    const eventsScrollContainer = document.getElementById('events-scroll-container');
    const eventsPaginationDots = document.querySelectorAll('.events-pagination-dot');
    const eventCards = document.querySelectorAll('.event-card');
    
    // Handle group card clicks to navigate to detail page
    groupCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on bookmark button
            if (e.target.closest('button')) {
                return;
            }
            
            const groupTitle = this.querySelector('h3').textContent;
            const groupSlug = groupTitle.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[&]/g, '')
                .replace(/[^\w-]/g, '');
            window.location.href = `group-detail.html?group=${groupSlug}`;
        });
        
        // Make cards look clickable
        card.style.cursor = 'pointer';
    });
    
    // Navigate to Discover Groups
    groupsCard.addEventListener('click', function() {
        exploreSection.classList.add('hidden');
        discoverGroupsSection.classList.remove('hidden');
        discoverEventsSection.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Navigate to Discover Events
    eventsCard.addEventListener('click', function() {
        exploreSection.classList.add('hidden');
        discoverGroupsSection.classList.add('hidden');
        discoverEventsSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Navigate back to Explore Quayside from Groups
    backToExploreBtn.addEventListener('click', function() {
        discoverGroupsSection.classList.add('hidden');
        exploreSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Navigate back to Explore Quayside from Events
    backToExploreEventsBtn.addEventListener('click', function() {
        discoverEventsSection.classList.add('hidden');
        exploreSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active state from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
                btn.classList.add('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            });
            
            // Add active state to clicked button
            this.classList.remove('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            this.classList.add('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
            
            // Get the filter category
            const category = this.getAttribute('data-filter');
            console.log('Filter clicked:', category);
            
            // Filter the cards
            groupCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                    // Add fade-in animation
                    card.style.animation = 'fadeIn 0.3s ease-in';
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Reset scroll position
            scrollContainer.scrollTop = 0;
            updatePaginationDots();
        });
    });
    
    // Update pagination dots based on scroll position
    let scrollTimeout;
    function updatePaginationDots() {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Determine which page we're on (0-based index)
        const currentPage = Math.round(scrollPercentage);
        
        paginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.remove('opacity-30');
                dot.classList.add('opacity-100');
            } else {
                dot.classList.remove('opacity-100');
                dot.classList.add('opacity-30');
            }
        });
    }
    
    // Snap to nearest page after scrolling stops
    function snapToPage() {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        // If scrolled past halfway, snap to page 2 (bottom), otherwise snap to page 1 (top)
        if (scrollTop > maxScroll / 2) {
            scrollContainer.scrollTo({ top: maxScroll, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Listen to scroll events
    scrollContainer.addEventListener('scroll', function() {
        updatePaginationDots();
        
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Set new timeout to snap after scrolling stops
        scrollTimeout = setTimeout(snapToPage, 150);
    });
    
    // Initial update
    updatePaginationDots();
    
    // ====== EVENTS SECTION PAGINATION ======
    
    // Update events pagination dots based on scroll position
    function updateEventsPaginationDots() {
        const scrollTop = eventsScrollContainer.scrollTop;
        const scrollHeight = eventsScrollContainer.scrollHeight;
        const clientHeight = eventsScrollContainer.clientHeight;
        
        // Calculate which page we're on (3 pages total)
        const totalScrollableHeight = scrollHeight - clientHeight;
        const pageHeight = totalScrollableHeight / 2; // 2 because we have 3 pages (0-1, 1-2)
        
        let currentPage = 0;
        if (scrollTop < pageHeight) {
            currentPage = 0;
        } else if (scrollTop < pageHeight * 2) {
            currentPage = 1;
        } else {
            currentPage = 2;
        }
        
        // Update pagination dots
        eventsPaginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.style.opacity = '1';
            } else {
                dot.style.opacity = '0.3';
            }
        });
    }
    
    // Listen for scroll events on events container
    let eventsScrollTimeout;
    eventsScrollContainer.addEventListener('scroll', function() {
        clearTimeout(eventsScrollTimeout);
        eventsScrollTimeout = setTimeout(() => {
            updateEventsPaginationDots();
        }, 50);
    });
    
    // Click pagination dots to navigate to specific page
    eventsPaginationDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            const scrollHeight = eventsScrollContainer.scrollHeight;
            const clientHeight = eventsScrollContainer.clientHeight;
            const totalScrollableHeight = scrollHeight - clientHeight;
            
            // Calculate target scroll position
            let targetScroll;
            if (index === 0) {
                targetScroll = 0;
            } else if (index === 1) {
                targetScroll = totalScrollableHeight / 2;
            } else {
                targetScroll = totalScrollableHeight;
            }
            
            eventsScrollContainer.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
        
        // Make dots clickable
        dot.style.cursor = 'pointer';
    });
    
    // Initial events pagination update
    updateEventsPaginationDots();
});
