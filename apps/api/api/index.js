// Vercel serverless function entry point
import bootstrap from "../src/server.js";

let appInstance = null;

// Initialize app on first request (lazy initialization)
export default async function handler(req, res) {
  if (!appInstance) {
    try {
      appInstance = await bootstrap();
    } catch (error) {
      console.error("Failed to initialize API server", error);
      return res.status(500).json({
        error: "Server initialization failed: " + error.message,
        status: "error"
      });
    }
  }
  
  return appInstance(req, res);
}

