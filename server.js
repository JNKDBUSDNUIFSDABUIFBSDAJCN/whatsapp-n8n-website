const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Store received messages in memory
let messages = [];

app.use(express.json());
app.use(cors());

// Serve the static frontend files
app.use(express.static(path.join(__dirname)));

// POST API endpoint to receive messages (handles both / and /api/messages)
app.post(['/', '/api/messages'], (req, res) => {
    const { sender, message, timestamp } = req.body;
    
    const newMessage = {
        id: Date.now(),
        sender: sender || 'Unknown',
        message: message || 'No message content',
        timestamp: timestamp || new Date().toISOString()
    };
    
    messages.push(newMessage);
    console.log('Received:', newMessage);
    
    res.status(200).json({ success: true, message: 'Message received successfully' });
});

// GET API endpoint to fetch messages
app.get('/api/messages', (req, res) => {
    res.json(messages);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Backend server running!`);
    console.log(`- Frontend: http://localhost:${PORT}`);
    console.log(`- API Endpoint: POST http://localhost:${PORT}/api/messages`);
});
