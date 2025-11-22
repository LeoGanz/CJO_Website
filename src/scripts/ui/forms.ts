export function initForms() {
    // =========================================
    // Contact Form Handling
    // =========================================

    const contactForm = document.getElementById('contact-form') as HTMLFormElement;
    const formMessage = document.getElementById('form-message') as HTMLElement;

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            };

            // Since this is a static site, we'll show a success message
            // In production, you would send this to a backend API or service like Formspree, Netlify Forms, etc.

            try {
                // Simulate form submission
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Show success message
                formMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir melden uns so bald wie möglich bei Ihnen.';
                formMessage.className = 'form-message success';

                // Reset form
                contactForm.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);

                // Log data for development (remove in production)
                console.log('Form submission:', data);
            } catch (error) {
                // Show error message
                formMessage.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
                formMessage.className = 'form-message error';

                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            }
        });
    }
}
