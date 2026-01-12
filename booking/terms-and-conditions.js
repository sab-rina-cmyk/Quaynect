document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    const checkbox = document.getElementById('terms-checkbox');
    const completeBtn = document.getElementById('complete-booking');

    if (checkbox && completeBtn) {
        checkbox.addEventListener('change', () => {
            completeBtn.disabled = !checkbox.checked;
        });

        completeBtn.addEventListener('click', () => {
            const params = new URLSearchParams(window.location.search);
            window.location.href = `booking-success.html?${params.toString()}`;
        });
    }
});
