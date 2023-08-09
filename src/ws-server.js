const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket connected');

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message)
        console.log('Received:', parsedMessage);

        // Broadcast the received message to all connected clients
        wss.clients.forEach( (client) => {
          if ( client.readyState === WebSocket.OPEN ) {
            client.send( JSON.stringify(parsedMessage) );
          }
        });

        // Send a response text message to the same client
        ws.send( JSON.stringify({ user: 'Server', message: 'Message received!' }) );

      } catch (error) {
        console.error('Error parsing message:', error)
      } 
    });

    ws.on('close', () => {
        console.log('WebSocket disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

server.listen(8080, () => {
    console.log('WebSocket server is listening on port 8080');
});
