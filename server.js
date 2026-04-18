const WebSocket = require("ws");
const express = require("express");
const app = express();

const PORT = 3000;

// 🔥 TU TRZYMAMY WYŁADOWANIA
let strikes = [];

// 🌐 POŁĄCZENIE Z BLITZORTUNG
const servers = [
    "wss://ws1.blitzortung.org",
    "wss://ws2.blitzortung.org"
];

let ws = new WebSocket(servers[0]);

ws.onopen = () => {
    console.log("Połączono z Blitzortung");

    ws.send(JSON.stringify({
        west: -15,
        east: 35,
        north: 70,
        south: 35
    }));
};

ws.onmessage = (msg) => {
    try {
        let d = JSON.parse(msg.data);

        if (d.lat && d.lon) {
            strikes.push({
                lat: d.lat,
                lon: d.lon,
                time: Date.now()
            });
        }
    } catch (e) {}
};

// 🧹 USUWANIE STARYCH (>30 min)
setInterval(() => {
    let now = Date.now();
    strikes = strikes.filter(s => now - s.time < 1800000);
}, 10000);

// 📡 API
app.get("/lightnings", (req, res) => {
    res.json(strikes);
});

app.listen(PORT, () => {
    console.log("Serwer działa na http://localhost:" + PORT);
});
