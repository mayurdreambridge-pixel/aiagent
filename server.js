// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch"); // make sure installed: npm i node-fetch

const app = express();
const PORT = process.env.PORT || 3000;

// === CONFIG ===
const agentId = "v2_agt_3CYryUYK";
const clientKey = "ZGhlZXJhai5kaGF3YW5AZHJlYW1icmlkZ2UuZ2xvYmFs:ncniYdhByfg8l-gMVuoGC"; // replace with your D-ID client key

// === MIDDLEWARE ===
// IMPORTANT: CORS must come BEFORE other middleware
app.use(cors()); // Allow all origins for development

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve index.html + script.js

// === PROXY ENDPOINT ===
app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(`https://api.d-id.com/agents/${agentId}`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${clientKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    // Forward the status code from D-ID
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
});

// === HEALTH CHECK ===
app.get("/health", (req, res) => {
  res.json({ status: "ok", agentId });
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Proxy endpoint: http://localhost:${PORT}/proxy`);
});