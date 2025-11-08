import crypto from "crypto";
import { config } from "../config.js";
import { Lead } from "../models/Lead.js";
import { toPlainObject } from "../utils/doc.js";
import { readJson, writeJson } from "./fileStore.js";

const FILE_NAME = "leads.json";
const DEFAULT_STORE = { leads: [] };
const useMongo = config.dataStore === "mongo";

async function loadStore() {
  return readJson(FILE_NAME, DEFAULT_STORE);
}

async function saveStore(store) {
  await writeJson(FILE_NAME, store);
}

export async function createLead({
  phone,
  bhk,
  bhkType,
  microsite,
  metadata = {},
  conversation = [],
}) {
  if (useMongo) {
    const leadDoc = await Lead.create({
      phone,
      bhk,
      bhkType,
      microsite,
      leadSource: "ChatWidget",
      status: "new",
      metadata,
      conversation,
    });

    return toPlainObject(leadDoc);
  }

  const now = new Date().toISOString();
  const lead = {
    id: crypto.randomUUID(),
    phone,
    bhk,
    bhkType,
    microsite,
    leadSource: "ChatWidget",
    status: "new",
    metadata,
    conversation,
    createdAt: now,
    updatedAt: now,
  };

  const store = await loadStore();
  store.leads = [lead, ...store.leads];
  await saveStore(store);
  return lead;
}

export async function listLeads({
  microsite,
  search,
  startDate,
  endDate,
  limit = 50,
  skip = 0,
} = {}) {
  if (useMongo) {
    const numericLimit = Math.max(Number(limit) || 0, 0);
    const numericSkip = Math.max(Number(skip) || 0, 0);
    const criteria = {};

    if (microsite) {
      criteria.microsite = microsite;
    }

    if (search) {
      const normalized = String(search).trim();
      if (normalized) {
        const regex = new RegExp(normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        criteria.$or = [
          { microsite: regex },
          { phone: regex },
          { "metadata.visitor.utm.source": regex },
          { "metadata.visitor.utm.campaign": regex },
        ];
      }
    }

    if (startDate || endDate) {
      const createdAtCriteria = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!Number.isNaN(start.getTime())) {
          createdAtCriteria.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime())) {
          createdAtCriteria.$lte = end;
        }
      }

      if (Object.keys(createdAtCriteria).length > 0) {
        criteria.createdAt = createdAtCriteria;
      }
    }

    const total = await Lead.countDocuments(criteria);
    const items = await Lead.find(criteria)
      .sort({ createdAt: -1 })
      .skip(numericSkip)
      .limit(numericLimit || 50)
      .lean();

    return {
      items: items.map((item) => {
        const normalized = { ...item, id: item._id.toString() };
        delete normalized._id;
        delete normalized.__v;
        return normalized;
      }),
      total,
    };
  }

  const store = await loadStore();
  let collection = store.leads;

  if (microsite) {
    collection = collection.filter((lead) => lead.microsite === microsite);
  }

  if (search) {
    const normalized = String(search).trim().toLowerCase();

    if (normalized) {
      collection = collection.filter((lead) => {
        const micrositeMatch = lead.microsite
          ?.toLowerCase()
          .includes(normalized);
        const phoneMatch = lead.phone
          ? String(lead.phone).toLowerCase().includes(normalized)
          : false;
        const utmSource = lead.metadata?.visitor?.utm?.source;
        const utmCampaign = lead.metadata?.visitor?.utm?.campaign;

        const sourceMatch = utmSource
          ?.toLowerCase()
          .includes(normalized);
        const campaignMatch = utmCampaign
          ?.toLowerCase()
          .includes(normalized);

        return micrositeMatch || phoneMatch || sourceMatch || campaignMatch;
      });
    }
  }

  if (startDate || endDate) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    collection = collection.filter((lead) => {
      if (!lead.createdAt) return false;
      const created = new Date(lead.createdAt);

      if (Number.isNaN(created.getTime())) {
        return false;
      }

      const afterStart = start ? created >= start : true;
      const beforeEnd = end ? created <= end : true;

      return afterStart && beforeEnd;
    });
  }

  const total = collection.length;
  const items = collection.slice(Number(skip), Number(skip) + Number(limit));

  return { items, total };
}


