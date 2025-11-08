import crypto from "crypto";
import { config } from "../config.js";
import { WidgetConfig } from "../models/WidgetConfig.js";
import { toPlainObject } from "../utils/doc.js";
import { readJson, writeJson } from "./fileStore.js";

const FILE_NAME = "widget-config.json";
const DEFAULT_STORE = { configs: [] };
const useMongo = config.dataStore === "mongo";

async function loadStore() {
  return readJson(FILE_NAME, DEFAULT_STORE);
}

async function saveStore(store) {
  await writeJson(FILE_NAME, store);
}

const DEFAULT_THEME = {
  agentName: "Riya from Homesfy",
  avatarUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzlzZ2R4b3J2OHJ2MjFpd3RiZW5sbmxwOHVzb3RrdmNmZTh5Z25mYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/g9582DNuQppxC/giphy.gif",
  primaryColor: "#6158ff",
  bubblePosition: "bottom-right",
  autoOpenDelayMs: 4000,
  welcomeMessage: "Hi, I’m Riya from Homesfy 👋\nHow can I help you today?",
};

export async function getWidgetConfig(projectId) {
  if (useMongo) {
    let configDoc = await WidgetConfig.findOne({ projectId }).lean();

    if (configDoc) {
      const normalized = { ...configDoc, id: configDoc._id.toString() };
      delete normalized._id;
      delete normalized.__v;
      return normalized;
    }

    const now = new Date().toISOString();
    const created = await WidgetConfig.create({
      projectId,
      ...DEFAULT_THEME,
      createdAt: now,
      updatedAt: now,
    });

    return toPlainObject(created);
  }

  const store = await loadStore();
  const existing = store.configs.find((item) => item.projectId === projectId);

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const config = {
    id: crypto.randomUUID(),
    projectId,
    ...DEFAULT_THEME,
    createdAt: now,
    updatedAt: now,
  };

  store.configs.push(config);
  await saveStore(store);
  return config;
}

export async function upsertWidgetConfig(projectId, update) {
  if (useMongo) {
    const now = new Date().toISOString();
    const updated = await WidgetConfig.findOneAndUpdate(
      { projectId },
      {
        $setOnInsert: { ...DEFAULT_THEME, projectId, createdAt: now },
        $set: { ...update, updatedAt: now },
      },
      {
        new: true,
        upsert: true,
        lean: true,
      }
    );

    return {
      ...updated,
      id: updated._id.toString(),
    };
  }

  const store = await loadStore();
  const now = new Date().toISOString();
  const index = store.configs.findIndex((item) => item.projectId === projectId);

  if (index === -1) {
    const config = {
      id: crypto.randomUUID(),
      projectId,
      ...DEFAULT_THEME,
      ...update,
      createdAt: now,
      updatedAt: now,
    };
    store.configs.push(config);
    await saveStore(store);
    return config;
  }

  const updated = {
    ...store.configs[index],
    ...update,
    projectId,
    updatedAt: now,
  };

  store.configs[index] = updated;
  await saveStore(store);
  return updated;
}


