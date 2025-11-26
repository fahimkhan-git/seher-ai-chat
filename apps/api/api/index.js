// Vercel serverless function entry point
import bootstrap from "../src/server.js";

let appInstance = null;

// Initialize app once
async function getApp() {
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
      throw error;
    }
  }
  return appInstance;
}

// Export handler for Vercel
export default async function handler(req, res) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (error) {
    console.error("Error in handler:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Server error: " + error.message,
        status: "error"
      });
    }
  }
}

