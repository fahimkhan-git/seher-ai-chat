import express from "express";
import {
  getWidgetConfig,
  upsertWidgetConfig,
} from "../storage/widgetConfigStore.js";

const router = express.Router();

router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const config = await getWidgetConfig(projectId);

    res.json(config);
  } catch (error) {
    console.error("Failed to fetch widget config", error);
    res.status(500).json({ message: "Failed to fetch widget config" });
  }
});

router.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const update = req.body;

    const config = await upsertWidgetConfig(projectId, update);

    res.json(config);
  } catch (error) {
    console.error("Failed to update widget config", error);
    res.status(500).json({ message: "Failed to update widget config" });
  }
});

export default router;


