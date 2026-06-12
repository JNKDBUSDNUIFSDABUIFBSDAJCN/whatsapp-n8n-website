# WhatsApp n8n Message Desk

A static HTML, CSS, and JavaScript website for testing a WhatsApp reply flow with n8n.

## How to use

1. Open `index.html` in your browser.
2. Paste your n8n reply webhook URL in **n8n reply webhook URL**.
3. Click **Save** or **Test**.
4. Add a test incoming WhatsApp message.
5. Type a reply and click **Send reply**.

The website sends this JSON payload to n8n:

```json
{
  "to": "+91 98765 43210",
  "name": "Ravi Kumar",
  "reply": "Thanks for contacting us.",
  "latestIncomingMessage": "Hi, I want to know your pricing.",
  "source": "whatsapp-n8n-message-desk",
  "timestamp": "2026-05-15T10:00:00.000Z"
}
```

## Optional inbox polling

Plain HTML/JS cannot receive a WhatsApp webhook directly from n8n because it has no backend server. If you want the page to load incoming messages from n8n, create an n8n endpoint that returns JSON like either of these:

```json
[
  {
    "name": "Ravi Kumar",
    "phone": "+91 98765 43210",
    "message": "Hi, what is the price?"
  }
]
```

or:

```json
{
  "messages": [
    {
      "senderName": "Ravi Kumar",
      "from": "+91 98765 43210",
      "text": "Hi, what is the price?"
    }
  ]
}
```

Then paste that URL into **Optional inbox polling URL** and click **Poll inbox**.
