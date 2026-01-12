document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = parseInt(urlParams.get('id'));

    if (!resourceId) {
        window.location.href = 'booking.html';
        return;
    }

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.history.back();
    });

    // Instructions Accordion Toggle
    const instructionHeader = document.querySelector('.instruction-header');
    if (instructionHeader) {
        instructionHeader.addEventListener('click', () => {
            const row = instructionHeader.closest('.instruction-row');
            row.classList.toggle('active');
        });
    }

    // Reserve Button
    const reserveBtn = document.querySelector('.reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            window.location.href = `reserve-options.html?id=${resourceId}`;
        });
    }

    try {
        const response = await fetch('data.json');
        const allData = await response.json();
        const item = allData.find(i => i.id === resourceId);

        if (item) {
            renderDetails(item);
        } else {
            console.error('Item not found');
            window.location.href = 'booking.html';
        }
    } catch (error) {
        console.error('Error loading item:', error);
    }
});

function renderDetails(item) {
    document.getElementById('resource-name').innerText = item.name;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = item.name;
    
    document.getElementById('resource-desc').innerText = item.desc || "No description available.";
    document.getElementById('resource-instructions').innerText = item.instructions || "No specific instructions provided. Please handle with care.";
    
    const imgEl = document.getElementById('resource-image');
    imgEl.src = item.image;
    imgEl.onerror = () => {
        imgEl.src = `https://placehold.co/600x400?text=${item.name}`;
    };

    const availText = document.getElementById('availability-text');
    const statusDot = document.getElementById('status-dot');
    if (item.availability) {
        availText.innerText = "Available Now";
        if (statusDot) statusDot.className = "info-dot available";
    } else {
        availText.innerText = "Currently Booked";
        if (statusDot) statusDot.className = "info-dot booked";
    }

    document.getElementById('tier-text').innerText = `Tier ${item.tier}`;
}