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

    // On Vercel (read-only filesystem), we can't write files
    // Return instructions to update via git instead
    if (process.env.VERCEL) {
      return res.status(200).json({
        message: "Config update received. On Vercel, config is read-only from git.",
        instruction: "Update apps/api/data/widget-config.json locally, commit, and push to deploy.",
        receivedUpdate: update,
        projectId
      });
    }

    // Local development: update file directly
    const config = await upsertWidgetConfig(projectId, update);
    res.json(config);
  } catch (error) {
    console.error("Failed to update widget config", error);
    
    // Return error details
    const errorResponse = {
      message: "Widget config update failed",
      error: error.message,
    };
    
    res.status(200).json(errorResponse);
  }
});

export default router;


