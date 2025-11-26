import crypto from "crypto";
import { config } from "../config.js";
import { WidgetConfig } from "../models/WidgetConfig.js";
import { toPlainObject } from "../utils/doc.js";
import { readJson, writeJson } from "./fileStore.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Import config file directly for Vercel (ensures it's included in build)
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const configFilePath = path.resolve(moduleDir, "../../data/widget-config.json");
// Also try from process.cwd() for Vercel
const configFilePathAlt = path.resolve(process.cwd(), "data/widget-config.json");

let widgetConfigData = null;
function loadConfigFile() {
  // On Vercel, the file structure is different - try multiple paths
  const cwd = process.cwd();
  const pathsToTry = [
    // Try relative to module first (local dev)
    configFilePath,
    // Try from various Vercel build locations
    path.join(cwd, "apps/api/data/widget-config.json"),
    path.join(cwd, "api/data/widget-config.json"),
    path.join(cwd, "data/widget-config.json"),
    path.join(cwd, "../data/widget-config.json"),
    path.join(cwd, "../../data/widget-config.json"),
    // Fallback: try from process.cwd() root
    configFilePathAlt,
  ];
  
  for (const filePath of pathsToTry) {
    try {
      const raw = readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      console.log(`✅ Config file loaded successfully from: ${filePath}`);
      console.log(`   CWD: ${cwd}`);
      console.log(`   Module dir: ${moduleDir}`);
      return parsed;
    } catch (error) {
      // Log each failed attempt in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`   Tried: ${filePath} - ${error.code || error.message}`);
      }
      continue;
    }
  }
  
  // If all paths failed, log detailed error
  console.error("❌ CRITICAL: Could not load config file from any path!");
  console.error("   Tried paths:", pathsToTry);
  console.error("   Current working directory:", cwd);
  console.error("   Module directory:", moduleDir);
  console.error("   Vercel environment:", !!process.env.VERCEL);
  console.error("   __dirname equivalent:", moduleDir);
  
  return null;
}

// Load config at module initialization
widgetConfigData = loadConfigFile();

const FILE_NAME = "widget-config.json";
const DEFAULT_STORE = { configs: [] };
const useMongo = config.dataStore === "mongo";

async function loadStore() {
  // If we have the config data loaded, use it (works on both Vercel and local)
  if (widgetConfigData) {
    return widgetConfigData;
  }
  
  // Fallback: try to load it now (in case it wasn't loaded at module init)
  const loaded = loadConfigFile();
  if (loaded) {
    widgetConfigData = loaded;
    return loaded;
  }
  
  // Last resort: try reading from file system (for local development)
  return readJson(FILE_NAME, DEFAULT_STORE);
}

async function saveStore(store) {
  await writeJson(FILE_NAME, store);
}

const DEFAULT_THEME = {
  agentName: "Riya from Homesfy",
  avatarUrl:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzlzZ2R4b3J2OHJ2MjFpd3RiZW5sbmxwOHVzb3RrdmNmZTh5Z25mYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/g9582DNuQppxC/giphy.gif",
  primaryColor: "#6158ff",
  followupMessage: "Sure… I’ll send that across right away!",
  bhkPrompt: "Which configuration you are looking for?",
  inventoryMessage: "That’s cool… we have inventory available with us.",
  phonePrompt: "Please enter your mobile number...",
  thankYouMessage: "Thanks! Our expert will call you shortly 📞",
  bubblePosition: "bottom-right",
  autoOpenDelayMs: 4000,
  welcomeMessage: "Hi, I’m Riya from Homesfy 👋\nHow can I help you today?",
};

const ALLOWED_FIELDS = [
  "agentName",
  "avatarUrl",
  "primaryColor",
  "followupMessage",
  "bhkPrompt",
  "inventoryMessage",
  "phonePrompt",
  "thankYouMessage",
  "bubblePosition",
  "autoOpenDelayMs",
  "welcomeMessage",
  "propertyInfo",
  "createdBy",
  "updatedBy",
];

function sanitizeUpdate(update = {}) {
  const sanitized = ALLOWED_FIELDS.reduce((acc, field) => {
    if (
      Object.prototype.hasOwnProperty.call(update, field) &&
      update[field] !== undefined
    ) {
      acc[field] = update[field];
    }
    return acc;
  }, {});
  
  // Always include propertyInfo if present, even if not in ALLOWED_FIELDS
  // This allows for nested object updates
  if (update.propertyInfo && typeof update.propertyInfo === "object") {
    sanitized.propertyInfo = update.propertyInfo;
  }
  
  return sanitized;
}

export async function getWidgetConfig(projectId) {
  // Log which storage we're using
  if (process.env.VERCEL && !useMongo) {
    console.log(`📁 getWidgetConfig(${projectId}): Using FILE storage (MongoDB disabled)`);
  }
  
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
  
  // Log store contents for debugging
  if (process.env.VERCEL) {
    console.log(`📁 Store loaded: ${store.configs?.length || 0} configs found`);
    console.log(`📁 Looking for projectId: ${projectId}`);
  }
  
  const existing = store.configs.find((item) => item.projectId === projectId);

  if (existing) {
    console.log(`✅ Found config for projectId: ${projectId}`);
    return existing;
  }
  
  console.log(`⚠️  Config not found for projectId: ${projectId}, creating default`);

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
  const sanitizedUpdate = sanitizeUpdate(update);

  if (useMongo) {
    let doc = await WidgetConfig.findOne({ projectId });

    if (!doc) {
      doc = new WidgetConfig({ projectId, ...DEFAULT_THEME });
    }

    Object.assign(doc, sanitizedUpdate, { projectId });
    await doc.save();

    return toPlainObject(doc);
  }

  const store = await loadStore();
  const now = new Date().toISOString();
  const index = store.configs.findIndex((item) => item.projectId === projectId);

  if (index === -1) {
    const config = {
      id: crypto.randomUUID(),
      projectId,
      ...DEFAULT_THEME,
      ...sanitizedUpdate,
      createdAt: now,
      updatedAt: now,
    };
    store.configs.push(config);
    await saveStore(store);
    return config;
  }

  const updated = {
    ...store.configs[index],
    ...sanitizedUpdate,
    projectId,
    updatedAt: now,
  };

  store.configs[index] = updated;
  await saveStore(store);
  return updated;
}


