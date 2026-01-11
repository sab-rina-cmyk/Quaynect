document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resourceId = parseInt(urlParams.get('id'));

    if (!resourceId) {
        window.location.href = 'bookings.html';
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

    try {
        const response = await fetch('data.json');
        const allData = await response.json();
        const item = allData.find(i => i.id === resourceId);

        if (item) {
            renderDetails(item);
        } else {
            console.error('Item not found');
            window.location.href = 'bookings.html';
        }
    } catch (error) {
        console.error('Error loading item:', error);
    }
});

function renderDetails(item) {
    document.getElementById('resource-name').innerText = item.name;
    document.getElementById('resource-desc').innerText = item.desc || "No description available.";
    document.getElementById('resource-instructions').innerText = item.instructions || "No specific instructions provided. Please handle with care.";
    
    const imgEl = document.getElementById('resource-image');
    imgEl.src = item.image;
    imgEl.onerror = () => {
        imgEl.src = `https://placehold.co/600x400?text=${item.name}`;
    };

    const availText = document.getElementById('availability-text');
    if (item.availability) {
        availText.innerText = "Available Now";
        availText.className = "info-value available";
    } else {
        availText.innerText = "Currently Booked";
        availText.className = "info-value booked";
    }

    document.getElementById('tier-text').innerText = `Tier ${item.tier}`;
}
