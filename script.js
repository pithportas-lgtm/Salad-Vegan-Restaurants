document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
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

});
