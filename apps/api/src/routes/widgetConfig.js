import express from "express";
import {
  getWidgetConfig,
  upsertWidgetConfig,
} from "../storage/widgetConfigStore.js";
import { requireApiKey } from "../middleware/auth.js";

const router = express.Router();

// GET is public - widget needs to read config
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const config = await getWidgetConfig(projectId);

    // Return empty config if not found (widget will use defaults)
    res.json(config || {});
  } catch (error) {
    console.error("Failed to fetch widget config", error);
    // Return empty config instead of error - widget will use defaults
    res.status(200).json({});
  }
});

// POST requires API key authentication - protects config updates
router.post("/:projectId", requireApiKey, async (req, res) => {
  try {
    const { projectId } = req.params;
    const update = req.body;

    const config = await upsertWidgetConfig(projectId, update);

    res.json(config);
  } catch (error) {
    console.error("Failed to update widget config", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      dataStore: process.env.DATA_STORE,
      hasMongoUri: !!process.env.MONGO_URI
    });
    
    // Return more detailed error for debugging
    const errorResponse = {
      message: "Widget config update failed",
      error: error.message,
      details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development' ? {
        name: error.name,
        dataStore: process.env.DATA_STORE,
        hasMongoUri: !!process.env.MONGO_URI,
        mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0
      } : undefined
    };
    
    // Return 200 instead of 500 - widget config update is non-critical
    // Widget will still work with detected property info
    res.status(200).json(errorResponse);
  }
});

export default router;


