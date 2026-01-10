document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            console.log(`Navigated to: ${item.querySelector('span').innerText}`);
        });
    });

    // RSVP Button
    const rsvpBtn = document.querySelector('.rsvp-btn');
    if (rsvpBtn) {
        rsvpBtn.addEventListener('click', () => {
            rsvpBtn.textContent = 'RSVP Sent!';
            rsvpBtn.style.backgroundColor = '#fff';
            rsvpBtn.style.color = '#333';
            setTimeout(() => {
                rsvpBtn.textContent = 'RSVP';
                rsvpBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                rsvpBtn.style.color = 'white';
            }, 2000);
        });
    }

    // Dashboard Cards Interaction
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').innerText;
            console.log(`Open ${title}`);
            
            // Subtle feedback
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Expand Dashboard Button
    const expandBtn = document.querySelector('.expand-btn');
    const expandableWrapper = document.querySelector('.expandable-wrapper');

    if (expandBtn && expandableWrapper) {
        let expanded = false;
        expandBtn.addEventListener('click', () => {
            expanded = !expanded;
            
            // Rotate icon
            const icon = expandBtn.querySelector('svg');
            icon.style.transition = 'transform 0.4s ease';
            icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
            
            // Animate wrapper
            if (expanded) {
                expandableWrapper.style.maxHeight = expandableWrapper.scrollHeight + "px";
                expandableWrapper.style.opacity = "1";
            } else {
                expandableWrapper.style.maxHeight = "0px";
                expandableWrapper.style.opacity = "0";
            }
            
            console.log(expanded ? 'Dashboard expanded' : 'Dashboard collapsed');
        });
    }

    // Notification Banner
    const banner = document.querySelector('.notification-banner');
    if (banner) {
        banner.addEventListener('click', () => {
            console.log('Opening notification details');
        });
    }
});
