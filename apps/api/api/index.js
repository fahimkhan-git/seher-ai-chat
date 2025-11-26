// Vercel serverless function entry point
import bootstrap from "../src/server.js";

let appInstance = null;

// Initialize app on first request (lazy initialization)
export default async function handler(req, res) {
  // Initialize app if not already done
  if (!appInstance) {
    try {
      console.log("🚀 Initializing API server for Vercel...");
      appInstance = await bootstrap();
      if (!appInstance) {
        throw new Error("Bootstrap returned null/undefined");
      }
      console.log("✅ API server initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize API server", error);
      console.error("Error stack:", error.stack);
      if (!res.headersSent) {
        return res.status(500).json({
          error: "Server initialization failed: " + error.message,
          status: "error",
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
      return;
    }
  }
  
  // Ensure app instance exists
  if (!appInstance) {
    if (!res.headersSent) {
      return res.status(500).json({
        error: "App instance not available",
        status: "error"
      });
    }
    return;
  }
  
  // Call Express app - it's a request handler
  // Express will handle the request and send the response
  try {
    appInstance(req, res);
  } catch (error) {
    console.error("Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Request handling failed",
        status: "error"
      });
    }
  }
}

