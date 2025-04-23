# Posture Monitoring Dashboard

## Why This Project?
A real-time monitoring system designed to help improve posture awareness using wearable sensor data. It provides:
- Immediate feedback on sitting/standing posture quality
- Historical trends of posture habits
- System health monitoring for embedded posture devices

## How It Works
1. **Wearable Device** (ESP32) streams IMU sensor data via WebSocket
2. **AI Model** analyzes sensor data to calculate posture metrics
3. **Dashboard** visualizes in real-time:
   - Posture quality score (0-100%)
   - 3D orientation data (accelerometer XYZ values)
   - System performance metrics (inference time, memory usage)

