document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('dark-mode-toggle');
    const backToTopButton = document.getElementById('back-to-top');
    const form = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    // Smooth scroll back to top
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Show/hide back to top button
    window.addEventListener('scroll', function () {
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Dark mode toggle
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        toggle.checked = false;
    }

    toggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    });

    // Form submission handling
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.text())
        .then(data => {
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';
            confirmationMessage.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for reaching out!</h3>
                    <p>Your message has been successfully sent. I will get back to you soon.</p>
                </div>
            `;
        })
        .catch(error => {
            form.style.display = 'none';
            confirmationMessage.style.display = 'block';
            confirmationMessage.innerHTML = `
                <div class="error-message">
                    <h3>Oops! Something went wrong.</h3>
                    <p>There was an error sending your message. Please try again later.</p>
                </div>
            `;
        });
    });
});

