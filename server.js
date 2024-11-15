const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Queue to store commands for the ESP8266
let commandQueue = [];

// Endpoint to receive new commands from the user
app.post('/control', (req, res) => {
  const { command } = req.body;

  if (command) {
    commandQueue.push(command); // Add command to the queue
    res.json({ message: `Command '${command}' added to queue!` });
  } else {
    res.status(400).json({ message: 'No command provided' });
  }
});

// Endpoint for the ESP8266 to fetch the latest command
app.get('/commands', (req, res) => {
  if (commandQueue.length > 0) {
    const nextCommand = commandQueue.shift(); // Remove and return the oldest command
    res.json({ command: nextCommand });
  } else {
    res.json({ command: null }); // No commands in queue
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
