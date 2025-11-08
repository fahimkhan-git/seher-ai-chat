import express from "express";
import { createLead, listLeads } from "../storage/leadStore.js";
import { recordEvent } from "../storage/eventStore.js";
import { createChatSession } from "../storage/chatSessionStore.js";

const router = express.Router();

const SPECIAL_BHK_MAPPINGS = new Map([
  ["duplex", { type: "Duplex", numeric: null }],
  ["justbrowsing", { type: "Just Browsing", numeric: null }],
  ["justlooking", { type: "Just Browsing", numeric: null }],
  ["other", { type: "Other", numeric: null }],
  ["yettodecide", { type: "Yet to decide", numeric: null }],
]);

function normalizeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeBhkPreference({ bhk, bhkType }) {
  if (bhk !== undefined && bhk !== null && bhk !== "") {
    const numericValue = Number(bhk);

    if (Number.isFinite(numericValue)) {
      if (numericValue === 0) {
        return { type: "Yet to decide", numeric: null };
      }

      const rounded = Math.round(numericValue);
      if (rounded >= 1 && rounded <= 4) {
        return { type: `${rounded} BHK`, numeric: rounded };
      }

      return { type: "Other", numeric: rounded };
    }
  }

  if (bhkType !== undefined && bhkType !== null && bhkType !== "") {
    const trimmed = String(bhkType).trim();
    if (!trimmed) {
      return null;
    }

    const compactKey = normalizeKey(trimmed);

    if (SPECIAL_BHK_MAPPINGS.has(compactKey)) {
      return SPECIAL_BHK_MAPPINGS.get(compactKey);
    }

    const digitsMatch = trimmed.match(/(\d+)/);
    if (digitsMatch) {
      const numeric = Number(digitsMatch[1]);
      if (Number.isFinite(numeric)) {
        if (numeric === 0) {
          return { type: "Yet to decide", numeric: null };
        }
        if (numeric >= 1 && numeric <= 4) {
          return { type: `${numeric} BHK`, numeric };
        }
        return { type: "Other", numeric };
      }
    }
  }

  return null;
}

router.post("/", async (req, res) => {
  try {
    const { phone, bhk, bhkType, microsite, metadata, conversation } = req.body;

    if (!microsite) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedBhk = normalizeBhkPreference({ bhk, bhkType });

    if (!normalizedBhk) {
      return res
        .status(400)
        .json({ message: "Invalid or missing BHK preference" });
    }

    const sanitizedPhone =
      typeof phone === "string" && phone.trim().length > 0
        ? phone.trim()
        : undefined;

    const lead = await createLead({
      phone: sanitizedPhone,
      bhk: normalizedBhk.numeric,
      bhkType: normalizedBhk.type,
      microsite,
      metadata,
      conversation,
    });

    try {
      await createChatSession({
        microsite,
        projectId: metadata?.projectId,
        leadId: lead.id,
        phone: sanitizedPhone,
        bhkType: normalizedBhk.type,
        conversation,
        metadata,
      });
    } catch (error) {
      console.error("Failed to store chat session", error);
    }

    req.io?.to(microsite).emit("lead:new", lead);

    await recordEvent({
      type: "lead_submitted",
      projectId: microsite,
      microsite,
      payload: {
        bhkType: normalizedBhk.type,
        ...(normalizedBhk.numeric !== null &&
          normalizedBhk.numeric !== undefined && { bhk: normalizedBhk.numeric }),
      },
    });

    res.status(201).json({ message: "Lead created", lead });
  } catch (error) {
    console.error("Failed to create lead", error);
    res.status(500).json({ message: "Failed to create lead" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { microsite, search, startDate, endDate, limit = 50, skip = 0 } =
      req.query;
    const { items, total } = await listLeads({
      microsite,
      search,
      startDate,
      endDate,
      limit,
      skip,
    });

    res.json({ items, total });
  } catch (error) {
    console.error("Failed to list leads", error);
    res.status(500).json({ message: "Failed to list leads" });
  }
});

export default router;


