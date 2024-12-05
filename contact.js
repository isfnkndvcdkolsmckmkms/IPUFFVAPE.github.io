document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-section form');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form from submitting to server

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert('Thank you for your message!');
        form.reset(); // Clear form fields after showing message
    });

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
});
