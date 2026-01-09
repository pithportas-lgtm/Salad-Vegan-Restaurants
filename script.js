document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }

    // --- Navbar Scroll Effect --- 
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.8rem 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.padding = '1.2rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Bowl Builder Logic ---
    const form = document.getElementById('bowl-builder-form');
    const summaryList = document.getElementById('summary-list');
    const totalPriceEl = document.getElementById('total-price');

    function updateSummary() {
        // Clear current summary
        summaryList.innerHTML = '';
        let total = 0;

        // Base
        const base = form.querySelector('input[name="base"]:checked');
        if (base) {
            const price = parseFloat(base.dataset.price);
            total += price;
            addItemToSummary(base.value, price);
        }

        // Proteins
        const proteins = form.querySelectorAll('input[name="protein"]:checked');
        proteins.forEach(item => {
            const price = parseFloat(item.dataset.price);
            total += price;
            addItemToSummary(item.value, price);
        });

        // Toppings
        const toppings = form.querySelectorAll('input[name="topping"]:checked');
        toppings.forEach(item => {
            const price = parseFloat(item.dataset.price);
            total += price;
            addItemToSummary(item.value, price);
        });

        // Dressing
        const dressing = form.querySelector('select[name="dressing"]').value;
        if (dressing) {
            addItemToSummary(dressing + ' Dressing', 0);
        }

        // Update Total
        totalPriceEl.textContent = '$' + total.toFixed(2);

        // Add animation class to total
        totalPriceEl.style.transform = 'scale(1.1)';
        setTimeout(() => totalPriceEl.style.transform = 'scale(1)', 200);
    }

    function addItemToSummary(name, price) {
        const item = document.createElement('div');
        item.className = 'summary-item fade-in-up'; // reuse animation
        item.style.animationDuration = '0.3s';
        item.innerHTML = `
            <span>${name}</span>
            <span>${price > 0 ? '+$' + price.toFixed(2) : '-'}</span>
        `;
        summaryList.appendChild(item);
    }

    // Event Listeners for Form
    form.addEventListener('change', updateSummary);

    // Initial Run
    updateSummary();

    // --- Nutritional Info Tooltips (Mock) ---
    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-item');
            const title = card.querySelector('h3').innerText;
            alert(`Nutritional Highlight for ${title}:\n\nCalories: 400-500\nProtein: High\nFat: Healthy Sources (Avocado/Nuts)\n\nFull detailed breakdown would appear in a modal here.`);
        });
    });

    // --- Reservation System Logic ---
    const dateInput = document.getElementById('res-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    const bookBtn = document.getElementById('btn-book');
    const selectedSlotDisplay = document.getElementById('selected-slot-display');
    const slotConfirmation = document.getElementById('slot-confirmation');
    let selectedTimeSlot = null;

    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        dateInput.addEventListener('change', (e) => {
            const date = e.target.value;
            if (date) {
                generateTimeSlots(date);
            }
        });
    }

    function generateTimeSlots(dateSeed) {
        timeSlotsContainer.innerHTML = '';
        selectedTimeSlot = null;
        updateBookButton();
        selectedSlotDisplay.classList.add('hidden');

        // Mock generating slots from 11:00 to 20:30
        const startHour = 11;
        const endHour = 20;

        // Simple pseudo-random based on date string
        let seed = dateSeed.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const timeString = `${hour > 12 ? hour - 12 : hour}:${min === 0 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`;

                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = timeString;

                // Randomly mark as booked (approx 30% chance)
                seed = (seed * 9301 + 49297) % 233280;
                const isBooked = (seed % 100) < 30;

                if (isBooked) {
                    slot.classList.add('disabled');
                    slot.title = "Fully Booked";
                } else {
                    slot.addEventListener('click', () => selectSlot(slot, timeString));
                }

                timeSlotsContainer.appendChild(slot);
            }
        }
    }

    function selectSlot(slotEl, time) {
        // Remove active from others
        document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));

        // Add to current
        slotEl.classList.add('selected');
        selectedTimeSlot = time;

        // Update UI
        slotConfirmation.textContent = `${dateInput.value} at ${time}`;
        selectedSlotDisplay.classList.remove('hidden');
        updateBookButton();
    }

    function updateBookButton() {
        bookBtn.disabled = !selectedTimeSlot;
    }

    // Handle Form Submit
    const resForm = document.getElementById('reservation-form');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!selectedTimeSlot) return;

            const guests = document.getElementById('res-guests').value;
            const date = dateInput.value;

            alert(`Reservation Confirmed!\n\nDate: ${date}\nTime: ${selectedTimeSlot}\nGuests: ${guests}\n\nA confirmation has been sent to your email.`);

            // Reset
            resForm.reset();
            timeSlotsContainer.innerHTML = '<div class="empty-state-slots">Please select a date above</div>';
            selectedSlotDisplay.classList.add('hidden');
            bookBtn.disabled = true;
            selectedTimeSlot = null;
        });
    }

});
