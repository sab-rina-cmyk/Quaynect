document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('back-btn').addEventListener('click', () => {
        window.history.back();
    });

    const reserveLaterBtn = document.getElementById('reserve-later');
    const calendarDropdown = document.getElementById('calendar-dropdown');
    const reserveLaterGroup = document.getElementById('reserve-later-group');
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthEl = document.getElementById('current-month');
    const confirmBtn = document.getElementById('confirm-date');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const timeSelection = document.getElementById('time-selection');
    const timeGrid = document.getElementById('time-grid');

    let date = new Date();
    let selectedDate = null;
    let selectedTime = null;

    if (reserveLaterBtn) {
        reserveLaterBtn.addEventListener('click', () => {
            reserveLaterGroup.classList.toggle('active');
            calendarDropdown.classList.toggle('active');
            renderCalendar();
        });
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            date.setMonth(date.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            date.setMonth(date.getMonth() + 1);
            renderCalendar();
        });
    }

    function renderCalendar() {
        if (!calendarDays) return;
        calendarDays.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        
        currentMonthEl.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const todayArray = new Date();

        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(emptyDiv);
        }

        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');
            dayEl.innerText = i;

            const curDay = new Date(year, month, i);
            
            // Set today
            if (curDay.toDateString() === todayArray.toDateString()) {
                dayEl.classList.add('today');
            }

            // Check availability (Mock: All days today and in future are available)
            // Let's make weekends unavailable for demonstration
            const isWeekend = curDay.getDay() === 0 || curDay.getDay() === 6;
            const isPast = curDay < new Date(new Date().setHours(0,0,0,0));

            if (isPast || isWeekend) {
                dayEl.classList.add('unavailable');
            } else {
                dayEl.classList.add('available');
                dayEl.addEventListener('click', () => selectDate(dayEl, curDay));
            }

            if (selectedDate && curDay.toDateString() === selectedDate.toDateString()) {
                dayEl.classList.add('selected');
            }

            calendarDays.appendChild(dayEl);
        }
    }

    function selectDate(element, day) {
        document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        selectedDate = day;
        
        // Show time selection
        if (timeSelection) {
            timeSelection.classList.remove('hidden');
        }
        renderTimeSlots();
        updateConfirmBtn();
    }

    function renderTimeSlots() {
        if (!timeGrid) return;
        timeGrid.innerHTML = '';
        const startHour = 9;
        const endHour = 18; // 6:00 PM
        
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minutes of [0, 30]) {
                if (hour === endHour && minutes === 30) break; // Don't go past 6:00 PM

                const timeStr = formatTime(hour, minutes);
                const slot = document.createElement('div');
                slot.classList.add('time-slot');
                slot.innerText = timeStr;

                if (selectedTime === timeStr) {
                    slot.classList.add('selected');
                }

                slot.addEventListener('click', () => {
                    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
                    slot.classList.add('selected');
                    selectedTime = timeStr;
                    updateConfirmBtn();
                });

                timeGrid.appendChild(slot);
            }
        }
    }

    function formatTime(hour, minutes) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayMinutes = minutes === 0 ? '00' : '30';
        return `${displayHour}:${displayMinutes} ${ampm}`;
    }

    function updateConfirmBtn() {
        if (!confirmBtn) return;
        confirmBtn.disabled = !(selectedDate && selectedTime);
        if (selectedDate && selectedTime) {
            confirmBtn.innerText = `Confirm Pickup for ${selectedTime}`;
        } else {
            confirmBtn.innerText = 'Confirm Pickup Date & Time';
        }
    }

    const reserveNowBtn = document.getElementById('reserve-now');
    if (reserveNowBtn) {
        reserveNowBtn.addEventListener('click', () => {
            window.location.href = `terms-and-conditions.html?id=${new URLSearchParams(window.location.search).get('id')}&type=now`;
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (selectedDate && selectedTime) {
                window.location.href = `terms-and-conditions.html?id=${new URLSearchParams(window.location.search).get('id')}&date=${selectedDate.toISOString()}&time=${selectedTime}`;
            }
        });
    }
});
