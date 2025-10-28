import * as sdk from "https://cdn.jsdelivr.net/npm/@d-id/client-sdk@latest/dist/index.js";

const PROXY_URL = "/proxy"; // You can remove this - not needed for Agents SDK

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("startBtn");
  const output = document.getElementById("output");

  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.playsInline = true;
  document.getElementById("did").appendChild(videoElement);

  const agentId = "v2_agt_3CYryUYK";
  
  // ✅ DECLARE AUTH ONLY ONCE
  // Replace this with your ACTUAL client key from D-ID Studio
  const auth = {
    type: 'key',
    clientKey: 'YXV0aDB8NjhmZjNmMDEyODZjNmUzNjgzMTdlZDg0OnFFVjNoSkk0NUt1SEJ2VVlFX1lWdg=='  
    // ☝️ This is the same key from your HTML embed - use that one!
  };

  // ❌ REMOVED: encodedKey (not needed for SDK)
  // ❌ REMOVED: duplicate auth declaration

  const callbacks = {
    onError(error, errorData) {
      console.error("Agent Error:", error, errorData);
      output.textContent = "Error: " + error;
    },
    onSrcObjectReady(srcObject) {
      videoElement.srcObject = srcObject;  // Use the videoElement we created above
    },
    onConnectionStateChange(state) {
      console.log("🌐 Connection state:", state);
      if (state === "connected") {
        output.textContent = "Agent connected ✅";
      }
    },
    onNewMessage(msgs) {
      const assistant = msgs.find((m) => m.role === "assistant");
      if (assistant) {
        output.textContent = assistant.content;
      }
    }
  };

  const streamOptions = { 
    compatibilityMode: "auto", 
    streamWarmup: true 
  };

  button.addEventListener("click", async () => {
    console.log("Button clicked - connecting to agent...");
    
    try {
      output.textContent = "Connecting to agent...";

      // ✅ Initialize D-ID Agent Manager
      const agentManager = await sdk.createAgentManager(agentId, {
        auth,
        callbacks,
        streamOptions
      });

      console.log("AgentManager created ✅");

      // Connect to the agent
      await agentManager.connect();
      console.log("Connected ✅");
      
      // Send initial message
      await agentManager.chat('Hello!');
      console.log("Message sent ✅");

    } catch (err) {
      console.error("❌ Error:", err);
      output.textContent = "Error: " + err.message;
    }
  });
});