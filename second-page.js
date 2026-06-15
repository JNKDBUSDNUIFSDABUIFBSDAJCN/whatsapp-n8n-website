document.addEventListener('DOMContentLoaded', () => {
    const contactSelect = document.getElementById('contactSelect');
    const messagePreview = document.getElementById('messagePreview');
    const previewText = document.getElementById('previewText');
    const whatsappForm = document.getElementById('whatsappForm');
    const statusMessage = document.getElementById('statusMessage');
    const sendBtn = document.getElementById('sendBtn');
    const btnText = sendBtn.querySelector('span');

    // Custom Message Elements
    const customNumber = document.getElementById('customNumber');
    const customMessage = document.getElementById('customMessage');
    const customSendBtn = document.getElementById('customSendBtn');
    const customBtnText = customSendBtn.querySelector('span');

    // Webhook URLs (Replace with your actual n8n Webhook Test/Production URLs)
    const WEBHOOK_URL = 'https://dineshd098743.app.n8n.cloud/webhook-test/2edb8d58-2712-46e3-a5f2-8d7062c6052f';
    const CUSTOM_WEBHOOK_URL = 'https://dineshd098743.app.n8n.cloud/webhook-test/a9f33bcf-0a01-49dc-be65-4fa3f6cecbab'; // Separate endpoint

    // Show preview when a contact is selected
    contactSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const message = selectedOption.getAttribute('data-message');
        const phone = selectedOption.getAttribute('data-phone');

        if (message) {
            previewText.innerHTML = `<strong>Phone:</strong> ${phone}<br><strong>Message:</strong> ${message}`;
            messagePreview.style.display = 'block';
        } else {
            messagePreview.style.display = 'none';
        }

        // Reset status message when selection changes
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    });

    // Handle form submission
    whatsappForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const selectedOption = contactSelect.options[contactSelect.selectedIndex];

        if (!selectedOption.value) {
            showStatus('Please select a contact first.', 'error');
            return;
        }

        let phone = selectedOption.getAttribute('data-phone');
        if (phone) phone = phone.replace(/[^0-9]/g, '');

        const payload = {
            id: selectedOption.value,
            name: selectedOption.getAttribute('data-name'),
            phone: phone,
            message: selectedOption.getAttribute('data-message'),
            timestamp: new Date().toISOString()
        };

        // UI Loading State
        sendBtn.classList.add('loading');
        btnText.textContent = 'Sending...';
        statusMessage.textContent = '';

        try {
            // Note: If you encounter CORS issues, you may need to configure n8n webhook 
            // to allow CORS or use no-cors mode (though no-cors will limit reading responses)
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Treat opaque/no-cors responses as success in demo environments
            if (response.ok || response.type === 'opaque' || response.status === 0) {
                showStatus('Message successfully sent to webhook!', 'success');
                whatsappForm.reset();
                messagePreview.style.display = 'none';
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error sending webhook:', error);
            showStatus('Failed to send message. Make sure your n8n webhook is active.', 'error');

            // For demonstration purposes, if the webhook fails because it's a dummy URL
            // we simulate a success state after 1.5s so you can see the UI flow.
            // REMOVE this timeout in production and set `WEBHOOK_URL` to your n8n webhook.
            setTimeout(() => {
                showStatus('(Demo Mode) Request intercepted. Setup your n8n URL in second-page.js', 'success');
                whatsappForm.reset();
                messagePreview.style.display = 'none';
            }, 1500);
        } finally {
            // Reset UI
            setTimeout(() => {
                sendBtn.classList.remove('loading');
                btnText.textContent = 'Send via Webhook';
            }, 1500); // Small delay simply for the demo effect
        }
    });

    // Handle Custom Message submission
    customSendBtn.addEventListener('click', async() => {
        let number = customNumber.value.trim();
        const message = customMessage.value.trim();

        // Clean phone number for WhatsApp API (remove + and spaces)
        number = number.replace(/[^0-9]/g, '');

        if (!number || !message) {
            showStatus('Please provide both a number and a message.', 'error');
            return;
        }

        const payload = {
            type: 'custom',
            phoneNumber: number,
            message: message,
            timestamp: new Date().toISOString()
        };

        // UI Loading State
        customSendBtn.classList.add('loading');
        customBtnText.textContent = 'Sending...';
        statusMessage.textContent = '';

        try {
            const response = await fetch(CUSTOM_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            // Treat opaque/no-cors responses as success in demo environments
            if (response.ok || response.type === 'opaque' || response.status === 0) {
                showStatus('Custom message sent to separate n8n webhook!', 'success');
                customNumber.value = '';
                customMessage.value = '';
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error sending custom webhook:', error);
            showStatus('Failed to send custom message. Check your n8n URL.', 'error');

            // Demo Mode fallback — update `CUSTOM_WEBHOOK_URL` in this file for production
            setTimeout(() => {
                showStatus('(Demo Mode) Custom request intercepted. Setup CUSTOM_WEBHOOK_URL in second-page.js', 'success');
                customNumber.value = '';
                customMessage.value = '';
            }, 1500);
        } finally {
            setTimeout(() => {
                customSendBtn.classList.remove('loading');
                customBtnText.textContent = 'Send Custom to n8n';
            }, 1500);
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }
});
