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
  const auth = {
    type: 'key',
    clientKey: 'YXV0aDB8NjhmZjNmMDEyODZjNmUzNjgzMTdlZDg0OnFFVjNoSkk0NUt1SEJ2VVlFX1lWdg=='  // Not your API key!
  };
  const encodedKey = btoa(clientKey + ":"); // Important! Add colon for Basic Auth

  const auth = { type: "key", clientKey };

  const callbacks = {
    onError(error, errorData) {
      console.error("Agent Error:", error, errorData);
    },
    onSrcObjectReady(srcObject) {
      const videoElement = document.getElementById('agent-video');
      videoElement.srcObject = srcObject;
    }
  };

  const streamOptions = { compatibilityMode: "auto", streamWarmup: true };

  button.addEventListener("click", async () => {

    console.log("Called")
    try {
      output.textContent = "Connecting to agent...";

      // ✅ Initialize D-ID Agent Manager
      const agentManager = await sdk.createAgentManager(agentId, {
        auth,
        callbacks,
        streamOptions: {
          compatibilityMode: 'auto',
          streamWarmup: true
        }
      });
      // console.log("AgentManager created ✅", agentManager);
      // output.textContent = "Connected to agent ✅";

      // Optionally send a chat
      // await agentManager.chat("Hello!");

      await agentManager.connect();
      await agentManager.chat('Hello!');

    } catch (err) {
      console.error("❌ Fetch error:", err);
      output.textContent = "Error: " + err.message;
    }
  });
});

