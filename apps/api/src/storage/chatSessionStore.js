import crypto from "crypto";
import { config } from "../config.js";
import { ChatSession } from "../models/ChatSession.js";
import { toPlainObject } from "../utils/doc.js";
import { readJson, writeJson } from "./fileStore.js";

const FILE_NAME = "chat-sessions.json";
const DEFAULT_STORE = { sessions: [] };
const useMongo = config.dataStore === "mongo";

async function loadStore() {
  return readJson(FILE_NAME, DEFAULT_STORE);
}

async function saveStore(store) {
  await writeJson(FILE_NAME, store);
}

export async function createChatSession({
  microsite,
  projectId,
  leadId,
  phone,
  bhkType,
  conversation = [],
  metadata = {},
}) {
  if (useMongo) {
    const sessionDoc = await ChatSession.create({
      microsite,
      projectId: projectId || microsite,
      leadId,
      phone,
      bhkType,
      conversation,
      metadata,
    });

    return toPlainObject(sessionDoc);
  }

  const now = new Date().toISOString();
  const session = {
    id: crypto.randomUUID(),
    microsite,
    projectId: projectId || microsite,
    leadId,
    phone,
    bhkType,
    conversation,
    metadata,
    createdAt: now,
    updatedAt: now,
  };

  const store = await loadStore();
  store.sessions = [session, ...store.sessions];
  await saveStore(store);

  return session;
}

export async function listChatSessions({
  microsite,
  leadId,
  limit = 50,
  skip = 0,
} = {}) {
  if (useMongo) {
    const criteria = {};
    if (microsite) {
      criteria.microsite = microsite;
    }
    if (leadId) {
      criteria.leadId = leadId;
    }

    const numericLimit = Math.max(Number(limit) || 0, 0) || 50;
    const numericSkip = Math.max(Number(skip) || 0, 0);

    const total = await ChatSession.countDocuments(criteria);
    const items = await ChatSession.find(criteria)
      .sort({ createdAt: -1 })
      .skip(numericSkip)
      .limit(numericLimit)
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
  let collection = store.sessions;

  if (microsite) {
    collection = collection.filter((session) => session.microsite === microsite);
  }

  if (leadId) {
    collection = collection.filter((session) => session.leadId === leadId);
  }

  const total = collection.length;
  const items = collection.slice(Number(skip), Number(skip) + Number(limit));

  return { items, total };
}


