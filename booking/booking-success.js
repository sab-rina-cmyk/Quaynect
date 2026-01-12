document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const dateStr = params.get('date');
    const timeStr = params.get('time');
    const isNow = params.get('type') === 'now';

    const dateEl = document.getElementById('disp-date');
    const timeEl = document.getElementById('disp-time');
    const dueEl = document.getElementById('disp-due');
    const dueRow = document.getElementById('due-row');
    const holdNote = document.getElementById('hold-note');
    const calendarBtn = document.getElementById('add-to-calendar');

    // Save booking to localStorage
    const resourceId = params.get('id');
    const timestamp = new Date().getTime();

    if (resourceId) {
        let myBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
        
        // Check if this booking (id + time) already exists to avoid duplicates on refresh
        const exists = myBookings.find(b => b.id === resourceId && b.time === timeStr && b.date === dateStr);
        
        if (!exists) {
            myBookings.push({
                id: resourceId,
                date: dateStr,
                time: timeStr || 'Immediate',
                type: isNow ? 'now' : 'scheduled',
                timestamp: timestamp
            });
            localStorage.setItem('myBookings', JSON.stringify(myBookings));
        }
    }

    if (isNow) {
        dateEl.innerText = 'Today';
        timeEl.innerText = 'Immediate Pickup';
        
        // Calculate due date (24 hours later)
        const rawDueDate = new Date(timestamp + (24 * 60 * 60 * 1000));
        
        // Round to nearest 30 mins
        const minutes = rawDueDate.getMinutes();
        const roundedMinutes = Math.round(minutes / 30) * 30;
        rawDueDate.setMinutes(roundedMinutes);
        rawDueDate.setSeconds(0);
        rawDueDate.setMilliseconds(0);

        if (dueEl && dueRow) {
            dueRow.style.display = 'flex';
            dueEl.innerText = `${rawDueDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} tomorrow`;
        }

        if (holdNote) holdNote.classList.add('active'); // Using class instead of flex
        if (calendarBtn) calendarBtn.classList.add('hidden');
    } else if (dateStr && timeStr) {
        const dateObj = new Date(dateStr);
        dateEl.innerText = dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
        timeEl.innerText = timeStr;
    }

    document.getElementById('go-home').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('add-to-calendar').addEventListener('click', () => {
        alert('Event added to your device calendar!');
    });
});
