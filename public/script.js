 import * as sdk from "https://cdn.jsdelivr.net/npm/@d-id/client-sdk@latest/dist/index.js";

 const PROXY_URL = "/proxy";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("startBtn");
  const output = document.getElementById("output");

  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.playsInline = true;
  document.getElementById("did").appendChild(videoElement);

  const agentId = "v2_agt_3CYryUYK";
  const clientKey = "ZGhlZXJhai5kaGF3YW5AZHJlYW1icmlkZ2UuZ2xvYmFs:ncniYdhByfg8l-gMVuoGC";
  const encodedKey = btoa(clientKey + ":"); // Important! Add colon for Basic Auth

  const auth = { type: "key", clientKey };

  const callbacks = {
    onSrcObjectReady: (stream) => (videoElement.srcObject = stream),
    onConnectionStateChange: (state) => {
      console.log("🌐 Connection:", state);
      if (state === "connected") output.textContent = "Agent connected ✅";
    },
    onNewMessage: (msgs) => {
      const assistant = msgs.find((m) => m.role === "assistant");
      if (assistant) output.textContent = assistant.content;
    },
    onError: (err) => {
      console.error("❌", err);
      output.textContent = "Error: " + err;
    },
  };

  const streamOptions = { compatibilityMode: "auto", streamWarmup: true };

  button.addEventListener("click", async () => {

    console.log("Called")
    try {
      output.textContent = "Connecting to agent...";

      // ✅ Initialize D-ID Agent Manager
      const agentManager = await sdk.createAgentManager(agentId, { baseUrl: PROXY_URL,
        auth,
        callbacks,
        streamOptions,
      });

      // console.log("AgentManager created ✅", agentManager);
      // output.textContent = "Connected to agent ✅";

      // Optionally send a chat
      // await agentManager.chat("Hello!");

    } catch (err) {
      console.error("❌ Fetch error:", err);
      output.textContent = "Error: " + err.message;
    }
  });
});

