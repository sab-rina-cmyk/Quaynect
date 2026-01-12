document.addEventListener('DOMContentLoaded', async () => {
    // Scroll handling for Hero darkening
    const heroImage = document.querySelector('.hero-image');
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    const heroHeight = heroImage.offsetHeight;

    scrollWrapper.addEventListener('scroll', () => {
        const scrollY = scrollWrapper.scrollTop;
        
        // Darken image as we scroll
        // Map 0 -> heroHeight to 0.2 -> 0.7 darkness
        const darkness = Math.min(0.7, 0.2 + (scrollY / heroHeight) * 0.5);
        heroImage.style.setProperty('--hero-darkness', darkness);
    });

    // Back button functionality
    const backBtn = document.querySelector('.bookings-header .back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // Dynamic Bookings Rendering
    async function loadBookings() {
        const bookingsList = document.getElementById('bookings-list');
        const emptyState = document.getElementById('bookings-empty-state');
        if (!bookingsList) return;

        const savedBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
        
        if (savedBookings.length === 0) {
            bookingsList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            bookingsList.innerHTML = savedBookings.map(booking => {
                const item = data.find(i => i.id === parseInt(booking.id));
                if (!item) return '';

                let status = 'Upcoming';
                let statusClass = 'upcoming';
                let displayTime = '';
                let dueTimeStr = '';

                if (booking.type === 'now') {
                    status = 'Active';
                    statusClass = 'active';
                    displayTime = 'Today, Immediate';
                    
                    // 24 hour loan period
                    const pickupTime = new Date(booking.timestamp);
                    const dueTime = new Date(pickupTime.getTime() + (24 * 60 * 60 * 1000));
                    
                    // Round to nearest 30 mins
                    const minutes = dueTime.getMinutes();
                    const roundedMinutes = Math.round(minutes / 30) * 30;
                    dueTime.setMinutes(roundedMinutes);
                    dueTime.setSeconds(0);
                    
                    dueTimeStr = `Due: ${dueTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} tomorrow`;
                } else if (booking.date) {
                    const dateObj = new Date(booking.date);
                    const now = new Date();
                    const isToday = dateObj.toDateString() === now.toDateString();
                    
                    if (isToday) {
                        status = 'Active';
                        statusClass = 'active';
                        displayTime = `Today, ${booking.time}`;
                    } else {
                        // Format: "Mon, Jan 12 • 2:00 PM"
                        const datePart = dateObj.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                        displayTime = `${datePart} • ${booking.time}`;
                    }
                }

                return `
                    <div class="booking-card" onclick="window.location.href='resource-detail.html?id=${item.id}'">
                        <div class="booking-img">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/600x400?text=${item.name}'">
                        </div>
                        <div class="booking-info">
                            <h4>${item.name}</h4>
                            <div class="booking-time">
                                <ion-icon name="calendar-outline"></ion-icon>
                                <span>${displayTime}</span>
                            </div>
                            ${dueTimeStr ? `
                                <div class="due-time">
                                    <ion-icon name="time-outline"></ion-icon>
                                    <span>${dueTimeStr}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="booking-badge ${statusClass}">${status}</div>
                        <ion-icon name="chevron-forward-outline" class="detail-arrow"></ion-icon>
                    </div>
                `;
            }).reverse().join(''); // Show newest first
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    }

    await loadBookings();

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