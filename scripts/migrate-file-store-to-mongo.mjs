#!/usr/bin/env node

import crypto from "crypto";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(repoRoot, "apps/api/.env") });

process.env.DATA_STORE = "mongo";
process.env.DATA_DIRECTORY = path.join(repoRoot, "apps/api/data");

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error(
    "Missing MONGO_URI. Set it in apps/api/.env before running the migration."
  );
  process.exit(1);
}

const mongooseModulePath = path.join(
  repoRoot,
  "apps/api/node_modules/mongoose/index.js"
);
const mongoose = (
  await import(pathToFileURL(mongooseModulePath).href)
).default;

const fileStoreModulePath = path.join(
  repoRoot,
  "apps/api/src/storage/fileStore.js"
);
const { readJson } = await import(
  pathToFileURL(fileStoreModulePath).href
);
const { Lead } = await import(
  pathToFileURL(path.join(repoRoot, "apps/api/src/models/Lead.js")).href
);
const { Event } = await import(
  pathToFileURL(path.join(repoRoot, "apps/api/src/models/Event.js")).href
);
const { ChatSession } = await import(
  pathToFileURL(path.join(repoRoot, "apps/api/src/models/ChatSession.js")).href
);

const allowedBhkTypes = new Set([
  "1 Bhk",
  "1 BHK",
  "2 Bhk",
  "2 BHK",
  "3 Bhk",
  "3 BHK",
  "4 Bhk",
  "4 BHK",
  "Duplex",
  "Just Browsing",
  "Other",
  "Yet to decide",
]);

function toDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
});

const summary = {
  leadsInserted: 0,
  leadsSkipped: 0,
  sessionsInserted: 0,
  sessionsSkipped: 0,
  eventsInserted: 0,
  eventsSkipped: 0,
};

const { leads = [] } = await readJson("leads.json", { leads: [] });
for (const lead of leads) {
  if (!lead) continue;

  const legacyId = lead.id || crypto.randomUUID();
  const alreadyExists = await Lead.exists({
    "metadata.legacyId": legacyId,
  });
  if (alreadyExists) {
    summary.leadsSkipped += 1;
    continue;
  }

  const payload = {
    phone: lead.phone ?? null,
    bhk: lead.bhk,
    bhkType: allowedBhkTypes.has(lead.bhkType)
      ? lead.bhkType
      : "Yet to decide",
    microsite: lead.microsite || "unknown",
    leadSource: lead.leadSource || "ChatWidget",
    status: lead.status || "new",
    metadata: {
      ...(lead.metadata || {}),
      legacyId,
    },
    conversation: Array.isArray(lead.conversation)
      ? lead.conversation
      : [],
    createdAt: toDate(lead.createdAt) ?? new Date(),
    updatedAt: toDate(lead.updatedAt) ?? new Date(),
  };

  await Lead.create(payload);
  summary.leadsInserted += 1;
}

const { sessions = [] } = await readJson("chat-sessions.json", {
  sessions: [],
});
for (const session of sessions) {
  if (!session) continue;

  const legacyId = session.id || crypto.randomUUID();
  const alreadyExists = await ChatSession.exists({
    "metadata.legacyId": legacyId,
  });
  if (alreadyExists) {
    summary.sessionsSkipped += 1;
    continue;
  }

  const payload = {
    microsite: session.microsite || "unknown",
    projectId: session.projectId || session.microsite || "default",
    leadId: session.leadId || legacyId,
    phone: session.phone,
    bhkType: session.bhkType,
    conversation: Array.isArray(session.conversation)
      ? session.conversation
      : [],
    metadata: {
      ...(session.metadata || {}),
      legacyId,
    },
    createdAt: toDate(session.createdAt) ?? new Date(),
    updatedAt: toDate(session.updatedAt) ?? new Date(),
  };

  await ChatSession.create(payload);
  summary.sessionsInserted += 1;
}

const { events = [] } = await readJson("events.json", {
  events: [],
});
for (const event of events) {
  if (!event) continue;

  const legacyId = event.id || crypto.randomUUID();
  const alreadyExists = await Event.exists({
    "payload.legacyId": legacyId,
  });
  if (alreadyExists) {
    summary.eventsSkipped += 1;
    continue;
  }

  const payload = {
    type: event.type || "unknown",
    projectId: event.projectId || "default",
    microsite: event.microsite,
    payload: {
      ...(event.payload || {}),
      legacyId,
    },
    createdAt: toDate(event.createdAt) ?? new Date(),
    updatedAt: toDate(event.createdAt) ?? new Date(),
  };

  await Event.create(payload);
  summary.eventsInserted += 1;
}

await mongoose.disconnect();

console.log("Migration complete:");
console.table(summary);

