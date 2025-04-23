// Initialize WebSocket connection
let ws = new WebSocket('ws://localhost:8080');

// Chart instances
let postureHistoryChart;
let imuDataChart;
let tiltChart;
let confidenceChart;

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupWebSocket();
});

function initializeCharts() {
    // Posture History Chart
    const postureCtx = document.getElementById('postureHistoryChart').getContext('2d');
    postureHistoryChart = new Chart(postureCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Posture Score',
                data: [],
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }
    });

    // IMU Data Chart
    const imuCtx = document.getElementById('imuDataChart').getContext('2d');
    imuDataChart = new Chart(imuCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Accel X',
                    data: [],
                    borderColor: '#e74c3c',
                    tension: 0.4
                },
                {
                    label: 'Accel Y',
                    data: [],
                    borderColor: '#2ecc71',
                    tension: 0.4
                },
                {
                    label: 'Accel Z',
                    data: [],
                    borderColor: '#3498db',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Tilt Analysis Chart
    const tiltCtx = document.getElementById('tiltChart').getContext('2d');
    tiltChart = new Chart(tiltCtx, {
        type: 'radar',
        data: {
            labels: ['Front', 'Back', 'Left', 'Right'],
            datasets: [{
                label: 'Tilt Distribution',
                data: [0, 0, 0, 0],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                pointBackgroundColor: '#3498db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // Model Confidence Chart
    const confidenceCtx = document.getElementById('confidenceChart').getContext('2d');
    confidenceChart = new Chart(confidenceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Good Posture', 'Needs Correction'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function setupWebSocket() {
    ws.onopen = function() {
        console.log('Connected to WebSocket server');
        document.querySelector('.device-status').classList.add('connected');
        document.querySelector('.device-status').classList.remove('disconnected');
    };

    ws.onclose = function() {
        console.log('Disconnected from WebSocket server');
        document.querySelector('.device-status').classList.remove('connected');
        document.querySelector('.device-status').classList.add('disconnected');
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        updateDashboard(data);
    };
}

function updateDashboard(data) {
    // Update raw data display
    document.getElementById('rawData').textContent = JSON.stringify(data, null, 2);

    // Update metrics
    document.getElementById('postureScore').textContent = `${data.postureScore}%`;
    document.getElementById('correctionCount').textContent = data.correctionCount;
    document.getElementById('goodPostureTime').textContent = data.goodPostureTime;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();

    // Update system metrics
    document.getElementById('inferenceTime').textContent = `${data.inferenceTime}ms`;
    document.getElementById('modelAccuracy').textContent = `${data.modelAccuracy}%`;
    document.getElementById('dataPoints').textContent = data.dataPoints.toLocaleString();
    document.getElementById('memoryUsage').textContent = `${data.memoryUsage}%`;

    // Update charts
    updatePostureHistory(data);
    updateIMUData(data);
    updateTiltAnalysis(data);
    updateConfidenceChart(data);
}

function updatePostureHistory(data) {
    const time = new Date().toLocaleTimeString();
    postureHistoryChart.data.labels.push(time);
    postureHistoryChart.data.datasets[0].data.push(data.postureScore);

    // Keep only last 20 data points
    if (postureHistoryChart.data.labels.length > 20) {
        postureHistoryChart.data.labels.shift();
        postureHistoryChart.data.datasets[0].data.shift();
    }

    postureHistoryChart.update();
}

function updateIMUData(data) {
    const time = new Date().toLocaleTimeString();
    imuDataChart.data.labels.push(time);

    // Update accelerometer data
    imuDataChart.data.datasets[0].data.push(data.accelX);
    imuDataChart.data.datasets[1].data.push(data.accelY);
    imuDataChart.data.datasets[2].data.push(data.accelZ);

    // Keep only last 20 data points
    if (imuDataChart.data.labels.length > 20) {
        imuDataChart.data.labels.shift();
        imuDataChart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    imuDataChart.update();
}

function updateTiltAnalysis(data) {
    tiltChart.data.datasets[0].data = [
        data.tiltFront,
        data.tiltBack,
        data.tiltLeft,
        data.tiltRight
    ];
    tiltChart.update();
}

function updateConfidenceChart(data) {
    confidenceChart.data.datasets[0].data = [
        data.goodPostureConfidence,
        data.badPostureConfidence
    ];
    confidenceChart.update();
}

// Simulate data for testing (remove in production)
function simulateData() {
    const mockData = {
        postureScore: Math.floor(Math.random() * 100),
        correctionCount: Math.floor(Math.random() * 10),
        goodPostureTime: `${Math.floor(Math.random() * 60)}m`,
        inferenceTime: Math.floor(Math.random() * 20),
        modelAccuracy: 90 + Math.floor(Math.random() * 10),
        dataPoints: Math.floor(Math.random() * 10000),
        memoryUsage: Math.floor(Math.random() * 100),
        accelX: Math.random() * 2 - 1,
        accelY: Math.random() * 2 - 1,
        accelZ: Math.random() * 2 - 1,
        tiltFront: Math.random() * 100,
        tiltBack: Math.random() * 100,
        tiltLeft: Math.random() * 100,
        tiltRight: Math.random() * 100,
        goodPostureConfidence: Math.random() * 100,
        badPostureConfidence: 100 - Math.random() * 100
    };

    updateDashboard(mockData);
}

// Uncomment for testing without WebSocket
// setInterval(simulateData, 1000); 