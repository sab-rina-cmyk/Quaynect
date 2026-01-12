document.addEventListener('DOMContentLoaded', async () => {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    try {
        const response = await fetch('data.json');
        const allData = await response.json();
        
        displayBookmarks(allData);
    } catch (error) {
        console.error('Error loading resources:', error);
    }
});

function displayBookmarks(allData) {
    const grid = document.getElementById('bookmarks-grid');
    const emptyState = document.getElementById('empty-state');
    grid.innerHTML = '';

    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
    const bookmarkedItems = allData.filter(item => bookmarks.includes(item.id));

    if (bookmarkedItems.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    bookmarkedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        
        const dotClass = item.availability ? 'dot-available' : 'dot-unavailable';
        const statusText = item.availability ? 'Available' : 'Booked';

        card.innerHTML = `
            <div class="resource-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/600x400?text=${item.name}'">
                <div class="bookmark-btn active">
                    <ion-icon name="bookmark"></ion-icon>
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

        // Bookmark Toggle (to remove from bookmarks)
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            let currentBookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
            const index = currentBookmarks.indexOf(item.id);
            
            if (index > -1) {
                currentBookmarks.splice(index, 1);
                localStorage.setItem('bookmarkedResources', JSON.stringify(currentBookmarks));
                // Refresh display
                displayBookmarks(allData);
            }
        });

        card.addEventListener('click', () => {
            window.location.href = `resource-detail.html?id=${item.id}`;
        });

        grid.appendChild(card);
    });
}
