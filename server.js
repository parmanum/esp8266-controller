const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Initialize app instance

// Enable CORS
app.use(cors());

// Enable JSON parsing for incoming requests
app.use(bodyParser.json());

// Queue to store commands for the ESP8266
let commandQueue = [];

// Endpoint to receive new commands from the user
app.post('/control', (req, res) => {
  const { command } = req.body;

  if (command) {
    commandQueue.push(command); // Add command to the queue
    console.log(`Command '${command}' received and added to queue.`);
    res.json({ message: `Command '${command}' added to queue!` });
  } else {
    console.error('No command provided in the request body.');
    res.status(400).json({ message: 'No command provided' });
  }
});

// Endpoint for the ESP8266 to fetch the latest command
app.get('/commands', (req, res) => {
  console.log('Received GET request for /commands');

  if (commandQueue.length > 0) {
    const nextCommand = commandQueue.shift(); // Remove and return the oldest command
    console.log(`Sending command to ESP8266: ${nextCommand}`);
    res.json({ command: nextCommand });
  } else {
    console.log('No commands in queue, sending null.');
    res.status(200).json({ command: null }); // No commands in queue
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
