import express from "express";
import { getEventSummary, recordEvent } from "../storage/eventStore.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Handle both JSON body and FormData (from sendBeacon blob)
    let bodyData = req.body;
    
    // If body is a string (from sendBeacon blob), parse it
    if (typeof bodyData === 'string' || Buffer.isBuffer(bodyData)) {
      try {
        bodyData = JSON.parse(bodyData.toString());
      } catch (parseError) {
        console.warn("Events API: Failed to parse body as JSON", parseError);
        return res.status(400).json({ message: "Invalid request body" });
      }
    }
    
    // Handle empty body or FormData
    if (!bodyData || Object.keys(bodyData).length === 0) {
      // Try to read from raw body if available
      if (req.body && typeof req.body === 'string') {
        try {
          bodyData = JSON.parse(req.body);
        } catch (e) {
          return res.status(400).json({ message: "Invalid request body" });
        }
      } else {
        return res.status(400).json({ message: "Request body is required" });
      }
    }

    const { type, projectId, microsite, payload } = bodyData;

    if (!type || !projectId) {
      return res.status(400).json({ message: "type and projectId required" });
    }

    const event = await recordEvent({ type, projectId, microsite, payload });
    res.status(201).json({ message: "Event recorded", event });
  } catch (error) {
    console.error("Failed to record event", error);
    // Return 200 instead of 500 to prevent widget errors - events are not critical
    res.status(200).json({ message: "Event recording failed (non-critical)", error: process.env.NODE_ENV === 'development' ? error.message : undefined });
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


