import express from "express";
import { listChatSessions } from "../storage/chatSessionStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { microsite, leadId, limit, skip } = req.query;
    const { items, total } = await listChatSessions({
      microsite,
      leadId,
      limit,
      skip,
    });

    res.json({ items, total });
  } catch (error) {
    console.error("Failed to list chat sessions", error);
    res.status(500).json({ message: "Failed to list chat sessions" });
  }
});

export default router;


