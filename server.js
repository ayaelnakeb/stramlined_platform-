// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  setInterval(() => {
    const mockData = {
      postureScore: Math.floor(Math.random() * 100),
      correctionCount: Math.floor(Math.random() * 10),
      goodPostureTime: `${Math.floor(Math.random() * 60)}m`,
      inferenceTime: Math.floor(Math.random() * 20),
      modelAccuracy: 90 + Math.floor(Math.random() * 10),
      dataPoints: Math.floor(Math.random() * 10000),
      memoryUsage: Math.floor(Math.random() * 100),
      accelX: (Math.random() * 2 - 1).toFixed(2),
      accelY: (Math.random() * 2 - 1).toFixed(2),
      accelZ: (Math.random() * 2 - 1).toFixed(2),
      tiltFront: Math.random() * 100,
      tiltBack: Math.random() * 100,
      tiltLeft: Math.random() * 100,
      tiltRight: Math.random() * 100,
      goodPostureConfidence: Math.random() * 100,
      badPostureConfidence: 100 - Math.random() * 100
    };
    ws.send(JSON.stringify(mockData));
  }, 1000);
});

console.log('WebSocket server started on ws://localhost:8080');
