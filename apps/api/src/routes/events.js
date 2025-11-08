import express from "express";
import { getEventSummary, recordEvent } from "../storage/eventStore.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, projectId, microsite, payload } = req.body;

    if (!type || !projectId) {
      return res.status(400).json({ message: "type and projectId required" });
    }

    const event = await recordEvent({ type, projectId, microsite, payload });
    res.status(201).json({ message: "Event recorded", event });
  } catch (error) {
    console.error("Failed to record event", error);
    res.status(500).json({ message: "Failed to record event" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const summary = await getEventSummary();

    res.json(summary);
  } catch (error) {
    console.error("Failed to fetch events summary", error);
    res.status(500).json({ message: "Failed to fetch events summary" });
  }
});

export default router;


