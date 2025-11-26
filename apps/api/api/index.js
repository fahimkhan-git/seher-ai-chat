// Vercel serverless function entry point
import bootstrap from "../src/server.js";

let appInstance = null;

// Initialize app on first request (lazy initialization)
export default async function handler(req, res) {
  if (!appInstance) {
    try {
      console.log("🚀 Initializing API server for Vercel...");
      appInstance = await bootstrap();
      console.log("✅ API server initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize API server", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        error: "Server initialization failed: " + error.message,
        status: "error",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // Express app is a request handler - call it directly
  // Vercel passes (req, res) which Express expects
  if (!appInstance) {
    return res.status(500).json({
      error: "App instance not available",
      status: "error"
    });
  }
  
  // Call Express app handler
  appInstance(req, res);
}

