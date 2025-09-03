document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        preloader.style.display = 'none';
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let valid = true;

            inputs.forEach(input => {
                if (!input.value) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ccc';
                }

                // Email validation
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        valid = false;
                        input.style.borderColor = 'red';
                        input.nextElementSibling?.remove();
                        input.insertAdjacentHTML('afterend', '<span style="color: red;">Invalid email format</span>');
                    }
                }

                // Password strength (minimum 8 characters)
                if (input.type === 'password') {
                    if (input.value.length < 8) {
                        valid = false;
                        input.style.borderColor = 'red';
                        input.nextElementSibling?.remove();
                        input.insertAdjacentHTML('afterend', '<span style="color: red;">Password must be at least 8 characters</span>');
                    }
                }
            });

            // Booking date validation (no past dates)
            const dateInput = form.querySelector('input[type="date"]');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                if (dateInput.value < today) {
                    valid = false;
                    dateInput.style.borderColor = 'red';
                    dateInput.nextElementSibling?.remove();
                    dateInput.insertAdjacentHTML('afterend', '<span style="color: red;">Cannot book past dates</span>');
                }
            }

            if (!valid) {
                e.preventDefault();
                alert('Please correct the errors in the form.');
            }
        });

        // Real-time validation
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    input.style.borderColor = 'green';
                    input.nextElementSibling?.remove();
                } else {
                    input.style.borderColor = 'red';
                }
            });
        });
    });

    // Smooth scrolling
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Sticky navigation
    const nav = document.querySelector('nav');
    const stickyOffset = nav.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset >= stickyOffset) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });

    // Scroll animations
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Gallery interaction
    const mediaItems = document.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        item.addEventListener('click', () => {
            const overlayText = item.querySelector('.overlay').textContent;
            console.log(`Clicked on: ${overlayText}`);
        });
    });
});