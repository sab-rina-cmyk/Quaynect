document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryType = urlParams.get('type');
    
    // Update Page Title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && categoryType) {
        pageTitle.innerText = categoryType;
    }

    // Back Button Logic
    const backBtn = document.getElementById('category-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Fetch and Display Data
    try {
        const response = await fetch('data.json');
        const allData = await response.json();
        
        const filteredData = allData.filter(item => item.category.toLowerCase() === categoryType.toLowerCase());
        
        displayResources(filteredData);

        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const searchedData = filteredData.filter(item => 
                item.name.toLowerCase().includes(term) || 
                item.desc.toLowerCase().includes(term)
            );
            displayResources(searchedData);
        });

        // Chip filtering
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                const filter = chip.innerText;
                if (filter === 'All') {
                    displayResources(filteredData);
                } else {
                    const filteredByChip = filteredData.filter(item => 
                        item.name.toLowerCase().includes(filter.toLowerCase()) ||
                        item.desc.toLowerCase().includes(filter.toLowerCase())
                    );
                    displayResources(filteredByChip);
                }
            });
        });

    } catch (error) {
        console.error('Error loading resources:', error);
    }
});

function displayResources(items) {
    const grid = document.getElementById('resources-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No items found.</p>';
        return;
    }

    // Load bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        const dotClass = item.availability ? 'dot-available' : 'dot-unavailable';
        const statusText = item.availability ? 'Available' : 'Booked';

        const isBookmarked = bookmarks.includes(item.id);
        const bookmarkIcon = isBookmarked ? 'bookmark' : 'bookmark-outline';

        card.innerHTML = `
            <div class="resource-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/600x400?text=${item.name}'">
                <div class="bookmark-btn ${isBookmarked ? 'active' : ''}">
                    <ion-icon name="${bookmarkIcon}"></ion-icon>
                </div>
            </div>
            <div class="resource-info">
                <h5>${item.name}</h5>
                <div class="card-footer">
                    <div class="status-indicator">
                        <div class="dot ${dotClass}"></div>
                        <span class="status-text">${statusText}</span>
                    </div>
                    <span class="tier-text">Tier ${item.tier}</span>
                </div>
            </div>
        `;

        // Bookmark Toggle
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card navigation
            
            let currentBookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
            const index = currentBookmarks.indexOf(item.id);
            
            if (index > -1) {
                currentBookmarks.splice(index, 1);
                bookmarkBtn.classList.remove('active');
                bookmarkBtn.querySelector('ion-icon').setAttribute('name', 'bookmark-outline');
            } else {
                currentBookmarks.push(item.id);
                bookmarkBtn.classList.add('active');
                bookmarkBtn.querySelector('ion-icon').setAttribute('name', 'bookmark');
            }
            
            localStorage.setItem('bookmarkedResources', JSON.stringify(currentBookmarks));
        });

        card.addEventListener('click', () => {
            window.location.href = `resource-detail.html?id=${item.id}`;
        });

        grid.appendChild(card);
    });
}