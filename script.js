const messagesBox = document.getElementById('messages-box');

let lastMessagesJson = '';

async function fetchMessages() {
    try {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        const currentMessagesJson = JSON.stringify(messages);

        if (currentMessagesJson === lastMessagesJson) {
            return; // Prevent flickering when polling
        }
        lastMessagesJson = currentMessagesJson;

        if (messages.length === 0) {
            messagesBox.innerHTML = `
        <div class="empty">
          <div class="spinner"></div>
          Waiting for messages...
        </div>`;
            return;
        }

        // Reverse to show newest messages at the top
        messagesBox.innerHTML = messages.slice().reverse().map((msg, idx) => `
      <div class="message" style="animation-delay: ${idx * 0.05}s">
        <div class="message-header">
          <span class="message-sender">${msg.sender}</span>
          <span>${new Date(msg.timestamp).toLocaleTimeString()}</span>
        </div>
        <p class="message-body">${msg.message}</p>
      </div>
    `).join('');

    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
}

// Poll the backend every 2 seconds for new messages
setInterval(fetchMessages, 2000);
fetchMessages();

// --- Reply functionality ---
// REPLACE THIS STRING WITH YOUR ACTUAL n8n WEBHOOK URL
const N8N_WEBHOOK_URL = 'https://dineshd098743.app.n8n.cloud/webhook-test/5e81845c-984b-4640-ac9d-5b56fa90b20a';

const replyToInput = document.getElementById('reply-to');
const replyMessageInput = document.getElementById('reply-message');
const sendBtn = document.getElementById('send-btn');
const statusText = document.getElementById('reply-status');

sendBtn.addEventListener('click', async() => {
    const url = N8N_WEBHOOK_URL;
    let to = replyToInput.value.trim();
    const message = replyMessageInput.value.trim();

    // Clean phone number for WhatsApp API (remove + and spaces)
    to = to.replace(/[^0-9]/g, '');

    if (!url || url.includes('your-n8n.com')) {
        showStatus('Please configure your actual n8n Webhook URL in script.js (line 33).', 'error');
        return;
    }
    if (!to) {
        showStatus('Please provide a recipient phone number.', 'error');
        return;
    }
    if (!message) {
        showStatus('Please type a message to send.', 'error');
        return;
    }

    sendBtn.disabled = true;
    if (sendBtn.querySelector('.btn-text')) {
        sendBtn.querySelector('.btn-text').textContent = 'Sending...';
    } else {
        sendBtn.textContent = 'Sending...';
    }
    showStatus('');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: to,
                message: message
            })
        });

        if (response.ok) {
            showStatus('Message sent successfully to n8n!', 'success');
            replyMessageInput.value = ''; // Clear message box on success
        } else {
            showStatus(`Failed to send. n8n responded with ${response.status}`, 'error');
        }
    } catch (error) {
        showStatus(`Network error: ${error.message}`, 'error');
    } finally {
        sendBtn.disabled = false;
        if (sendBtn.querySelector('.btn-text')) {
            sendBtn.querySelector('.btn-text').textContent = 'Send Message';
        } else {
            sendBtn.textContent = 'Send Message';
        }
    }
});

function showStatus(text, type) {
    statusText.textContent = text;
    statusText.className = 'status ' + (type || '');
}
